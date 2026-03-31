import { NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(req: Request) {
  try {
    console.log("🎬 REPLICATE VIDEO API TRIGGERED: /api/video-generate");

    const replicateToken = process.env.REPLICATE_API_TOKEN;
    if (!replicateToken) {
      return NextResponse.json(
        { success: false, error: "Missing Replicate API Token (REPLICATE_API_TOKEN)" },
        { status: 500 }
      );
    }

    const replicate = new Replicate({
      auth: replicateToken,
    });

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: "Missing prompt" }, { status: 400 });
    }

    console.log("🎯 PROMPT:", prompt);

    // 1. Run the Replicate model (anotherjesse/zeroscope-v2-xl)
    // Model version hash for zeroscope-v2-xl: 71996d331e8ede8ef7bd76eba9fae076d31792e4ddf4ad057779b443d6aea62f
    const output = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:71996d331e8ede8ef7bd76eba9fae076d31792e4ddf4ad057779b443d6aea62f",
      {
        input: {
          prompt: prompt,
          num_frames: 24,
          fps: 8,
          width: 576,
          height: 320,
          guidance_scale: 12.5,
          num_inference_steps: 50
        }
      }
    );

    console.log("🗳️ OUTPUT:", output);

    // Replicate returns an array of URLs or a single URL depending on the model
    const videoUrl = Array.isArray(output) ? output[0] : output;

    if (!videoUrl) {
      throw new Error("No video URL produced by Replicate.");
    }

    return NextResponse.json({
      success: true,
      videoUrl: videoUrl,
    });

  } catch (error: any) {
    console.error("🔥 REPLICATE ERROR:", error.message);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Video generation failed.",
      },
      { status: 500 }
    );
  }
}
