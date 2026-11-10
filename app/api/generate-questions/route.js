
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing from .env.local" },
        { status: 500 }
      );
    }

    const { jobPosition, jobDesc, jobExperience } = await request.json();

    if (!jobPosition || !jobDesc || jobExperience === undefined) {
      return NextResponse.json(
        { error: "Please provide all interview details." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
     model: "gemini-3.5-flash",
    });

    const questionCount =
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || "5";

    const prompt = `
      Job position: ${jobPosition}
      Job description and tech stack: ${jobDesc}
      Years of experience: ${jobExperience}

      Generate ${questionCount} interview questions with answers.
      Return only valid JSON in this format:
      [
        {
          "question": "Interview question",
          "answer": "Detailed answer"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanedResponse = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const questions = JSON.parse(cleanedResponse);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Gemini API error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to generate interview questions." },
      { status: 500 }
    );
  }
}
