
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
            // Fallback for non-JSON responses if the model drifts
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

// Analyze code for bugs and quality issues - Using debug-agent persona
export const analyzeCode = async (code: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `Task: Code Analysis
Role: debug-agent
Analyze the following Arduino C++ code for syntax, logic, and style.
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

// Analyze a text-based circuit description for safety and logic - Using safety-agent persona
export const analyzeCircuit = async (description: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `Task: Circuit Analysis
Role: safety-agent & hardware-agent
Analyze the wiring description for safety risks (voltage, polarity, current) and logic.
Circuit: ${description}`;

    const response = await genAI.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
    });

    return response.text || "No analysis available.";
};

// Analyze an image frame to identify components and wiring - Using vision-agent persona
export const analyzeVisionFrame = async (imageBase64: string, projectContext: string): Promise<string> => {
  if (!genAI) initializeGemini();
  if (!genAI) throw new Error("GenAI not initialized");

  const prompt = `Task: Vision Inspection
Role: vision-agent
Analyze this camera frame for the project: ${projectContext}. 
Identify components, verify wiring against known pinouts, and flag hazards.`;

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

// Generate technical explanations for engineering concepts - Using ux-agent persona
export const generateConceptExplanation = async (concept: string, skillLevel: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `Task: Technical Teaching
Role: ux-agent (Tutor)
Explain "${concept}" for a user at the ${skillLevel} skill level. Use analogies for beginners, technical specs for experts.`;

    const response = await genAI.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
    });

    return response.text || "No explanation available.";
};

// Produce technical reference material for projects - Using doc-agent persona
export const generateProjectReference = async (title: string, components: string[], skillLevel: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `Task: Project Documentation
Role: doc-agent
Create a comprehensive Technical Reference Guide for the project "${title}".
Components: ${components.join(', ')}
Target Audience: ${skillLevel} level engineers.
Include: BOM, Wiring Map, Logic Overview, and Troubleshooting.`;

    const response = await genAI.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
    });

    return response.text || "No guide available.";
};

// Generate a complete custom project structure from an idea - Using planner-agent persona
export const generateCustomProject = async (userIdea: string, skillLevel: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `Task: Project Generation
Role: planner-agent
Design a full project structure based on the user idea: "${userIdea}".
Skill Level: ${skillLevel}.
Return a JSON Project object following the 'Project' interface.`;

     const response = await genAI.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });

    return response.text || "{}";
};

// Recommend components based on a search query - Using procure-agent persona
export const generateComponentRecommendation = async (searchTerm: string, skillLevel: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `Task: Procurement Selection
Role: procure-agent
Recommend 3 Arduino-compatible components for: "${searchTerm}". 
User Level: ${skillLevel}.
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

// Check compatibility between a list of components - Using hardware-agent persona
export const analyzeComponentCompatibility = async (componentNames: string[], context: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `Task: Compatibility Audit
Role: hardware-agent & safety-agent
Check the interoperability of: ${componentNames.join(', ')}.
Context: ${context}.
Identify voltage mismatches, shared pin conflicts, and power draw issues.`;

    const response = await genAI.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
    });

    return response.text || "No analysis available.";
};
