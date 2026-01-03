
import { GoogleGenAI, Type } from "@google/genai";
import { OCRResult } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

export async function analyzeJapaneseImage(base64Image: string): Promise<OCRResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: `Perform a non-trivial grammatical analysis on this Japanese image. 
          1. Extract the full text.
          2. Provide a natural English translation.
          3. Break down ONLY the significant grammatical components. 
             - IGNORE punctuation, footnote markers, and simple particles like は, を, が, に, と, も.
             - FOCUS on verbs, adjectives, compound nouns, and advanced grammar patterns.
          For each significant component, provide the surface form, reading (hiragana), and a concise English definition or grammatical function.`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          originalText: {
            type: Type.STRING,
            description: "The full original Japanese text."
          },
          translation: {
            type: Type.STRING,
            description: "A natural English translation."
          },
          tokens: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                surface: { type: Type.STRING, description: "The Japanese word or phrase." },
                reading: { type: Type.STRING, description: "Reading in hiragana." },
                definition: { type: Type.STRING, description: "English meaning or function." },
                notes: { type: Type.STRING, description: "Optional nuance." }
              },
              required: ["surface", "reading", "definition"]
            }
          }
        },
        required: ["originalText", "translation", "tokens"]
      }
    }
  });

  const resultStr = response.text;
  if (!resultStr) throw new Error("Failed to get response from Gemini");
  
  return JSON.parse(resultStr) as OCRResult;
}
