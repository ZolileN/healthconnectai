import OpenAI from "openai";
import type { SymptomInput, AIAnalysisResult, Recommendation } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeSymptoms(
  symptoms: SymptomInput[],
  additionalInfo?: string
): Promise<{ analysis: AIAnalysisResult; recommendations: Recommendation[]; urgencyLevel: string }> {
  const symptomDescriptions = symptoms.map(s => 
    `- ${s.name} in ${s.bodyPart}: severity ${s.severity}/10, duration: ${s.duration}${s.description ? `, description: ${s.description}` : ''}`
  ).join('\n');

  const prompt = `You are a medical assessment AI assistant. Based on the following symptoms, provide a preliminary analysis.

IMPORTANT DISCLAIMER: This is NOT a medical diagnosis. This is for informational purposes only. The user should always consult with a qualified healthcare professional.

Symptoms reported:
${symptomDescriptions}

${additionalInfo ? `Additional information: ${additionalInfo}` : ''}

Please analyze these symptoms and provide:
1. A list of potential conditions (up to 3) with probability percentages, descriptions, and severity levels
2. A brief summary of the analysis
3. Recommendations categorized by type (self-care, pharmacy, doctor visit, or emergency)
4. An overall urgency level (low, medium, high, or emergency)

Respond in JSON format with this structure:
{
  "analysis": {
    "conditions": [
      {
        "name": "condition name",
        "probability": 0-100,
        "description": "brief description",
        "severity": "mild" | "moderate" | "severe"
      }
    ],
    "summary": "overall summary of assessment",
    "disclaimer": "standard medical disclaimer"
  },
  "recommendations": [
    {
      "type": "self-care" | "pharmacy" | "doctor" | "emergency",
      "title": "recommendation title",
      "description": "detailed recommendation",
      "urgency": "low" | "medium" | "high" | "immediate"
    }
  ],
  "urgencyLevel": "low" | "medium" | "high" | "emergency"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a helpful medical assessment assistant. Always remind users that your analysis is not a substitute for professional medical advice. Be thorough but cautious in your assessments."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(content);
    
    return {
      analysis: result.analysis as AIAnalysisResult,
      recommendations: result.recommendations as Recommendation[],
      urgencyLevel: result.urgencyLevel as string,
    };
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    
    return {
      analysis: {
        conditions: [],
        summary: "Unable to complete analysis at this time. Please consult with a healthcare professional.",
        disclaimer: "This system encountered an error. Please seek professional medical advice for your symptoms."
      },
      recommendations: [
        {
          type: "doctor",
          title: "Consult a Healthcare Professional",
          description: "We recommend scheduling an appointment with a doctor to discuss your symptoms.",
          urgency: "medium"
        }
      ],
      urgencyLevel: "medium"
    };
  }
}
