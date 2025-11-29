import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Load OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "DubSwitch backend is alive 🚀",
  });
});

// POST /api/voice  → returns AI-generated voice audio
app.post("/api/voice", async (req, res) => {
  try {
    const { text, voice } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Missing 'text' field." });
    }

    // Default voice if none sent
    const selectedVoice = voice || "alloy";

    // Call OpenAI TTS endpoint
    const speech = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: selectedVoice,
      input: text,
      format: "mp3",
    });

    // Convert to base64 so frontend can play it
    const audioBuffer = Buffer.from(await speech.arrayBuffer());
    const base64Audio = audioBuffer.toString("base64");

    res.json({
      ok: true,
      voice: selectedVoice,
      audio: base64Audio,
    });

  } catch (err) {
    console.error("TTS Error:", err);
    res.status(500).json({
      ok: false,
      error: err.message || "Unknown server error",
    });
  }
});

// Render uses PORT, fallback to local 10000
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`DubSwitch backend running on ${PORT}`));


