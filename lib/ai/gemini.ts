import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, tools } from './tools';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateContent(history: any[], toolsOverride?: any[]) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-exp',
    tools: toolsOverride || tools,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    }
  });

  const result = await model.generateContent(history);
  return result;
}
