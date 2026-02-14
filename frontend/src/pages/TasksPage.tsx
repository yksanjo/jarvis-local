import { useState } from 'react'
import { Plus, Trash2, Edit2, Calendar, Tag, CheckCircle, Circle, Clock } from 'lucide-react'
import { useAppStore, Task } from '../store/appStore'
import './TasksPage.css'

export function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useAppStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'pending' as 'pending' | 'in_progress' | 'completed',
    tags: [] as string[]
  })
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return task.status !== 'completed'
    if (filter === 'completed') return task.status === 'completed'
    return true
  })

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) return

    await addTask({
      ...newTask,
      dueDate: newTask.dueDate || null,
    })

    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'pending',
      tags: []
    })
    setShowAddForm(false)
  }

  const handleToggleComplete = async (task: Task) => {
    await updateTask(task.id, {
      status: task.status === 'completed' ? 'pending' : 'completed'
    })
  }

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'primary'
    }
  }

  return (
    <div className="page tasks-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Manage your tasks with natural language</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddForm(true)}>
          <Plus size={18} />
          Add Task
        </button>
      </div>

      <div className="task-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {showAddForm && (
        <div className="task-form card">
          <h3>Add New Task</h3>
          <form onSubmit={handleAddTask}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title..."
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Enter task description..."
                rows={3}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-input"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="tasks-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={48} className="empty-state-icon" />
            <h3 className="empty-state-title">No tasks yet</h3>
            <p className="empty-state-description">
              Create your first task to get started. You can also add tasks using voice commands.
            </p>
            <button className="btn-primary" onClick={() => setShowAddForm(true)}>
              <Plus size={18} />
              Add Task
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className={`task-card ${task.status}`}>
              <button 
                className="task-checkbox"
                onClick={() => handleToggleComplete(task)}
              >
                {task.status === 'completed' ? (
                  <CheckCircle size={20} className="checked" />
                ) : (
                  <Circle size={20} />
                )}
              </button>
              <div className="task-content">
                <div className="task-title">{task.title}</div>
                {task.description && (
                  <div className="task-description">{task.description}</div>
                )}
                <div className="task-meta">
                  {task.dueDate && (
                    <span className="task-due">
                      <Calendar size={12} />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <span className={`badge badge-${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              <button 
                className="task-delete"
                onClick={() => handleDeleteTask(task.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
