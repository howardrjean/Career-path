import { OpenAI } from "openai";

const characterPersonalities = {
  "friendly-coach": {
    name: "Alex (Friendly Coach)",
    systemPrompt: "You are a warm, encouraging career coach conducting a mock interview."
  },
  "technical-expert": {
    name: "Jordan (Technical Expert)",
    systemPrompt: "You are a technical interviewer assessing coding and system design skills."
  },
  "executive-recruiter": {
    name: "Morgan (Executive Recruiter)",
    systemPrompt: "You are an executive recruiter evaluating leadership and strategic thinking."
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userMessage, voiceCharacter, question } = req.body;

    if (!userMessage || !voiceCharacter) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const character = characterPersonalities[voiceCharacter] || characterPersonalities["friendly-coach"];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `${character.systemPrompt} You are conducting a mock interview. Provide constructive feedback on the candidate's answer in 2-3 sentences.`
        },
        {
          role: "user",
          content: `Interview Question: "${question}"\n\nCandidate's Answer: "${userMessage}"\n\nProvide feedback on this answer.`
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const response = completion.choices[0].message.content;

    res.status(200).json({ response });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate response", details: error.message });
  }
}
