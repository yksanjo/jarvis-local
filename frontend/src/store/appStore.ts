import { create } from 'zustand'

export interface Task {
  id: number
  title: string
  description: string
  dueDate: string | null
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed'
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface CalendarEvent {
  id: number
  title: string
  description: string
  startTime: string
  endTime: string
  recurrence: string | null
  location: string | null
  createdAt: string
  updatedAt: string
}

export interface FileItem {
  id: number
  path: string
  name: string
  contentHash: string | null
  tags: string[]
  indexedAt: string
}

export interface Skill {
  id: number
  name: string
  description: string
  enabled: boolean
  config: Record<string, any>
}

export interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export type VoiceStatus = 'idle' | 'listening' | 'processing' | 'error'
export type LLMStatus = 'offline' | 'loading' | 'ready' | 'error'
export type PageType = 'home' | 'tasks' | 'files' | 'calendar' | 'skills' | 'settings'

interface AppState {
  // Navigation
  currentPage: PageType
  
  // Tasks
  tasks: Task[]
  selectedTask: Task | null
  
  // Calendar
  events: CalendarEvent[]
  selectedEvent: CalendarEvent | null
  
  // Files
  files: FileItem[]
  indexedFolders: string[]
  
  // Skills
  skills: Skill[]
  
  // Chat
  messages: Message[]
  
  // Status
  voiceStatus: VoiceStatus
  llmStatus: LLMStatus
  llmModel: string
  
  // Settings
  settings: {
    voiceEnabled: boolean
    wakeWord: string
    llmModel: string
    theme: 'dark' | 'light'
    startMinimized: boolean
    autoStart: boolean
  }
  
  // Actions
  setCurrentPage: (page: PageType) => void
  
  // Task actions
  loadTasks: () => Promise<void>
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: number) => Promise<void>
  
  // Calendar actions
  loadEvents: () => Promise<void>
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateEvent: (id: number, updates: Partial<CalendarEvent>) => Promise<void>
  deleteEvent: (id: number) => Promise<void>
  
  // File actions
  indexFolder: (path: string) => Promise<void>
  searchFiles: (query: string) => Promise<FileItem[]>
  
  // Skill actions
  loadSkills: () => Promise<void>
  toggleSkill: (id: number) => Promise<void>
  
  // LLM actions
  sendMessage: (content: string) => Promise<string>
  checkLLMStatus: () => Promise<void>
  
  // Voice actions
  startVoice: () => Promise<void>
  stopVoice: () => Promise<void>
  
  // Settings actions
  updateSettings: (settings: Partial<AppState['settings']>) => Promise<void>
  
  // Initialization
  initializeStore: () => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  currentPage: 'home',
  
  tasks: [],
  selectedTask: null,
  
  events: [],
  selectedEvent: null,
  
  files: [],
  indexedFolders: [],
  
  skills: [],
  
  messages: [],
  
  voiceStatus: 'idle',
  llmStatus: 'offline',
  llmModel: '',
  
  settings: {
    voiceEnabled: false,
    wakeWord: 'hey jarvis',
    llmModel: 'llama2',
    theme: 'dark',
    startMinimized: false,
    autoStart: false,
  },
  
  // Navigation
  setCurrentPage: (page) => set({ currentPage: page }),
  
  // Task actions
  loadTasks: async () => {
    try {
      // In a real implementation, this would query the database
      // For now, we'll use local state
      const stored = localStorage.getItem('jarvis-tasks')
      if (stored) {
        set({ tasks: JSON.parse(stored) })
      }
    } catch (error) {
      console.error('Failed to load tasks:', error)
    }
  },
  
  addTask: async (task) => {
    const newTask: Task = {
      ...task,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const tasks = [...get().tasks, newTask]
    set({ tasks })
    localStorage.setItem('jarvis-tasks', JSON.stringify(tasks))
  },
  
  updateTask: async (id, updates) => {
    const tasks = get().tasks.map(t => 
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    )
    set({ tasks })
    localStorage.setItem('jarvis-tasks', JSON.stringify(tasks))
  },
  
  deleteTask: async (id) => {
    const tasks = get().tasks.filter(t => t.id !== id)
    set({ tasks })
    localStorage.setItem('jarvis-tasks', JSON.stringify(tasks))
  },
  
  // Calendar actions
  loadEvents: async () => {
    try {
      const stored = localStorage.getItem('jarvis-events')
      if (stored) {
        set({ events: JSON.parse(stored) })
      }
    } catch (error) {
      console.error('Failed to load events:', error)
    }
  },
  
  addEvent: async (event) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const events = [...get().events, newEvent]
    set({ events })
    localStorage.setItem('jarvis-events', JSON.stringify(events))
  },
  
  updateEvent: async (id, updates) => {
    const events = get().events.map(e => 
      e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
    )
    set({ events })
    localStorage.setItem('jarvis-events', JSON.stringify(events))
  },
  
  deleteEvent: async (id) => {
    const events = get().events.filter(e => e.id !== id)
    set({ events })
    localStorage.setItem('jarvis-events', JSON.stringify(events))
  },
  
  // File actions
  indexFolder: async (path) => {
    const indexedFolders = [...get().indexedFolders, path]
    set({ indexedFolders })
    // In a real implementation, this would trigger file indexing
  },
  
  searchFiles: async (query) => {
    // In a real implementation, this would search the indexed files
    return get().files.filter(f => 
      f.name.toLowerCase().includes(query.toLowerCase())
    )
  },
  
  // Skill actions
  loadSkills: async () => {
    const defaultSkills: Skill[] = [
      {
        id: 1,
        name: 'Calculator',
        description: 'Perform mathematical calculations',
        enabled: true,
        config: {}
      },
      {
        id: 2,
        name: 'Timer',
        description: 'Set timers and alarms',
        enabled: true,
        config: {}
      },
      {
        id: 3,
        name: 'Notes',
        description: 'Take and manage notes',
        enabled: true,
        config: {}
      },
      {
        id: 4,
        name: 'Weather',
        description: 'Get weather information (cached)',
        enabled: false,
        config: { location: '' }
      },
    ]
    set({ skills: defaultSkills })
  },
  
  toggleSkill: async (id) => {
    const skills = get().skills.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    )
    set({ skills })
  },
  
  // LLM actions
  sendMessage: async (content) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }
    const messages = [...get().messages, userMessage]
    set({ messages, llmStatus: 'loading' })
    
    try {
      // Simulate LLM response (in real implementation, call Ollama API)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `I understand you said: "${content}". This is a local demo response. In production, this would connect to your local Ollama instance.`,
        timestamp: new Date().toISOString(),
      }
      
      const updatedMessages = [...get().messages, assistantMessage]
      set({ messages: updatedMessages, llmStatus: 'ready' })
      
      return assistantMessage.content
    } catch (error) {
      set({ llmStatus: 'error' })
      throw error
    }
  },
  
  checkLLMStatus: async () => {
    set({ llmStatus: 'loading' })
    try {
      // In real implementation, check Ollama status
      await new Promise(resolve => setTimeout(resolve, 500))
      set({ llmStatus: 'ready', llmModel: 'llama2' })
    } catch (error) {
      set({ llmStatus: 'offline' })
    }
  },
  
  // Voice actions
  startVoice: async () => {
    set({ voiceStatus: 'listening' })
    try {
      // In real implementation, start Whisper recording
      await new Promise(resolve => setTimeout(resolve, 2000))
      set({ voiceStatus: 'processing' })
      await new Promise(resolve => setTimeout(resolve, 1000))
      set({ voiceStatus: 'idle' })
    } catch (error) {
      set({ voiceStatus: 'error' })
    }
  },
  
  stopVoice: async () => {
    set({ voiceStatus: 'idle' })
  },
  
  // Settings actions
  updateSettings: async (newSettings) => {
    const settings = { ...get().settings, ...newSettings }
    set({ settings })
    localStorage.setItem('jarvis-settings', JSON.stringify(settings))
  },
  
  // Initialization
  initializeStore: async () => {
    // Load settings
    const storedSettings = localStorage.getItem('jarvis-settings')
    if (storedSettings) {
      set({ settings: { ...get().settings, ...JSON.parse(storedSettings) } })
    }
    
    // Load data
    await Promise.all([
      get().loadTasks(),
      get().loadEvents(),
      get().loadSkills(),
    ])
    
    // Check LLM status
    await get().checkLLMStatus()
  },
}))
