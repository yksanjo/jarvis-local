import { useState } from 'react'
import { Send, Bot, User, Calendar, CheckSquare, FolderSearch, Mic } from 'lucide-react'
import { useAppStore, Message } from '../store/appStore'
import './HomePage.css'

export function HomePage() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, llmStatus, tasks, events, voiceStatus, startVoice } = useAppStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    const userInput = input
    setInput('')
    await sendMessage(userInput)
  }

  const pendingTasks = tasks.filter(t => t.status !== 'completed').length
  const upcomingEvents = events.filter(e => new Date(e.startTime) > new Date()).length

  const handleVoiceClick = () => {
    startVoice()
  }

  return (
    <div className="page home-page">
      <div className="home-header">
        <h1 className="page-title">Welcome to Jarvis</h1>
        <p className="page-subtitle">Your privacy-first personal AI assistant</p>
      </div>

      <div className="home-grid">
        <div className="home-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <CheckSquare size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{pendingTasks}</div>
              <div className="stat-label">Pending Tasks</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{upcomingEvents}</div>
              <div className="stat-label">Upcoming Events</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FolderSearch size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">0</div>
              <div className="stat-label">Indexed Files</div>
            </div>
          </div>
        </div>

        <div className="home-chat card">
          <div className="chat-header">
            <Bot size={20} className="chat-icon" />
            <span>AI Assistant</span>
            <span className={`chat-status ${llmStatus}`}>
              {llmStatus === 'ready' ? 'Online' : llmStatus === 'loading' ? 'Loading...' : 'Offline'}
            </span>
          </div>
          
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-empty">
                <Bot size={48} className="chat-empty-icon" />
                <p>Hello! I'm Jarvis, your local AI assistant.</p>
                <p className="text-secondary">All processing happens on your device. Your data never leaves your computer.</p>
              </div>
            ) : (
              messages.map((msg: Message) => (
                <div key={msg.id} className={`chat-message ${msg.role}`}>
                  <div className="message-icon">
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className="message-content">
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </div>

          <form className="chat-input-form" onSubmit={handleSubmit}>
            <button 
              type="button" 
              className={`voice-btn ${voiceStatus}`}
              onClick={handleVoiceClick}
            >
              <Mic size={18} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="chat-input"
            />
            <button type="submit" className="send-btn" disabled={!input.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
