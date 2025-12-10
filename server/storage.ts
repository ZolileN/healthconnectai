import {
  users,
  assessments,
  consultations,
  articles,
  SymptomInput,
  AIAnalysisResult,
  PotentialCondition,
  Recommendation,
  type User,
  type UpsertUser,
  type Assessment,
  type InsertAssessment,
  type Consultation,
  type InsertConsultation,
  type Article,
  type InsertArticle,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessments(userId: string): Promise<Assessment[]>;
  getAssessmentById(id: number): Promise<Assessment | undefined>;
  
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  getConsultations(userId: string): Promise<Consultation[]>;
  updateConsultationStatus(id: number, status: string): Promise<Consultation | undefined>;
  
  getArticles(): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
  // Validate symptoms
  if (!Array.isArray(assessment.symptoms)) {
    throw new Error('Symptoms must be an array');
  }

  // Process symptoms with type safety
  const validSymptoms = assessment.symptoms.map((symptom: unknown) => {
    if (!symptom || typeof symptom !== 'object') {
      throw new Error('Each symptom must be an object');
    }

    const symptomObj = symptom as Record<string, unknown>;
    const { name, bodyPart, severity, duration, description } = symptomObj;

    // Type validation
    if (
      typeof name !== 'string' || 
      typeof bodyPart !== 'string' || 
      typeof severity !== 'number' || 
      typeof duration !== 'string'
    ) {
      throw new Error('Each symptom must have name (string), bodyPart (string), severity (number), and duration (string)');
    }

    // Build validated symptom object
    const validSymptom: SymptomInput = {
      name,
      bodyPart,
      severity,
      duration,
      ...(description && typeof description === 'string' ? { description } : {})
    };

    return validSymptom;
  });

  // Process recommendations if they exist
  const validRecommendations = assessment.recommendations?.map(rec => {
    if (typeof rec !== 'object' || rec === null) {
      throw new Error('Each recommendation must be an object');
    }

    const { type, title, description, urgency } = rec as Record<string, unknown>;

    // Validate recommendation fields
    if (
      typeof type !== 'string' ||
      typeof title !== 'string' ||
      typeof description !== 'string' ||
      (urgency !== 'low' && urgency !== 'medium' && urgency !== 'high' && urgency !== 'immediate')
    ) {
      throw new Error('Invalid recommendation format');
    }

    return {
      type: type as 'self-care' | 'pharmacy' | 'doctor' | 'emergency',
      title,
      description,
      urgency
    } as const;
  });

  // Process AI analysis if it exists
  let validAiAnalysis: AIAnalysisResult | undefined;
  if (assessment.aiAnalysis) {
    const { conditions, summary, disclaimer } = assessment.aiAnalysis;

    if (!Array.isArray(conditions)) {
      throw new Error('AI analysis conditions must be an array');
    }

    validAiAnalysis = {
      conditions: conditions.map(condition => {
        if (typeof condition !== 'object' || condition === null) {
          throw new Error('Each condition must be an object');
        }

        const { name, probability, description, severity } = condition as Record<string, unknown>;

        if (
          typeof name !== 'string' ||
          typeof probability !== 'number' ||
          typeof description !== 'string' ||
          (severity !== 'mild' && severity !== 'moderate' && severity !== 'severe')
        ) {
          throw new Error('Invalid condition format');
        }

        return {
          name,
          probability,
          description,
          severity
        };
      }),
      summary: String(assessment.aiAnalysis.summary || ''),
      disclaimer: String(assessment.aiAnalysis.disclaimer || '')
    };
  }

  // Create the final assessment object with validated data
  const assessmentData = {
    userId: assessment.userId,
    symptoms: validSymptoms,
    bodyParts: assessment.bodyParts || [],
    additionalInfo: assessment.additionalInfo || null,
    urgencyLevel: assessment.urgencyLevel || null,
    ...(validRecommendations && { recommendations: validRecommendations }),
    ...(validAiAnalysis && { aiAnalysis: validAiAnalysis })
  };

  // Insert into database
  const [newAssessment] = await db
    .insert(assessments)
    .values(assessmentData)
    .returning();

  return newAssessment;
}

  async getAssessments(userId: string): Promise<Assessment[]> {
    return await db
      .select()
      .from(assessments)
      .where(eq(assessments.userId, userId))
      .orderBy(desc(assessments.createdAt));
  }

  async getAssessmentById(id: number | string): Promise<Assessment | undefined> {
    try {
      // Convert id to number if it's a string
      const assessmentId = typeof id === 'string' ? parseInt(id, 10) : id;
      
      // Validate the ID
      if (isNaN(assessmentId) || !Number.isInteger(assessmentId) || assessmentId <= 0) {
        console.error(`Invalid assessment ID: ${id}`);
        return undefined;
      }

      const [assessment] = await db
        .select()
        .from(assessments)
        .where(eq(assessments.id, assessmentId));
        
      return assessment;
    } catch (error) {
      console.error('Error in getAssessmentById:', error);
      return undefined;
    }
  }

  async createConsultation(consultation: InsertConsultation): Promise<Consultation> {
    const [newConsultation] = await db
      .insert(consultations)
      .values(consultation)
      .returning();
    return newConsultation;
  }

  async getConsultations(userId: string): Promise<Consultation[]> {
    return await db
      .select()
      .from(consultations)
      .where(eq(consultations.userId, userId))
      .orderBy(desc(consultations.createdAt));
  }

  async updateConsultationStatus(id: number, status: string): Promise<Consultation | undefined> {
    const [updated] = await db
      .update(consultations)
      .set({ status })
      .where(eq(consultations.id, id))
      .returning();
    return updated;
  }

  async getArticles(): Promise<Article[]> {
    return await db
      .select()
      .from(articles)
      .orderBy(desc(articles.createdAt));
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.slug, slug));
    return article;
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const [newArticle] = await db
      .insert(articles)
      .values(article)
      .returning();
    return newArticle;
  }
}

export const storage = new DatabaseStorage();
