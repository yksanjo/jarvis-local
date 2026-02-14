# Jarvis Local - Privacy-Focused Personal AI Assistant

A privacy-first personal AI assistant that runs entirely on your local machine. Inspired by Jarvis from Iron Man and projects like OpenClaw and Leon.

## Features

- 🗣️ **Voice Commands** - Offline speech-to-text using Whisper
- 🤖 **Local LLM** - Connects to Ollama for AI responses (Llama2, Mistral, etc.)
- 📝 **Task Management** - Natural language task creation and tracking
- 📁 **File Search** - Local file indexing and full-text search
- 📅 **Calendar** - Local calendar with event management
- 🔌 **Skills/Plugins** - Extensible plugin system
- 🔒 **Privacy First** - Zero cloud dependency, all data stored locally

## Tech Stack

- **Frontend**: Electron + React + TypeScript
- **Backend**: FastAPI (Python)
- **Database**: SQLite
- **AI**: Ollama (local LLM)
- **Voice**: Whisper (offline STT)

## Getting Started

### Prerequisites

1. Node.js 18+
2. Python 3.9+
3. [Ollama](https://ollama.ai) (for local LLM)

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the backend:
   ```bash
   cd backend
   python main.py
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open http://localhost:5173 in your browser

### Setting up Ollama

1. Install Ollama from https://ollama.ai
2. Pull a model:
   ```bash
   ollama pull llama2
   ```
3. Start Ollama:
   ```bash
   ollama serve
   ```

## Project Structure

```
jarvis-local/
├── frontend/           # Electron + React app
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/        # Page components
│   │   ├── store/       # Zustand state
│   │   └── styles/      # CSS styles
│   └── electron/        # Electron main process
├── backend/            # FastAPI server
│   └── main.py         # API endpoints
└── skills/            # Plugin system
```

## Privacy

Jarvis Local is designed with privacy in mind:

- All data stored locally in SQLite
- No telemetry or analytics
- Works completely offline
- No external API calls except to local Ollama instance
- Your data never leaves your machine

## License

MIT License - Feel free to use and modify as needed.
