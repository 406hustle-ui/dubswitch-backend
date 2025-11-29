import express from "express";
import cors from "cors";
import "dotenv/config";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Allowed OpenAI TTS voices
const ALLOWED_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "DubSwitch backend is alive 🚀",
    endpoints: ["/tts"],
  });
});

app.post("/tts", async (req, res) => {
  try {
    const { text, voice } = req.body || {};
    if (!text || typeof text !== "string") {
      return res.status(400).json({ ok: false, error: "Missing 'text' field" });
    }

    let selectedVoice = typeof voice === "string" ? voice.toLowerCase() : "alloy";
    if (!ALLOWED_VOICES.includes(selectedVoice)) {
      selectedVoice = "alloy";
    }

    console.log(`DubSwitch TTS: voice=${selectedVoice}, text="${text.slice(0, 40)}..."`);

    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts", // or "tts-1" depending on what you're using
      voice: selectedVoice,
      format: "mp3",
      input: text,
    });

    const audioBuffer = Buffer.from(await response.arrayBuffer());
    const audioBase64 = audioBuffer.toString("base64");

    res.json({
      ok: true,
      voice: selectedVoice,
      audioBase64,
    });
  } catch (err) {
    console.error("DubSwitch TTS error:", err.response?.data || err.message);
    const details =
      err.response?.data?.error?.message || err.message || "Unknown error";

    res.status(500).json({
      ok: false,
      error: "Failed to generate TTS audio",
      details,
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`DubSwitch backend listening on port ${PORT}`);
});




