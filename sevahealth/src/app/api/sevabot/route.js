// src/app/api/sevabot/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // 1. Get the prompt from the frontend
    const { prompt } = await req.json();
    
    // 2. Your API Key (It's safe here on the server)
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyBuqtNWFnmrijV01Uck6v5-lYtz-9MRPmo";

    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    // 3. Call Google Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2, // Low creativity for medical accuracy
            responseMimeType: "application/json" // Force JSON response
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Gemini API Error: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    
    // 4. Send just the answer back to your frontend
    return NextResponse.json(data);

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}