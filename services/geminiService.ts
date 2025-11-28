import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is not defined in process.env");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// Helper to strip the data:image/...;base64, prefix
const stripBase64Prefix = (dataUri: string): string => {
  return dataUri.split(',')[1] || dataUri;
};

// Helper to determine mime type from data URI
const getMimeType = (dataUri: string): string => {
  const match = dataUri.match(/^data:(.+);base64,/);
  return match ? match[1] : 'image/png';
};

/**
 * Generates an edited version of the image based on the prompt using Gemini 2.5 Flash Image.
 */
export const generateImageEdit = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  try {
    const mimeType = getMimeType(base64Image);
    const rawBase64 = stripBase64Prefix(base64Image);

    // Using 'gemini-2.5-flash-image'
    const modelId = 'gemini-2.5-flash-image';

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              data: rawBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    let generatedImageUrl = '';

    // Iterate through parts to find the image
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Response = part.inlineData.data;
          generatedImageUrl = `data:image/png;base64,${base64Response}`;
          break; 
        } else if (part.text) {
            console.log("Model Text Output:", part.text);
        }
      }
    }

    if (!generatedImageUrl) {
      throw new Error("No image was generated. The model might have refused the request or returned only text.");
    }

    return generatedImageUrl;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};