import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    const userMessage = messages[messages.length - 1].content;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: `You are a friendly e-commerce shopping assistant. Speak in English only. Handle casual chat (hi/hello) friendly. For product questions suggest: "beauty products under 500", "cheapest product", "compare products". Keep answers short and helpful.`
    });

    const result = await model.generateContent(userMessage);
    const response = result.response.text();

    return NextResponse.json({ text: response });

  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json({ text: 'Sorry, technical issue. Please refresh and try again.' }, { status: 500 });
  }
}
