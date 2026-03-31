import { NextResponse } from "next/server";
import { generateImage } from "@/lib/imageGenerator";

export async function POST(req: Request) {
  try {
    console.log("🚀 API TRIGGERED: /api/generate");

    const hfKey = process.env.HUGGINGFACE_API_KEY;
    if (!hfKey) {
      return NextResponse.json(
        { success: false, error: "Missing HuggingFace API Key" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { prompt, tool } = body;

    console.log("🎯 PROMPT:", prompt);
    console.log("🛠️ TOOL:", tool);

    if (tool === "video-generator") {
      // Simulate video generation for the UI update
      // In a real scenario, this would call a video model and return a real hosted URL
      return NextResponse.json({
        success: true,
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-11603-large.mp4",
      });
    }

    const base64Image = await generateImage(prompt || "A high quality realistic image");

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${base64Image}`,
    });

  } catch (error: any) {
    console.error("🔥 ERROR:", error.response?.data || error.message);

    return NextResponse.json(
      {
        success: false,
        error: error.response?.data?.error || error.message,
      },
      { status: 500 }
    );
  }
}