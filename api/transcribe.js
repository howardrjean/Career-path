import { OpenAI } from "openai";
import { createReadStream } from "fs";
import { tmpdir } from "os";
import { writeFileSync } from "fs";
import { join } from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { audio, demoText } = req.body;

    // Demo mode - return text directly
    if (demoText) {
      return res.status(200).json({ text: demoText });
    }

    if (!audio) {
      return res.status(400).json({ error: "Missing audio data" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audio, "base64");
    
    // Write to temp file
    const tempFile = join(tmpdir(), "audio.webm");
    writeFileSync(tempFile, audioBuffer);

    // Transcribe
    const transcript = await openai.audio.transcriptions.create({
      file: createReadStream(tempFile),
      model: "whisper-1"
    });

    res.status(200).json({ text: transcript.text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to transcribe", details: error.message });
  }
}
