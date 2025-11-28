import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/ping", (req, res) => {
  res.json({
    status: "ok",
    service: "DubSwitch backend is alive 🚀",
  });
});

// Simple test endpoint for future Chrome extension
// It pretends to "process" a dub request and just echoes data back.
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
    // Fake audio URL for now – later this will be a real ElevenLabs file
    fakeAudioUrl: "https://example.com/dubswitch-fake-audio.mp3",
    message: "DubSwitch test endpoint working ✅",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`DubSwitch backend running on port ${PORT}`);
});

