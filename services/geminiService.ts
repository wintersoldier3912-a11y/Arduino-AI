
import { GoogleGenAI, Chat, GenerateContentResponse, Modality } from "@google/genai";
import { MASTER_SYSTEM_INSTRUCTION } from "../constants";

const getAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not set.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    const ai = getAI();
    chatSession = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: MASTER_SYSTEM_INSTRUCTION,
        temperature: 0.5, // Lower temperature for more deterministic Arduino code
        responseMimeType: "application/json"
      },
    });
  }
  return chatSession;
};

export interface MultiAgentResponse {
    text: string;
    metadata: any;
}

export const sendMessageToGemini = async (message: string): Promise<MultiAgentResponse> => {
    const chat = getChatSession();
    try {
        const result = await chat.sendMessage({ message: `Context: Arduino Ecosystem Only. Request: ${message}` });
        const responseText = result.text || "{}";
        try {
            const parsed = JSON.parse(responseText);
            return {
                text: parsed.text || "No response text.",
                metadata: parsed.metadata || {}
            };
        } catch (e) {
            return {
                text: responseText,
                metadata: { error: "Parse Error", raw: responseText }
            };
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};

export const generateSpeech = async (text: string, voiceName: string = 'Kore'): Promise<Uint8Array | null> => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Read clearly: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            return decodeBase64(base64Audio);
        }
        return null;
    } catch (error) {
        return null;
    }
};

function decodeBase64(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

export const analyzeCode = async (code: string): Promise<string> => {
    const ai = getAI();
    const prompt = `Task: Arduino Sketch Analysis\nRole: debug-agent\nAnalyze this Arduino .ino code for common logic errors like blocking delays, missing Serial.begin, or improper pin initialization.\nCode:\n${code}`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    return response.text || "{}";
};

export const analyzeCircuit = async (description: string): Promise<string> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Task: Arduino Pinout Analysis\nAnalyze the following Arduino wiring description for pin conflicts or voltage hazards:\n${description}`,
    });
    return response.text || "No analysis available.";
};

export const analyzeVisionFrame = async (imageBase64: string, projectContext: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
          { text: `Task: Arduino Vision Inspection\nContext: Identifying Arduino boards and components for: ${projectContext}` }
        ]
      },
  });
  return response.text || "Unable to analyze frame.";
};

export const generateConceptExplanation = async (concept: string, skillLevel: string): Promise<string> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Task: Arduino Tutorial\nExplain "${concept}" specifically within the context of Arduino programming and hardware for a ${skillLevel} level learner.`,
    });
    return response.text || "No explanation available.";
};

export const generateProjectReference = async (title: string, components: string[], skillLevel: string): Promise<string> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Task: Arduino Technical Documentation\nCreate an Arduino project guide for "${title}".\nComponents: ${components.join(', ')}\nLevel: ${skillLevel}\nInclude Arduino wiring map and logic summary.`,
    });
    return response.text || "No guide available.";
};

export const generateCustomProject = async (userIdea: string, skillLevel: string): Promise<string> => {
    const ai = getAI();
     const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Task: Arduino Project Blueprint\nDesign a custom Arduino project for: "${userIdea}"\nTarget Level: ${skillLevel}`,
        config: { responseMimeType: 'application/json' }
    });
    return response.text || "{}";
};

export const generateComponentRecommendation = async (searchTerm: string, skillLevel: string): Promise<string> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Task: Arduino Component Procurement\nRecommend Arduino-compatible parts for: "${searchTerm}"\nLevel: ${skillLevel}`,
        config: { responseMimeType: 'application/json' }
    });
    return response.text || "[]";
};

export const analyzeComponentCompatibility = async (componentNames: string[], context: string): Promise<string> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Task: Arduino Compatibility Audit\nCheck if these parts work together on an Arduino board: ${componentNames.join(', ')}\nProject Goal: ${context}`,
    });
    return response.text || "No analysis available.";
};
