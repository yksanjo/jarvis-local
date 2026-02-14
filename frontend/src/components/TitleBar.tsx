import { useState, useEffect } from 'react'
import { Minus, Square, X, Copy } from 'lucide-react'
import './TitleBar.css'

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    const checkMaximized = async () => {
      if (window.electronAPI) {
        const maximized = await window.electronAPI.isMaximized()
        setIsMaximized(maximized)
      }
    }
    checkMaximized()
  }, [])

  const handleMinimize = () => {
    window.electronAPI?.minimize()
  }

  const handleMaximize = async () => {
    if (window.electronAPI) {
      const maximized = await window.electronAPI.maximize()
      setIsMaximized(maximized)
    }
  }

  const handleClose = () => {
    window.electronAPI?.close()
  }

  return (
    <div className="titlebar drag-region">
      <div className="titlebar-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#58A6FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="#58A6FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="#58A6FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="titlebar-title">Jarvis Local</div>
      <div className="titlebar-controls no-drag">
        <button className="titlebar-btn" onClick={handleMinimize} aria-label="Minimize">
          <Minus size={14} />
        </button>
        <button className="titlebar-btn" onClick={handleMaximize} aria-label="Maximize">
          {isMaximized ? <Copy size={12} /> : <Square size={12} />}
        </button>
        <button className="titlebar-btn titlebar-btn-close" onClick={handleClose} aria-label="Close">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
