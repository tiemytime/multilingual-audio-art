const express = require("express");
const cors = require("cors");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Create directories for storing audio files
const audioDir = path.join(__dirname, "public", "audio");
if (!fs.existsSync(path.join(__dirname, "public"))) {
  fs.mkdirSync(path.join(__dirname, "public"));
}
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir);
}

// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));

// Parse JSON requests
app.use(express.json());

// Serve static files with CORS headers
app.use("/audio", (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
}, express.static(path.join(__dirname, "public", "audio")));

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Multilingual Audio Craft API",
    endpoints: {
      health: "/api/health",
      tts: "/api/tts (POST)",
      audio: "/audio (GET)"
    }
  });
});

// Simple health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Coqui TTS server is running",
    timestamp: new Date().toISOString()
  });
});

// TTS API endpoint
app.post("/api/tts", async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    console.log(`Processing text in ${language}: ${text}`);

    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `tts_${timestamp}.wav`;
    const outputPath = path.join(audioDir, filename);

    // Run Coqui TTS via Python script
    try {
      await runCoquiTTS(text, language, outputPath);

      const phonemes = generatePhonemes(text, language);

      res.json({
        audioUrl: `/audio/${filename}`,
        phonemes: phonemes,
        message: "Speech generated successfully"
      });
    } catch (error) {
      console.error("TTS Error:", error);
      if (error.message.includes("model")) {
        res.status(503).json({ 
          error: "TTS model is still downloading. Please try again in a few minutes.",
          details: error.message
        });
      } else {
        res.status(500).json({ error: "Failed to generate speech" });
      }
    }
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to run Coqui TTS via Python script
function runCoquiTTS(text, language, outputPath) {
  return new Promise((resolve, reject) => {
    const langCode = language === "hindi" ? "hi" : language === "mixed" ? "mixed" : "en";

    console.log(`Running Coqui TTS for "${text}" in ${language} (${langCode})`);

    const pythonProcess = spawn("python", [
      path.join(__dirname, "run_tts.py"),
      "--text",
      text,
      "--language",
      langCode,
      "--output",
      outputPath,
    ]);

    let pythonOutput = "";
    let pythonError = "";

    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data.toString();
      console.log(`Python output: ${data}`);
    });

    pythonProcess.stderr.on("data", (data) => {
      pythonError += data.toString();
      console.error(`Python error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        console.log("TTS generation successful");
        resolve(outputPath);
      } else {
        console.error(`TTS process exited with code ${code}`);
        console.error(`Error output: ${pythonError}`);
        reject(new Error(`TTS failed with code ${code}: ${pythonError}`));
      }
    });
  });
}

// Simulated phoneme generator
function generatePhonemes(text, language) {
  const words = text.split(/\s+/).slice(0, 15);
  return words
    .filter((word) => word.length > 1 && !/^[,.!?;:()[\]{}]$/.test(word))
    .map((word) => {
      const cleanWord = word.replace(/[,.!?;:()[\]{}]/g, "");
      const isHindi = /[\u0900-\u097F]/.test(cleanWord);
      return language === "hindi" || (language === "mixed" && isHindi)
        ? `${cleanWord}-hi`
        : `${cleanWord}-en`;
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🎵 Audio files served at http://localhost:${PORT}/audio`);
  console.log(`📣 TTS endpoint: http://localhost:${PORT}/api/tts`);
  console.log(`\nAvailable endpoints:`);
  console.log(`- GET  /              - API information`);
  console.log(`- GET  /api/health    - Health check`);
  console.log(`- POST /api/tts       - Text to speech`);
  console.log(`- GET  /audio/*       - Audio files`);
});
