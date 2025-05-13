
# Coqui TTS Express Backend

This is an Express.js server that integrates with Coqui TTS to provide text-to-speech functionality.

## Setup Instructions

1. Install dependencies:
```
cd server
npm install
```

2. Install Coqui TTS (Python environment):

You need to have Python and pip installed, then:
```
pip install TTS
```

For more details on installing Coqui TTS, visit: https://github.com/coqui-ai/TTS#installation

3. Create sample directories:
```
mkdir -p samples
```

4. Add sample audio files (optional):
Place some sample WAV files in the samples directory for testing:
- samples/english.wav
- samples/hindi.wav
- samples/mixed.wav

5. Start the server:
```
npm start
```

The server will run on http://localhost:3000 by default.

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/tts` - Text-to-speech endpoint
  - Request body: `{ "text": "Your text here", "language": "english" }`
  - Response: `{ "audioUrl": "http://localhost:3000/audio/filename.wav", "phonemes": [...] }`

## Integration with Coqui TTS

The current implementation is a placeholder that copies sample audio files. For a complete integration:

1. Install Coqui TTS
2. Modify the `runCoquiTTS` function to spawn a Python process that uses Coqui TTS to generate audio
3. Use Coqui TTS's phoneme output for accurate phoneme data

## Full Coqui TTS Integration

Replace the `runCoquiTTS` function with an actual implementation that runs Coqui TTS. For example:

```javascript
function runCoquiTTS(text, language, outputPath) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [
      '-m', 'TTS.server.server',
      '--text', text,
      '--language', language === 'hindi' ? 'hi' : 'en',
      '--output_path', outputPath
    ]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Coqui TTS output: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Coqui TTS error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, path: outputPath });
      } else {
        reject(new Error(`Coqui TTS process exited with code ${code}`));
      }
    });
  });
}
```

This implementation may need adjustments based on your specific Coqui TTS installation and requirements.
