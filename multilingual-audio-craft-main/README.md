# Multilingual Audio Craft

A powerful text-to-speech application that supports multiple languages including English, Hindi, and mixed language support. Built with React, TypeScript, and Coqui TTS.

## Features

- 🗣️ Text-to-Speech conversion in multiple languages
- 🌐 Support for English, Hindi, and mixed language content
- 🎯 High-quality speech synthesis using Coqui TTS
- 🎨 Modern UI with shadcn-ui and Tailwind CSS
- ⚡ Fast and responsive frontend built with Vite
- 🔄 Real-time speech generation

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- Python 3.8 or higher
- Microsoft Visual C++ Build Tools (for Windows users)
- Git

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd multilingual-audio-craft
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install Python dependencies:
```bash
pip install TTS
```

4. Set up server directories:
```bash
mkdir -p server/public/audio
mkdir server/samples
```

5. Install server dependencies:
```bash
cd server
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd server
npm start
```

2. In a new terminal, start the frontend:
```bash
cd multilingual-audio-craft
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## API Endpoints

### Health Check
```
GET /api/health
```
Returns the server status.

### Text-to-Speech
```
POST /api/tts
```
Request body:
```json
{
  "text": "Your text here",
  "language": "en" // or "hi" for Hindi, "mixed" for mixed language
}
```
Response:
```json
{
  "audioUrl": "/audio/filename.wav",
  "phonemes": [...]
}
```

## Project Structure

```
multilingual-audio-craft/
├── src/               # Frontend source code
├── server/           # Backend server code
│   ├── public/      # Public assets
│   │   └── audio/   # Generated audio files
│   └── samples/     # Sample audio files
├── public/          # Frontend public assets
└── package.json     # Project dependencies
```

## Troubleshooting

### Common Issues

1. **PowerShell Execution Policy Error**
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **TTS Installation Issues**
   - Ensure Microsoft Visual C++ Build Tools are installed
   - Try installing TTS with: `pip install TTS --no-cache-dir`

3. **Server Connection Issues**
   - Check if both frontend and backend servers are running
   - Verify ports 3000 and 5173 are not in use

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Coqui TTS](https://github.com/coqui-ai/TTS) for the text-to-speech engine
- [shadcn-ui](https://ui.shadcn.com/) for the UI components
- [Vite](https://vitejs.dev/) for the build tool