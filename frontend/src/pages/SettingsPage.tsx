import { useState } from 'react'
import { Settings, Mic, Brain, Shield, Database, Download, Upload } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import './SettingsPage.css'

export function SettingsPage() {
  const { settings, updateSettings, llmStatus, llmModel } = useAppStore()
  const [activeSection, setActiveSection] = useState('voice')

  const handleToggle = async (key: keyof typeof settings, value: boolean) => {
    await updateSettings({ [key]: value })
  }

  const sections = [
    { id: 'voice', label: 'Voice', icon: <Mic size={18} /> },
    { id: 'llm', label: 'AI Model', icon: <Brain size={18} /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield size={18} /> },
    { id: 'data', label: 'Data', icon: <Database size={18} /> },
  ]

  return (
    <div className="page settings-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure your Jarvis assistant</p>
        </div>
      </div>

      <div className="settings-layout">
        <nav className="settings-nav">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.icon}
              <span>{section.label}</span>
            </button>
          ))}
        </nav>

        <div className="settings-content">
          {activeSection === 'voice' && (
            <div className="settings-section">
              <h2>Voice Settings</h2>
              <p className="settings-description">
                Configure voice recognition and commands. All processing happens locally.
              </p>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Enable Voice Commands</h4>
                  <p>Allow voice activation of Jarvis</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.voiceEnabled}
                    onChange={(e) => handleToggle('voiceEnabled', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Wake Word</h4>
                  <p>Word to activate Jarvis</p>
                </div>
                <input
                  type="text"
                  className="form-input setting-input"
                  value={settings.wakeWord}
                  onChange={(e) => updateSettings({ wakeWord: e.target.value })}
                  placeholder="hey jarvis"
                />
              </div>
            </div>
          )}

          {activeSection === 'llm' && (
            <div className="settings-section">
              <h2>AI Model Settings</h2>
              <p className="settings-description">
                Configure the local LLM used for AI responses. Requires Ollama.
              </p>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>LLM Status</h4>
                  <p className={`status-badge ${llmStatus}`}>
                    {llmStatus === 'ready' ? 'Connected' : llmStatus === 'loading' ? 'Connecting...' : 'Not Connected'}
                  </p>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Model</h4>
                  <p>Local model to use</p>
                </div>
                <select
                  className="form-input setting-input"
                  value={settings.llmModel}
                  onChange={(e) => updateSettings({ llmModel: e.target.value })}
                >
                  <option value="llama2">Llama 2</option>
                  <option value="mistral">Mistral</option>
                  <option value="codellama">Code Llama</option>
                  <option value="orca-mini">Orca Mini</option>
                </select>
              </div>

              <div className="setting-info">
                <h4>How to use</h4>
                <ol className="settings-steps">
                  <li>Install Ollama from <a href="https://ollama.ai" target="_blank" rel="noopener">ollama.ai</a></li>
                  <li>Run <code>ollama serve</code> in terminal</li>
                  <li>Download models with <code>ollama pull llama2</code></li>
                </ol>
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="settings-section">
              <h2>Privacy Settings</h2>
              <p className="settings-description">
                Jarvis is designed with privacy first. All your data stays on your device.
              </p>

              <div className="privacy-card">
                <Shield size={32} className="privacy-icon" />
                <h3>Zero Cloud Dependency</h3>
                <p>
                  Jarvis Local operates completely offline. No data is ever sent to external servers.
                  Your tasks, files, calendar events, and conversations remain on your device.
                </p>
              </div>

              <div className="privacy-features">
                <div className="privacy-feature">
                  <h4>✓ Local Processing</h4>
                  <p>Voice recognition and AI responses run locally</p>
                </div>
                <div className="privacy-feature">
                  <h4>✓ No Telemetry</h4>
                  <p>No usage data or analytics sent anywhere</p>
                </div>
                <div className="privacy-feature">
                  <h4>✓ Local Storage</h4>
                  <p>All data stored in local SQLite database</p>
                </div>
                <div className="privacy-feature">
                  <h4>✓ Offline First</h4>
                  <p>Works without internet connection</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'data' && (
            <div className="settings-section">
              <h2>Data Management</h2>
              <p className="settings-description">
                Export or import your data. All data is stored locally.
              </p>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Start Minimized</h4>
                  <p>Start Jarvis in system tray</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.startMinimized}
                    onChange={(e) => handleToggle('startMinimized', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Auto Start</h4>
                  <p>Launch Jarvis when system starts</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.autoStart}
                    onChange={(e) => handleToggle('autoStart', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="data-actions">
                <button className="btn-secondary">
                  <Download size={18} />
                  Export Data
                </button>
                <button className="btn-secondary">
                  <Upload size={18} />
                  Import Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
