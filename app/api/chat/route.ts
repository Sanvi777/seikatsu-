// app/api/chat/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Groq error:", res.status, err);
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content ?? "" });
  } catch (e) {
    console.error("Chat route failed:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}