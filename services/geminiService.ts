import { GoogleGenAI, Type } from "@google/genai";
import { Category, Recipe } from "../types";

// Helper to initialize AI safely. 
// Note: When deploying to GitHub Pages, process.env.API_KEY may need to be injected via a build tool.
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will use fallbacks.");
  }
  return new GoogleGenAI({ apiKey: apiKey || "" });
};

export const generateRecipeImage = async (title: string, category: string): Promise<string> => {
  const ai = getAI();
  if (!process.env.API_KEY) return `https://picsum.photos/seed/${encodeURIComponent(title)}/800/800`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { 
        parts: [{ 
          text: `A professional, minimalist food photography shot of ${title} for a wellness cookbook. High-end editorial style, natural soft lighting, neutral background, 1:1 aspect ratio, clean composition. ${category} dish.` 
        }] 
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return `https://picsum.photos/seed/${encodeURIComponent(title)}/800/800`;
  } catch (error) {
    console.error("Image generation failed:", error);
    return `https://picsum.photos/seed/${encodeURIComponent(title)}/800/800`;
  }
};

export const enrichRecipeText = async (title: string, category: Category): Promise<Partial<Recipe>> => {
  const ai = getAI();
  if (!process.env.API_KEY) {
    return {
      ingredients: ["API Key missing - please add ingredients manually"],
      instructions: ["AI enrichment requires a valid API key."]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a full healthy recipe for "${title}" in the category "${category}". 
                 Include a list of ingredients and step-by-step instructions. 
                 Format the output strictly as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of ingredients with quantities."
            },
            instructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Step-by-step cooking instructions."
            }
          },
          required: ["ingredients", "instructions"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Text enrichment failed:", error);
    return {
      ingredients: ["Error loading ingredients"],
      instructions: ["Could not fetch instructions automatically."]
    };
  }
};