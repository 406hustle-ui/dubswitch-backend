import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

// Simple test route
app.get("/ping", (req, res) => {
  res.json({ status: "ok", service: "DubSwitch backend is alive 🚀" });
});

// Railway or Render will pass PORT automatically
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`DubSwitch backend listening on port ${PORT}`);
});
