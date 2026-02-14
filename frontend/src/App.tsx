import { useEffect, useState } from 'react'
import { TitleBar } from './components/TitleBar'
import { Sidebar } from './components/Sidebar'
import { StatusBar } from './components/StatusBar'
import { HomePage } from './pages/HomePage'
import { TasksPage } from './pages/TasksPage'
import { FilesPage } from './pages/FilesPage'
import { CalendarPage } from './pages/CalendarPage'
import { SkillsPage } from './pages/SkillsPage'
import { SettingsPage } from './pages/SettingsPage'
import { useAppStore } from './store/appStore'
import './styles/App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const { initializeStore, voiceStatus, llmStatus } = useAppStore()

  useEffect(() => {
    initializeStore()
    
    // Listen for voice activation from tray
    const unsubscribe = window.electronAPI?.onActivateVoice(() => {
      // Trigger voice activation
      console.log('Voice activated from tray')
    })

    return () => {
      unsubscribe?.()
    }
  }, [initializeStore])

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'tasks':
        return <TasksPage />
      case 'files':
        return <FilesPage />
      case 'calendar':
        return <CalendarPage />
      case 'skills':
        return <SkillsPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="app">
      <TitleBar />
      <div className="app-body">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
      <StatusBar voiceStatus={voiceStatus} llmStatus={llmStatus} />
    </div>
  )
}

export default App
