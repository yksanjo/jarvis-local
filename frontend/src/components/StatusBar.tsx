import { Mic, MicOff, Brain, BrainOff, Wifi, WifiOff } from 'lucide-react'
import { VoiceStatus, LLMStatus } from '../store/appStore'
import './StatusBar.css'

interface StatusBarProps {
  voiceStatus: VoiceStatus
  llmStatus: LLMStatus
}

export function StatusBar({ voiceStatus, llmStatus }: StatusBarProps) {
  const getVoiceIcon = () => {
    switch (voiceStatus) {
      case 'listening':
        return <Mic className="status-icon listening" size={14} />
      case 'processing':
        return <Mic className="status-icon processing" size={14} />
      case 'error':
        return <MicOff className="status-icon error" size={14} />
      default:
        return <Mic className="status-icon idle" size={14} />
    }
  }

  const getVoiceLabel = () => {
    switch (voiceStatus) {
      case 'listening':
        return 'Listening...'
      case 'processing':
        return 'Processing...'
      case 'error':
        return 'Voice Error'
      default:
        return 'Voice Ready'
    }
  }

  const getLLMIcon = () => {
    switch (llmStatus) {
      case 'loading':
        return <Brain className="status-icon loading" size={14} />
      case 'ready':
        return <Brain className="status-icon ready" size={14} />
      case 'error':
        return <BrainOff className="status-icon error" size={14} />
      default:
        return <BrainOff className="status-icon offline" size={14} />
    }
  }

  const getLLMLabel = () => {
    switch (llmStatus) {
      case 'loading':
        return 'Loading...'
      case 'ready':
        return 'LLM Ready'
      case 'error':
        return 'LLM Error'
      default:
        return 'LLM Offline'
    }
  }

  return (
    <div className="statusbar">
      <div className="statusbar-left">
        <div className="statusbar-item">
          {getVoiceIcon()}
          <span className={`statusbar-label ${voiceStatus}`}>{getVoiceLabel()}</span>
        </div>
        <div className="statusbar-divider" />
        <div className="statusbar-item">
          {getLLMIcon()}
          <span className={`statusbar-label ${llmStatus}`}>{getLLMLabel()}</span>
        </div>
      </div>
      <div className="statusbar-right">
        <div className="statusbar-item">
          <Wifi size={14} className="status-icon ready" />
          <span className="statusbar-label">Local Mode</span>
        </div>
      </div>
    </div>
  )
}
