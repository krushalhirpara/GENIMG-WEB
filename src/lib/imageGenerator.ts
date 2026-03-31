import axios from "axios";

export async function generateImage(prompt) {
  try {
    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        inputs: prompt,
        options: {
          wait_for_model: true
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "image/png"
        },
        responseType: "arraybuffer",
      }
    );

    // Convert image buffer to base64
    const base64Image = Buffer.from(response.data, "binary").toString("base64");

    return base64Image;

  } catch (error) {
    console.error("❌ HuggingFace FULL ERROR:", error.response?.data || error.message);

    // Debug text error (important)
    if (error.response?.data) {
      try {
        const text = Buffer.from(error.response.data).toString();
        console.log("HF ERROR TEXT:", text);
      } catch (e) { }
    }

    throw new Error("HuggingFace image generation failed");
  }
}