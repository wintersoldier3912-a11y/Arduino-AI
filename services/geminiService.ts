
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
};

export const analyzeCode = async (code: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `Analyze the following Arduino C++ code.
    Return a JSON object with two keys:
    1. "summary": A brief string summarizing the quality.
    2. "issues": An array of objects, where each object has:
       - "line": number (1-based line number of the issue)
       - "severity": string ("error", "warning", or "info")
       - "message": string (concise explanation)
       - "suggestion": string (how to fix it)
    
    If the code is perfect, return an empty "issues" array.
    
    Code:
    \`\`\`cpp
    ${code}
    \`\`\`
    `;

    const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json'
        }
    });

    return response.text || "{}";
};

export const analyzeCircuit = async (description: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `Analyze the following Arduino circuit description for connection errors, power issues, safety concerns, and potential improvements.
    
    Circuit Description:
    ${description}
    
    Provide a structured report with:
    1. Connection Logic Check
    2. Power & Safety Analysis
    3. Suggestions for improvement or necessary components (like resistors/capacitors).
    `;

    const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text || "No analysis available.";
};

export const analyzeComponentCompatibility = async (components: string[], projectContext: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `
    Task: Analyze the compatibility of the following components for an Arduino project.
    Selected Components: ${components.join(', ')}
    Project Requirement/Context: "${projectContext || "General compatibility check"}"

    Please provide a structured analysis covering:
    1. **Voltage & Logic Levels**: Are there 3.3V/5V mismatches? Need level shifters?
    2. **Pin Usage & Interfaces**: Potential conflicts (I2C addresses, SPI CS pins, UART usage, limited pins).
    3. **Power Budget**: Rough estimate of current consumption vs Arduino limits.
    4. **Missing Essentials**: Are resistors, capacitors, drivers, or external power sources likely needed?
    5. **Recommendations**: Suggestions to improve the build or fix issues.
    
    Format the output in Markdown.
    `;

    const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text || "No analysis available.";
};

export const analyzeVisionFrame = async (imageBase64: string, projectContext: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `
    You are Arduino Vision Mentor — a live vision assistant.
    Project Context: ${projectContext}

    Analyze the provided image frame of an Arduino/electronics setup.
    Rules:
    - If any detection indicates a connection between power rails of differing voltage or a direct short, immediately return a SAFETY WARNING: "Disconnect power and measure...".
    - Prefer small, testable guidance.
    - Verify if the visible components match the project context.
    - Provide a structured response: "Status", "Safety Check", "Wiring Verification", "Next Step".
    
    Return the response in Markdown.
    `;

    const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64
              }
            },
            { text: prompt }
          ]
        },
    });

    return response.text || "Unable to analyze frame.";
};

export const generateConceptExplanation = async (concept: string, skillLevel: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `
    Create a technical "Cheat Sheet" for the concept: "${concept}" specifically for an engineer with ${skillLevel} Arduino skills.
    
    Include:
    1. **Technical Definition**: Concise engineering definition.
    2. **How it Works**: Brief theory (e.g., timing diagrams for protocols, physics for sensors).
    3. **Wiring/Pinout**: General connection guide (e.g., SDA/SCL for I2C).
    4. **Code Snippet**: A minimal, copy-pasteable Arduino C++ example using best practices (non-blocking if possible).
    5. **Common Pitfalls**: What usually goes wrong (e.g., floating pins, missing pull-ups).
    
    Format as clean Markdown.
    `;

    const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text || "No explanation available.";
};

export const generateProjectReference = async (title: string, components: string[], skillLevel: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `
    Create a comprehensive "Technical Reference Guide" for the Arduino project: "${title}".
    Target Audience: ${skillLevel} Engineer.
    Components involved: ${components.join(', ')}.

    The output must be a structured technical document including:
    1. **System Architecture**: High-level block diagram description (textual).
    2. **Hardware Theory**: Detailed operation of specific components (e.g. how the specific sensor communicates, voltage dividers if needed).
    3. **Signal Integration**: Protocol details (I2C/SPI/UART), voltage logic levels, and power considerations.
    4. **Firmware Strategy**: Logic flow description, memory management considerations, and library dependencies.
    5. **Troubleshooting Matrix**: Common failure points, multimeter test points, and expected values.
    
    Format as clean Markdown.
    `;

    const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text || "No guide available.";
};

export const generateCustomProject = async (userIdea: string, skillLevel: string): Promise<string> => {
    if (!genAI) initializeGemini();
    if (!genAI) throw new Error("GenAI not initialized");

    const prompt = `Create a detailed Arduino project based on this idea: "${userIdea}". Skill Level: ${skillLevel}.
    Return a JSON object with:
    - "id": string (use "custom-${Date.now()}")
    - "title": string
    - "description": string
    - "difficulty": string (Beginner, Intermediate, Advanced, Expert)
    - "timeEstimate": string
    - "components": array of strings
    - "tags": array of strings
    - "completed": false (boolean)
    Do not use markdown. Raw JSON only.`;

     const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });

    return response.text || "{}";
}
