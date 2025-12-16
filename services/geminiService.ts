import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

export const initializeGemini = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is not set in environment variables.");
    return;
  }
  genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getChatSession = (): Chat => {
  if (!genAI) {
     initializeGemini();
  }
  
  if (!genAI) {
      throw new Error("Failed to initialize GoogleGenAI. Check API Key.");
  }

  if (!chatSession) {
    chatSession = genAI.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<AsyncIterable<string>> => {
    const chat = getChatSession();
    
    try {
        const result = await chat.sendMessageStream({ message });
        
        // Return an async iterable that yields text chunks
        return {
            [Symbol.asyncIterator]: async function* () {
                for await (const chunk of result) {
                    const c = chunk as GenerateContentResponse;
                    if (c.text) {
                        yield c.text;
                    }
                }
            }
        };
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};

export const generateProjectRecommendation = async (skillLevel: string, interests: string[]): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `Recommend 3 specific Arduino projects for a user with skill level: ${skillLevel} who is interested in: ${interests.join(', ')}. Return the response as a JSON array of objects with keys: title, description, components. Do not use markdown code blocks, just raw JSON.`;

    const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json'
        }
    });

    return response.text || "[]";
};

export const generateComponentRecommendation = async (query: string, skillLevel: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `The user is looking for an Arduino component. Query: "${query}". User Skill Level: ${skillLevel}. 
    Suggest 3 suitable components. Return a JSON array with keys: name, type, reasonForRecommendation, approximatePrice.
    Do not use markdown code blocks, just raw JSON.`;

    const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json'
        }
    });

    return response.text || "[]";
}