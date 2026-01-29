import { GoogleGenAI, Type, Modality } from "@google/genai";
import { RecognizedProduct } from "../types"; // Import RecognizedProduct type

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Existing Helpers ---
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeMarketingCreative = async (file: File) => {
  try {
    const mediaPart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          mediaPart,
          { text: `Analyze this ad creative. Provide: 1. Visual Audit 2. ROI Optimization 3. Sales Insights 4. Suppression Strategy.` }
        ]
      }
    });
    return response.text;
  } catch (error) { console.error(error); throw error; }
};

export const detectTheft = async (file: File) => {
  try {
    const mediaPart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          mediaPart,
          { text: `Detect suspicious behavior: shelf sweeping, concealment, or unusual handling. Provide a risk report.` }
        ]
      }
    });
    return response.text;
  } catch (error) { console.error(error); throw error; }
};

export const monitorPromotionalDisplay = async (file: File) => {
  try {
    const mediaPart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          mediaPart,
          { text: `Audit this promo display for branding and compliance.` }
        ]
      }
    });
    return response.text;
  } catch (error) { console.error(error); throw error; }
};

export const detectSpoilage = async (file: File) => {
  try {
    const mediaPart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          mediaPart,
          { text: `Detect spoilage, damage, or spills.` }
        ]
      }
    });
    return response.text;
  } catch (error) { console.error(error); throw error; }
};

export const analyzeShelfSpace = async (file: File) => {
  try {
    const mediaPart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          mediaPart,
          { text: `Analyze brand share of shelf and facings.` }
        ]
      }
    });
    return response.text;
  } catch (error) { console.error(error); throw error; }
};

export const analyzeCustomerBehaviour = async (file: File) => {
  try {
    const mediaPart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          mediaPart,
          { text: `Analyze customer hot zones and dwell time.` }
        ]
      }
    });
    return response.text;
  } catch (error) { console.error(error); throw error; }
};

export const getInventoryForecast = async (productData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze: ${JSON.stringify(productData)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            predictedDemand: { type: Type.NUMBER },
            reorderRecommendation: { type: Type.BOOLEAN },
            suggestedOrderQuantity: { type: Type.INTEGER }
          },
          required: ["analysis", "predictedDemand", "reorderRecommendation", "suggestedOrderQuantity"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { console.error(error); throw error; }
};

export const predictOutOfStock = async (file: File, historicalContext: string) => {
  try {
    const mediaPart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          mediaPart,
          { text: `Predict time to zero for these items. Context: ${historicalContext}` }
        ]
      }
    });
    return response.text;
  } catch (error) { console.error(error); throw error; }
};

export const getChatResponse = async (history: any[], newMessage: string) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: { systemInstruction: "You are a helpful supermarket AI assistant." },
      history: history
    });
    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) { console.error(error); return "Error connecting."; }
};

export const analyzeSecurityFeed = async (file: File) => {
  try {
    const imagePart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [imagePart, { text: "Analyze security and stock levels." }] }
    });
    return response.text;
  } catch (error) { console.error(error); return "Error."; }
};

export const monitorShelfStock = async (file: File) => {
  try {
    const imagePart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [imagePart, { text: "Monitor shelf stock levels." }] }
    });
    return response.text;
  } catch (error) { console.error(error); throw error; }
};

export const trackInventoryVisually = async (file: File): Promise<RecognizedProduct[]> => {
  try {
    const imagePart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { 
        parts: [
          imagePart, 
          { text: "Visually track inventory SKUs on this shelf. For each distinct product, identify its brand, category, and count. Generate a mock SKU if not explicit. Provide a confidence score for each detection (0.0 to 1.0). Return the output as a JSON array of objects with 'brand', 'sku', 'category', 'count', and 'confidence' properties." }
        ] 
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: 'Unique identifier for the recognized product.' },
              brand: { type: Type.STRING, description: 'The brand and name of the product.' },
              sku: { type: Type.STRING, description: 'A unique SKU identifier for the product.' },
              category: { type: Type.STRING, description: 'The product category (e.g., Beverages, Snacks, Dairy).' },
              count: { type: Type.INTEGER, description: 'The visible count of the product.' },
              confidence: { type: Type.NUMBER, description: 'Confidence score of detection (0.0 - 1.0).' },
            },
            required: ["id", "brand", "sku", "category", "count", "confidence"]
          }
        }
      }
    });
    const jsonStr = response.text?.trim();
    if (!jsonStr) {
      throw new Error("No JSON response from AI for inventory tracking.");
    }
    // Attempt to parse JSON, handle cases where it might be wrapped in markdown
    const cleanedJsonStr = jsonStr.startsWith('```json') && jsonStr.endsWith('```') 
                           ? jsonStr.substring(7, jsonStr.length - 3) 
                           : jsonStr;
    const jsonResult = JSON.parse(cleanedJsonStr);
    return jsonResult as RecognizedProduct[];
  } catch (error) {
    console.error("Error tracking inventory visually:", error);
    // Return empty array on error to prevent crashing and allow UI to show "No detections"
    return []; 
  }
};

export const detectPricingIssues = async (file: File) => {
  try {
    const imagePart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [imagePart, { text: "Detect pricing and tag issues." }] }
    });
    return response.text;
  } catch (error) { console.error(error); throw error; }
};

export const auditPlanogramCompliance = async (referenceFile: File, actualFile: File) => {
  try {
    const refPart = await fileToGenerativePart(referenceFile);
    const actualPart = await fileToGenerativePart(actualFile);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [refPart, actualPart, { text: "Compare planogram compliance." }] }
    });
    return response.text;
  } catch (error) { console.error(error); throw error; }
};

export const generateMarketingCampaign = async (productName: string, audience: string, generateImage: boolean = true, productImage?: File) => {
  try {
    let imagePart = null;
    if (productImage) imagePart = await fileToGenerativePart(productImage);
    const copyResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ad copy for ${productName} targeting ${audience}.`
    });
    let imageUrl = undefined;
    if (generateImage) {
      const imgRes = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: `Ad photography of ${productName}.`
      });
      imageUrl = `data:image/png;base64,${imgRes.candidates[0].content.parts.find(p => p.inlineData)?.inlineData.data}`;
    }
    return { copy: copyResponse.text, imageUrl };
  } catch (error) { console.error(error); throw error; }
};

export const getBusinessInsights = async (salesData: any[]) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Analyze: ${JSON.stringify(salesData)}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { insights: { type: Type.ARRAY, items: { type: Type.STRING } } }
                }
            }
        });
        return JSON.parse(response.text || '{ "insights": [] }');
    } catch (error) { console.error(error); return { insights: [] }; }
}