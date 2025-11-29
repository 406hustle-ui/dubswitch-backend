import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "DubSwitch backend is alive 🚀",
  });
});

// Test endpoint we used earlier (optional, but we’ll keep it)
app.post("/dub-test", (req, res) => {
  const { text, voice } = req.body || {};

  if (!text) {
    return res.status(400).json({
      ok: false,
      error: "Missing required field: text",
    });
  }

  return res.json({
    ok: true,
    receivedText: text,
    requestedVoice: voice || "default",
    fakeAudioUrl: "https://example.com/dubswitch-fake-audio.mp3",
    message: "DubSwitch test endpoint working ✅",
  });
});

// *** REAL TTS ENDPOINT ***
// POST /tts  { "text": "hello world", "voice": "alloy" }
app.post("/tts", async (req, res) => {
  const { text, voice } = req.body || {};

  if (!text || typeof text !== "string") {
    return res.status(400).json({
      ok: false,
      error: "Missing or invalid 'text' field",
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      ok: false,
      error: "OPENAI_API_KEY is not set on the server",
    });
  }

  try {
    const selectedVoice = voice || "alloy";

    const mp3 = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: selectedVoice,
      input: text,
      format: "mp3",
    });

    const audioBuffer = Buffer.from(await mp3.arrayBuffer());
    const audioBase64 = audioBuffer.toString("base64");

    return res.json({
      ok: true,
      voice: selectedVoice,
      audioBase64,
      contentType: "audio/mpeg",
      message: "Generated TTS audio successfully",
    });
  } catch (err) {
    console.error("TTS error:", err);
    return res.status(500).json({
      ok: false,
      error: "Failed to generate TTS audio",
      details: err?.message,
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`DubSwitch backend running on port ${PORT}`);
});



