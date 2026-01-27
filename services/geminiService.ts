import { GoogleGenAI, Type, Modality } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Audio Decoding Helpers (Removed as generateAppTourAudio is removed) ---
// export function decodeBase64(base64: string) {
//   const binaryString = atob(base64);
//   const len = binaryString.length;
//   const bytes = new Uint8Array(len);
//   for (let i = 0; i < len; i++) {
//     bytes[i] = binaryString.charCodeAt(i);
//   }
//   return bytes;
// }

// export async function decodeAudioData(
//   data: Uint8Array,
//   ctx: AudioContext,
//   sampleRate: number,
//   numChannels: number,
// ): Promise<AudioBuffer> {
//   const dataInt16 = new Int16Array(data.buffer);
//   const frameCount = dataInt16.length / numChannels;
//   const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

//   for (let channel = 0; channel < numChannels; channel++) {
//     const channelData = buffer.getChannelData(channel);
//     for (let i = 0; i < frameCount; i++) {
//       channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
//     }
//   }
//   return buffer;
// }

// --- English Only Tour Audio Generation (Strictly 2.5 Minutes) (Removed as AppDemo is removed) ---
// export const generateAppTourAudio = async () => {
//   try {
//     const prompt = `Act as the Lead AI Strategist for "Supermarket AI". 
//     Deliver a 2.5-minute executive briefing (approx 380 words) in English.
//     ... (rest of the prompt) ...
//     The tone must be authoritative, professional, and strategic. Use the full 150 seconds for a deep explanation.`;

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash-preview-tts",
//       contents: [{ parts: [{ text: prompt }] }],
//       config: {
//         responseModalities: [Modality.AUDIO],
//         speechConfig: {
//           voiceConfig: {
//             prebuiltVoiceConfig: { voiceName: 'Kore' }, // Professional narrator voice
//           },
//         },
//       },
//     });

//     const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
//     if (!base64Audio) throw new Error("No audio data returned");
    
//     return base64Audio;
//   } catch (error) {
//     console.error("Tour Audio Generation Error:", error);
//     throw error;
//   }
// };

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

export const trackInventoryVisually = async (file: File) => {
  try {
    const imagePart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [imagePart, { text: "Visually track inventory SKUs." }] }
    });
    return response.text;
  } catch (error) { console.error(error); throw error; }
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