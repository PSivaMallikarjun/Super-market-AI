import { GoogleGenAI, Type, Schema } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Helper for Base64 ---
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

// --- Marketing Creative Audit ---
export const analyzeMarketingCreative = async (file: File) => {
  try {
    const mediaPart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          mediaPart,
          { text: `Act as a high-end Digital Marketing Strategist and Creative Director. 
          Analyze this advertisement creative (image or video).
          
          TASK:
          1. Evaluate visual "Customer Attractive Improvement Suggestions": What makes this visually weak or strong?
          2. Provide ROI Optimization: How can the layout, copy, or colors be changed to increase conversion rates?
          3. Insightful Sales Analytics: Based on visual cues, which demographic will this resonate with most?
          4. Suppression Strategy: Who should be EXCLUDED from this ad campaign (suppression) to maximize budget?
          5. ROI Prediction: Estimate an "Attention Score" (0-100) and an "ROI Potential Score" (0-100).
          
          Format the response with sections: VISUAL AUDIT, ROI OPTIMIZATION, SALES INSIGHTS, and SUPPRESSION STRATEGY.` }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Marketing Creative Audit Error:", error);
    throw error;
  }
};

// --- Theft & Shrinkage Detection ---
export const detectTheft = async (file: File) => {
  try {
    const mediaPart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          mediaPart,
          { text: `Act as a Senior Loss Prevention Specialist and Retail Security Analyst. 
          Analyze this security footage/image for suspicious behavior related to theft or shrinkage.
          
          TASK:
          1. Detect "Shelf Sweeping" (removing multiple high-value items rapidly).
          2. Identify "Concealment" (shoppers placing items in clothing, personal bags, or strollers).
          3. Flag "Unusual Handling" (tampering with security tags, hiding items behind other products).
          4. Observe "Shopper Body Language" for signs of nervousness or scanning for cameras/staff.
          5. Assess the "Risk Level" (Critical, High, Medium, Low).
          
          Provide a concise security report with SUSPICIOUS ACTIVITY LOG, RISK ASSESSMENT, and RECOMMENDED SECURITY RESPONSE.` }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Theft Detection Error:", error);
    throw error;
  }
};

// --- Promotional Display Monitoring ---
export const monitorPromotionalDisplay = async (file: File) => {
  try {
    const mediaPart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          mediaPart,
          { text: `Act as a Trade Marketing and Visual Merchandising Auditor. 
          Analyze this footage/image of a promotional display or end-cap.
          
          TASK:
          1. Identify the 'Campaign/Brand' being promoted.
          2. Evaluate the 'Display Integrity': Are the stands properly assembled? Is the signage straight and visible?
          3. Check 'Branding Visibility': Are logos obscured? Is the messaging clear?
          4. Assess 'Product Stocking': Are the shelves on the display well-stocked and fronted?
          5. Verify 'Placement': Is it in the correct location (e.g., end of aisle, near entrance)?
          
          Provide a structured audit report with clear headings for CAMPAIGN IDENTIFICATION, EXECUTION COMPLIANCE (Scale 1-10), and CORRECTIVE ACTIONS needed.` }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Promo Monitoring Error:", error);
    throw error;
  }
};

// --- Spoilage & Damage Detection ---
export const detectSpoilage = async (file: File) => {
  try {
    const mediaPart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          mediaPart,
          { text: `Act as a Supermarket Food Safety and Quality Assurance Inspector. 
          Analyze this footage/image for any signs of product spoilage, damage, or safety hazards.
          
          TASK:
          1. Identify "Damaged Packaging" (crushed boxes, dented cans, torn bags).
          2. Detect "Spills or Contamination" (leaking liquids on shelves or floors).
          3. Inspect "Fresh Produce" for signs of decay, mold, or over-ripening.
          4. If visible, check "Expiration Dates" using OCR and flag items past their prime.
          5. Categorize each issue by Severity (Critical, High, Medium, Low).
          
          Provide a structured report with DETECTED HAZARDS, SEVERITY ASSESSMENT, and IMMEDIATE ACTION PLAN.` }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Spoilage Detection Error:", error);
    throw error;
  }
};

// --- Shelf Space Optimisation Analysis ---
export const analyzeShelfSpace = async (file: File) => {
  try {
    const mediaPart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          mediaPart,
          { text: `Act as a Category Management and Retail Negotiator expert. 
          Analyze this footage/image of a supermarket shelf to measure Brand Share of Shelf.
          
          TASK:
          1. Identify all visible brands on the shelf.
          2. Estimate the "Percentage of Space" (Occupancy) each brand takes relative to the total shelf width.
          3. Count the number of "Facings" (units visible on the front row) per brand.
          4. Evaluate "Shelf Premiumness" (e.g., eye-level placement vs. bottom shelf).
          5. Provide negotiation insights: Are certain brands over-represented? Is the store's "Premium Space" being utilized by high-margin brands?
          
          Provide a structured analysis with clear headings for BRAND SPACE DISTRIBUTION, FACING AUDIT, and SUPPLIER NEGOTIATION INSIGHTS.` }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Shelf Space Analysis Error:", error);
    throw error;
  }
};

// --- Customer Behaviour Analysis ---
export const analyzeCustomerBehaviour = async (file: File) => {
  try {
    const mediaPart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          mediaPart,
          { text: `Act as a Retail Environment Psychologist and Store Layout Specialist. 
          Analyze this footage/image of customers in a supermarket aisle.
          
          TASK:
          1. Detect 'Hot Zones' (areas where multiple customers dwell or congregate).
          2. Identify 'High Attention Shelves' (where customers are looking or reaching).
          3. Pinpoint 'Dead Zones' (areas ignored by traffic).
          4. Suggest 'Layout Optimizations' to improve flow or cross-selling (e.g., placing chips near soda if customers spend time in both).
          
          Provide a structured analysis with clear headings for HEATMAP OBSERVATIONS, ATTENTION ANALYSIS, and OPTIMIZATION PLAN.` }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Behaviour Analysis Error:", error);
    throw error;
  }
};

// --- Inventory Forecasting ---
export const getInventoryForecast = async (productData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this product data and provide a demand forecast for next week. Data: ${JSON.stringify(productData)}`,
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
  } catch (error) {
    console.error("Forecast error:", error);
    throw error;
  }
};

// --- Out of Stock Prediction ---
export const predictOutOfStock = async (file: File, historicalContext: string) => {
  try {
    const mediaPart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          mediaPart,
          { text: `Act as a Predictive Logistics Analyst for a high-volume supermarket. 
          
          CONTEXT: This is the current visual state of the shelf. 
          HISTORICAL DATA: ${historicalContext}
          
          TASK:
          1. Estimate the 'Visible Fill Level' (0-100%) for the products in the frame.
          2. Calculate the 'Burn Rate' (how fast items are leaving) based on the visual density and historical velocity.
          3. Predict the 'Time to Zero' (TTZ) - how many hours/minutes until the shelf is empty.
          4. Provide a 'Replenishment Priority' (Critical, High, Medium, Low).
          
          Format the output as a structured prediction report with a 'Replenishment Window' recommendation.` }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("OOS Prediction Error:", error);
    throw error;
  }
};

// --- Customer Support Chat ---
export const getChatResponse = async (history: { role: string; parts: { text: string }[] }[], newMessage: string) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are a helpful, polite, and knowledgeable AI assistant for a supermarket. You help customers find products, suggest recipes, and answer store policy questions.",
      },
      history: history
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm having trouble connecting to the store database right now. Please try again later.";
  }
};

// --- Security / Vision Analysis ---
export const analyzeSecurityFeed = async (file: File) => {
  try {
    const imagePart = await fileToGenerativePart(file);
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
            imagePart,
            { text: "Analyze this supermarket shelf image. Identify if there are empty shelves that need restocking, or any safety hazards (spills, obstacles). Provide a status report." }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Vision error:", error);
    return "Unable to analyze the video feed at this moment.";
  }
};

// --- Shelf Stock Monitoring ---
export const monitorShelfStock = async (file: File) => {
  try {
    const imagePart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          imagePart,
          { text: `Act as a Retail Operations Specialist. Analyze this shelf image for stock levels and planogram compliance. 
          Identify:
          1. Empty spots (Out of Stock)
          2. Items pushed to the back (Low Stock)
          3. Items that appear misplaced (Planogram Mismatch)
          
          Provide a concise report with specific locations (e.g., 'Top shelf left', 'Middle shelf right') and a general 'Shelf Health Score' out of 100.` }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Shelf Monitoring Error:", error);
    throw error;
  }
};

// --- Visual Inventory Tracking & Recognition ---
export const trackInventoryVisually = async (file: File) => {
  try {
    const imagePart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          imagePart,
          { text: `Analyze this image of a supermarket shelf for detailed inventory tracking.
          
          Identify:
          1. Product Brand and Name.
          2. Estimate the total count of units visible.
          3. Detect any SKUs, Barcodes, or QR codes visible on price tags or packaging.
          4. Categorize each identified item.
          
          Return the data in a clear list format including: Brand, SKU/Label, Category, and Estimated Count. 
          Also provide an overall Confidence Score for the recognition session.` }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Visual Tracking Error:", error);
    throw error;
  }
};

// --- Pricing Tag & Label Detection ---
export const detectPricingIssues = async (file: File) => {
  try {
    const imagePart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          imagePart,
          { text: `Act as a Store Audit Specialist. Perform a 'Price & Promotion Audit' on this shelf.
          
          Tasks:
          1. Use OCR to read all visible price tags. List the product names and prices detected.
          2. Identify any 'Missing Tags' where products are visible but no price label is underneath.
          3. Validate 'Promotional Labels' (e.g., Sale, Clearance, BOGO). Check if they look correct or if they are expired/misplaced.
          4. Flag 'Incorrect Prices' if a tag seems to belong to a different product or has a formatting error.
          
          Format your response with:
          - DETECTED PRICES (List of items and prices)
          - PRICING DISCREPANCIES (List of specific issues)
          - AUDIT SUMMARY (Overall accuracy score and recommendations)` }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Pricing Audit Error:", error);
    throw error;
  }
};

// --- Planogram Compliance Audit ---
export const auditPlanogramCompliance = async (referenceFile: File, actualFile: File) => {
  try {
    const refPart = await fileToGenerativePart(referenceFile);
    const actualPart = await fileToGenerativePart(actualFile);
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: "COMPLIANCE AUDIT REQUEST. Image 1 is the Master Planogram (the goal). Image 2 is the actual shelf capture. Compare them carefully." },
          refPart,
          actualPart,
          { text: `As a Planogram Auditor:
          1. List all products that are out of position.
          2. Identify any missing products that should be present.
          3. Check 'facings' (e.g., if the planogram requires 3 slots for Brand A, does the actual shelf have 3?).
          4. Rate the overall compliance from 0% to 100%.
          5. Provide an Action Plan to fix the shelf.
          
          Format the response with clear headings: DISCREPANCIES, COMPLIANCE SCORE, and ACTION PLAN.` }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Planogram Audit Error:", error);
    throw error;
  }
};

// --- Marketing Generation ---
export const generateMarketingCampaign = async (productName: string, audience: string, generateImage: boolean = true, productImage?: File) => {
  try {
    let imagePart = null;
    if (productImage) {
      imagePart = await fileToGenerativePart(productImage);
    }

    let copyContents: any = `Write a catchy, short, and engaging social media ad copy for a supermarket product: ${productName}. Target Audience: ${audience}. Include emojis.`;
    
    if (imagePart) {
      copyContents = {
        parts: [
          imagePart,
          { text: `Write a catchy, short, and engaging social media ad copy for the product shown in this image. Product Name: ${productName}. Target Audience: ${audience}. Include emojis.` }
        ]
      };
    }

    const copyResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: copyContents,
    });
    
    const adCopy = copyResponse.text;
    let imageUrl: string | undefined = undefined;

    if (generateImage) {
      const imagePromptText = `Professional advertising photography of ${productName}, studio lighting, 4k, appetizing, high quality. Target audience: ${audience}.`;
      
      let imageContents: any = {
        parts: [{ text: imagePromptText }]
      };

      if (imagePart) {
         imageContents = {
            parts: [
                imagePart,
                { text: `Create a professional advertisement image featuring this product. ${imagePromptText}` }
            ]
         };
      }

      const imageResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: imageContents
      });

      if (imageResponse.candidates && imageResponse.candidates[0].content.parts) {
          for (const part of imageResponse.candidates[0].content.parts) {
              if (part.inlineData) {
                  imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                  break;
              }
          }
      }
    }

    return {
      copy: adCopy,
      imageUrl: imageUrl
    };

  } catch (error) {
    console.error("Marketing error:", error);
    throw error;
  }
};

// --- Dashboard Insights ---
export const getBusinessInsights = async (salesData: any[]) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Analyze this weekly sales data and provide 3 key business insights or actionable recommendations in JSON format. Data: ${JSON.stringify(salesData)}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        insights: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text || '{ "insights": [] }');
    } catch (error) {
        console.error("Insights error", error);
        return { insights: ["Could not generate insights at this time."]};
    }
}