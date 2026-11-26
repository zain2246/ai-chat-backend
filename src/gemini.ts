import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

export async function generateGeminiResponse(message: string): Promise<string> {

    const interaction = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: message
    })

    return interaction.text ?? '';
}

export async function* streamGeminiResponse(message: string): AsyncGenerator<string> {
    const responseStream = await ai.models.generateContentStream({
        model:'gemini-3.1-flash-lite',
        contents: message
    });
    
    for await (const chunk of responseStream) {
        if(chunk.text) {
            yield chunk.text;
        }
    }
}