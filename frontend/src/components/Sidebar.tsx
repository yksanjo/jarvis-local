import { 
  Home, 
  CheckSquare, 
  FolderSearch, 
  Calendar, 
  Puzzle, 
  Settings,
  Mic
} from 'lucide-react'
import { PageType } from '../store/appStore'
import './Sidebar.css'

interface SidebarProps {
  currentPage: PageType
  onNavigate: (page: PageType) => void
}

const navItems: { id: PageType; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home size={20} /> },
  { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
  { id: 'files', label: 'Files', icon: <FolderSearch size={20} /> },
  { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
  { id: 'skills', label: 'Skills', icon: <Puzzle size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
]

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <button className="sidebar-voice-btn">
          <Mic size={20} />
          <span>Voice Command</span>
        </button>
      </div>
    </aside>
  )
}
