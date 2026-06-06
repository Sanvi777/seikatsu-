import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a friendly Japan settlement assistant built into Seikatsu. Help foreigners settle in Japan. Answer questions about ward offices, health insurance, visas, bank accounts, SIM cards, IC cards, hanko, LINE app, daily life. Keep answers short, practical and friendly. Use bullet points for steps.'
        },
        ...messages
      ],
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  console.log('Groq response:', JSON.stringify(data));
  const text = data.choices?.[0]?.message?.content || "Sorry, couldn't get a response!";
  return NextResponse.json({ content: [{ text }] });
}