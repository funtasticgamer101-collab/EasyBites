import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Meal {
  id: string;
  day: number;
  mealTime: string;
  name: string;
  type: string;
  description: string;
  ingredients: Ingredient[];
  prepTime: string;
}

interface RawMealData {
  day?: number;
  mealTime?: string;
  name: string;
  type: string;
  description: string;
  ingredients: Ingredient[];
  prepTime: string;
}

export async function generateMealPlan(keyword: string, allergies: string, exclusions: string, mealTypes: string[]): Promise<Meal[]> {
  const allergyPrompt = allergies ? `\n5. ALLERGIES (CRITICAL): You MUST NOT use any ingredients related to these allergies: ${allergies}.` : "";
  const exclusionPrompt = exclusions ? `\n6. EXCLUSIONS: Do NOT include these ingredients: ${exclusions}.` : "";
  
  const typesToGenerate = mealTypes.length > 0 ? mealTypes : ["Dinner"];
  const typesStr = typesToGenerate.join(", ");
  const totalMeals = 7 * typesToGenerate.length;

  const prompt = `You are an expert culinary assistant designing a 7-day meal plan for ONE person.
CRITICAL RULES:
1. The meals MUST be extremely EASY to make (minimal prep, minimal cleanup).
2. Focus ONLY on comfort food.
3. The user provided this keyword/craving: "${keyword}". Incorporate this vibe, ingredient, or theme into the week's meals.
4. For EACH of the 7 days, you MUST generate a meal for these specific meal times: ${typesStr}.
5. You must generate exactly ${totalMeals} meals in total (${typesToGenerate.length} meals per day for 7 days).${allergyPrompt}${exclusionPrompt}

Return a JSON array of exactly ${totalMeals} objects.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.INTEGER, description: "Day number (1-7)" },
            mealTime: { type: Type.STRING, description: "Meal time (e.g., Breakfast, Lunch, Dinner)" },
            name: { type: Type.STRING, description: "Name of the meal" },
            type: { type: Type.STRING, description: "Type of comfort food (e.g., American Comfort)" },
            description: { type: Type.STRING, description: "Short, appetizing description" },
            prepTime: { type: Type.STRING, description: "Estimated time (e.g., '15 mins')" },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Ingredient name" },
                  amount: { type: Type.STRING, description: "Amount for one person" }
                },
                required: ["name", "amount"]
              }
            }
          },
          required: ["day", "mealTime", "name", "type", "description", "prepTime", "ingredients"]
        }
      }
    }
  });

  const jsonStr = response.text?.trim() || "[]";
  try {
    const data = JSON.parse(jsonStr) as RawMealData[];
    return data.map((item, index) => ({
      id: `meal-${Date.now()}-${index}`,
      day: item.day || Math.floor(index / typesToGenerate.length) + 1,
      mealTime: item.mealTime || typesToGenerate[index % typesToGenerate.length],
      name: item.name,
      type: item.type,
      description: item.description,
      ingredients: item.ingredients,
      prepTime: item.prepTime,
    }));
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Failed to generate meal plan. Please try again.");
  }
}
