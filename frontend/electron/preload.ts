import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  
  // App info
  getPath: (name: string) => ipcRenderer.invoke('app:getPath', name),
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  
  // Event listeners
  onActivateVoice: (callback: () => void) => {
    ipcRenderer.on('activate-voice', callback)
    return () => ipcRenderer.removeListener('activate-voice', callback)
  },
  
  // Database operations
  dbQuery: (query: string, params?: any[]) => ipcRenderer.invoke('db:query', query, params),
  dbRun: (query: string, params?: any[]) => ipcRenderer.invoke('db:run', query, params),
  dbGetAll: (query: string, params?: any[]) => ipcRenderer.invoke('db:getAll', query, params),
  dbGet: (query: string, params?: any[]) => ipcRenderer.invoke('db:get', query, params),
  
  // File operations
  selectDirectory: () => ipcRenderer.invoke('dialog:selectDirectory'),
  selectFile: (filters?: any[]) => ipcRenderer.invoke('dialog:selectFile', filters),
  readFile: (path: string) => ipcRenderer.invoke('file:read', path),
  writeFile: (path: string, content: string) => ipcRenderer.invoke('file:write', path, content),
  
  // LLM operations
  llmChat: (messages: any[]) => ipcRenderer.invoke('llm:chat', messages),
  llmCheckStatus: () => ipcRenderer.invoke('llm:status'),
  
  // Voice operations
  voiceStart: () => ipcRenderer.invoke('voice:start'),
  voiceStop: () => ipcRenderer.invoke('voice:stop'),
  voiceOnResult: (callback: (text: string) => void) => {
    const handler = (_: any, text: string) => callback(text)
    ipcRenderer.on('voice:result', handler)
    return () => ipcRenderer.removeListener('voice:result', handler)
  },
})

// Type declarations for TypeScript
declare global {
  interface Window {
    electronAPI: {
      minimize: () => Promise<void>
      maximize: () => Promise<boolean>
      close: () => Promise<void>
      isMaximized: () => Promise<boolean>
      getPath: (name: string) => Promise<string>
      getVersion: () => Promise<string>
      onActivateVoice: (callback: () => void) => () => void
      dbQuery: (query: string, params?: any[]) => Promise<any>
      dbRun: (query: string, params?: any[]) => Promise<any>
      dbGetAll: (query: string, params?: any[]) => Promise<any[]>
      dbGet: (query: string, params?: any[]) => Promise<any>
      selectDirectory: () => Promise<string | null>
      selectFile: (filters?: any[]) => Promise<string | null>
      readFile: (path: string) => Promise<string>
      writeFile: (path: string, content: string) => Promise<void>
      llmChat: (messages: any[]) => Promise<string>
      llmCheckStatus: () => Promise<{ running: boolean; model: string }>
      voiceStart: () => Promise<void>
      voiceStop: () => Promise<void>
      voiceOnResult: (callback: (text: string) => void) => () => void
    }
  }
}
