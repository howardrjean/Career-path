import { OpenAI } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, voiceCharacter } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Missing text" });
    }

    const voiceMap = {
      "friendly-coach": "alloy",
      "technical-expert": "onyx",
      "executive-recruiter": "nova"
    };

    const voice = voiceMap[voiceCharacter] || "alloy";

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: text
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate speech", details: error.message });
  }
}
