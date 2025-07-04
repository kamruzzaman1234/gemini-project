


import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Check if API key exists
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing Gemini API key");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const { body } = await req.json(); // Fixed here

    const result = await model.generateContent(body);
    
    // Make sure response is available
    const output = result?.response?.text?.();

    return NextResponse.json({ output });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate content from Gemini API" },
      { status: 500 }
    );
  }
}

  