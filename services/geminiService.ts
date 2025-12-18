
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { MASTER_SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

// Initialize GoogleGenAI using the recommended pattern
export const initializeGemini = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is not set in environment variables.");
    return;
  }
  genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Initialize or return the existing chat session
export const getChatSession = (): Chat => {
  if (!genAI) {
     initializeGemini();
  }
  
  if (!genAI) {
      throw new Error("Failed to initialize GoogleGenAI. Check API Key.");
  }

  if (!chatSession) {
    chatSession = genAI.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: MASTER_SYSTEM_INSTRUCTION,
        temperature: 0.7,
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

// Send message to the multi-agent system and handle JSON response
export const sendMessageToGemini = async (message: string): Promise<MultiAgentResponse> => {
    const chat = getChatSession();
    
    try {
        const result = await chat.sendMessage({ message });
        const responseText = result.text || "{}";
        
        try {
            const parsed = JSON.parse(responseText);
            return {
                text: parsed.text || "No response text.",
                metadata: parsed.metadata || {}
            };
        } catch (e) {
            console.error("Failed to parse agent JSON:", responseText);
            return {
                text: responseText,
                metadata: { error: "Parse Error" }
            };
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};

// Analyze code for bugs and quality issues
export const analyzeCode = async (code: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `Analyze the following Arduino C++ code as the debug-agent.
    Return a JSON object with:
    1. "summary": A brief string summarizing the quality.
    2. "issues": An array of objects: {line, severity, message, suggestion}
    Code:
    ${code}`;

    const response = await genAI.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            responseMimeType: 'application/json'
        }
    });

    return response.text || "{}";
};

// Analyze a text-based circuit description for safety and logic
export const analyzeCircuit = async (description: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `Analyze the circuit description as the safety-agent and hardware-agent.
    Circuit: ${description}`;

    const response = await genAI.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
    });

    return response.text || "No analysis available.";
};

// Analyze an image frame to identify components and wiring
export const analyzeVisionFrame = async (imageBase64: string, projectContext: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `Vision Agent: Analyze this frame for ${projectContext}. Identify components and wiring. Highlight safety risks.`;

    const response = await genAI.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
            { text: prompt }
          ]
        },
    });

    return response.text || "Unable to analyze frame.";
};

// Generate technical explanations for engineering concepts
export const generateConceptExplanation = async (concept: string, skillLevel: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `UX Tutor Agent: Explain "${concept}" for ${skillLevel} level.`;

    const response = await genAI.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
    });

    return response.text || "No explanation available.";
};

// Produce technical reference material for projects
export const generateProjectReference = async (title: string, components: string[], skillLevel: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `Doc Agent: Create a Technical Reference for "${title}" with components ${components.join(', ')}. Target: ${skillLevel}.`;

    const response = await genAI.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
    });

    return response.text || "No guide available.";
};

// Generate a complete custom project structure from an idea
export const generateCustomProject = async (userIdea: string, skillLevel: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `Planner Agent: Design a project for: "${userIdea}". Level: ${skillLevel}. Return JSON Project object.`;

     const response = await genAI.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });

    return response.text || "{}";
};

// Recommend components based on a search query
export const generateComponentRecommendation = async (searchTerm: string, skillLevel: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `As the procure-agent, recommend 3 Arduino-compatible components for: "${searchTerm}". 
    The user skill level is ${skillLevel}.
    Return a JSON array of objects with: "name", "type", "approximatePrice", "reasonForRecommendation".`;

    const response = await genAI.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            responseMimeType: 'application/json'
        }
    });

    return response.text || "[]";
};

// Check compatibility between a list of components
export const analyzeComponentCompatibility = async (componentNames: string[], context: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `As the hardware-agent and safety-agent, analyze the compatibility of these components: ${componentNames.join(', ')}.
    Context: ${context || 'General prototyping'}.
    Check for voltage mismatches, pin conflicts, and power requirements. 
    Return a detailed Markdown report.`;

    const response = await genAI.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
    });

    return response.text || "No analysis available.";
};
