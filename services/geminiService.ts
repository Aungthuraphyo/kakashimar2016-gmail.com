
import { GoogleGenAI, Type } from "@google/genai";
import { BrandData, FullAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMarketingPerformance = async (data: BrandData[], language: 'en' | 'my'): Promise<FullAnalysis> => {
  const isMyanmar = language === 'my';
  const languageName = isMyanmar ? 'Myanmar (Burmese)' : 'English';
  
  const prompt = `
    Act as an Expert Digital Marketing Analyst specializing in the Myanmar Market.
    Analyze the following campaign data:
    ${JSON.stringify(data, null, 2)}

    MANDATORY INSTRUCTIONS:
    1. PLATFORM CONTEXT: Each brand uses specific platforms (Facebook, TikTok, etc.). Analyze their performance based on Myanmar's current platform trends (e.g., Facebook for reach, TikTok for Gen Z engagement, Messenger for conversions).
    2. CATEGORY ANALYSIS: If category is "Other/အခြား", use 'customCategory'.
    3. ANALYSIS DEPTH: Professional ${languageName} insights. Calculate ROI. Evaluate KPIs. 
    4. BRAND AUDIT: Provide industry-specific and platform-specific growth steps.
    
    JSON Output structure:
    - tableData: [brandName, category, month, totalSpend, totalReach, engagementRate, conversions, revenue, roi, kpiName, kpiValue, status, googleBusinessStatus, googleBusinessUrl]
    - executiveSummary: (String in ${languageName})
    - criticalInsights: (Array of strings in ${languageName})
    - brandSpotlights: (Array of objects in ${languageName})
    - strategicRecommendations: (Array of objects in ${languageName})
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tableData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                brandName: { type: Type.STRING },
                category: { type: Type.STRING },
                month: { type: Type.STRING },
                totalSpend: { type: Type.NUMBER },
                totalReach: { type: Type.NUMBER },
                engagementRate: { type: Type.NUMBER },
                conversions: { type: Type.NUMBER },
                revenue: { type: Type.NUMBER },
                roi: { type: Type.NUMBER },
                kpiName: { type: Type.STRING },
                kpiValue: { type: Type.NUMBER },
                status: { type: Type.STRING },
                googleBusinessStatus: { type: Type.STRING },
                googleBusinessUrl: { type: Type.STRING }
              },
              required: ["brandName", "category", "month", "totalSpend", "totalReach", "engagementRate", "conversions", "revenue", "roi", "kpiName", "kpiValue", "status", "googleBusinessStatus", "googleBusinessUrl"]
            }
          },
          executiveSummary: { type: Type.STRING },
          criticalInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
          brandSpotlights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                brandName: { type: Type.STRING },
                category: { type: Type.STRING },
                summary: { type: Type.STRING },
                positives: { type: Type.ARRAY, items: { type: Type.STRING } },
                negatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                googleBusinessAnalysis: { type: Type.STRING }
              },
              required: ["brandName", "category", "summary", "positives", "negatives", "googleBusinessAnalysis"]
            }
          },
          strategicRecommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                brandName: { type: Type.STRING },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["brandName", "steps"]
            }
          }
        },
        required: ["tableData", "executiveSummary", "criticalInsights", "brandSpotlights", "strategicRecommendations"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Parsing failed:", error);
    throw new Error("AI output parsing error.");
  }
};
