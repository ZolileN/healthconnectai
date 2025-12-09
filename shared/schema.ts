import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// Users table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  dateOfBirth: timestamp("date_of_birth"),
  gender: varchar("gender"),
  phone: varchar("phone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Symptom assessments
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  symptoms: jsonb("symptoms").notNull().$type<SymptomInput[]>(),
  bodyParts: text("body_parts").array(),
  additionalInfo: text("additional_info"),
  aiAnalysis: jsonb("ai_analysis").$type<AIAnalysisResult>(),
  urgencyLevel: varchar("urgency_level"), // low, medium, high, emergency
  recommendations: jsonb("recommendations").$type<Recommendation[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Consultations booking
export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  assessmentId: integer("assessment_id").references(() => assessments.id),
  doctorName: varchar("doctor_name"),
  doctorSpecialty: varchar("doctor_specialty"),
  scheduledAt: timestamp("scheduled_at"),
  status: varchar("status").default("pending"), // pending, confirmed, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Educational articles
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  slug: varchar("slug").notNull().unique(),
  category: varchar("category").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  imageUrl: varchar("image_url"),
  readTime: integer("read_time").default(5),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  assessments: many(assessments),
  consultations: many(consultations),
}));

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  user: one(users, { fields: [assessments.userId], references: [users.id] }),
  consultations: many(consultations),
}));

export const consultationsRelations = relations(consultations, ({ one }) => ({
  user: one(users, { fields: [consultations.userId], references: [users.id] }),
  assessment: one(assessments, { fields: [consultations.assessmentId], references: [assessments.id] }),
}));

// Types
export interface SymptomInput {
  name: string;
  bodyPart: string;
  severity: number; // 1-10
  duration: string;
  description?: string;
}

export interface PotentialCondition {
  name: string;
  probability: number; // 0-100
  description: string;
  severity: "mild" | "moderate" | "severe";
}

export interface AIAnalysisResult {
  conditions: PotentialCondition[];
  summary: string;
  disclaimer: string;
}

export interface Recommendation {
  type: "self-care" | "pharmacy" | "doctor" | "emergency";
  title: string;
  description: string;
  urgency: "low" | "medium" | "high" | "immediate";
}

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  createdAt: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
});

// Zod types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
