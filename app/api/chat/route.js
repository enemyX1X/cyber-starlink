import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // --- Safety check ---
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("❌ OPENROUTER_API_KEY missing");
      return NextResponse.json(
        { error: "Missing API key" },
        { status: 500 }
      );
    }

    // --- Call OpenRouter ---
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages,
      }),
    });

    // --- Handle OpenRouter response ---
    const data = await res.json();

    if (!res.ok) {
      console.error("❌ OpenRouter error:", data);
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("💥 /api/chat server error:", err);
    return NextResponse.json(
      { error: "Server failed to reach DeepSeek" },
      { status: 500 }
    );
  }
}
