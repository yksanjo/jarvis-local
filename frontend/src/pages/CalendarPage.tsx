import { useState } from 'react'
import { Plus, Trash2, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react'
import { useAppStore, CalendarEvent } from '../store/appStore'
import './CalendarPage.css'

export function CalendarPage() {
  const { events, addEvent, deleteEvent } = useAppStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    recurrence: '',
    location: ''
  })

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEvent.title.trim() || !newEvent.startTime) return

    await addEvent({
      ...newEvent,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime || newEvent.startTime,
      recurrence: newEvent.recurrence || null,
      location: newEvent.location || null
    })

    setNewEvent({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      recurrence: '',
      location: ''
    })
    setShowAddForm(false)
  }

  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  )

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="page calendar-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Calendar</h1>
          <p className="page-subtitle">Manage your local calendar events</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddForm(true)}>
          <Plus size={18} />
          Add Event
        </button>
      </div>

      {showAddForm && (
        <div className="event-form card">
          <h3>Add New Event</h3>
          <form onSubmit={handleAddEvent}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Event title..."
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Event description..."
                rows={2}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Time</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Location (optional)</label>
              <input
                type="text"
                className="form-input"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="Event location..."
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add Event
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="events-list">
        {sortedEvents.length === 0 ? (
          <div className="empty-state">
            <CalendarIcon size={48} className="empty-state-icon" />
            <h3 className="empty-state-title">No events</h3>
            <p className="empty-state-description">
              Create your first event to get started. All data is stored locally.
            </p>
            <button className="btn-primary" onClick={() => setShowAddForm(true)}>
              <Plus size={18} />
              Add Event
            </button>
          </div>
        ) : (
          sortedEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-date">
                <div className="event-day">{new Date(event.startTime).getDate()}</div>
                <div className="event-month">
                  {new Date(event.startTime).toLocaleDateString('en-US', { month: 'short' })}
                </div>
              </div>
              <div className="event-content">
                <div className="event-title">{event.title}</div>
                {event.description && (
                  <div className="event-description">{event.description}</div>
                )}
                <div className="event-meta">
                  <span className="event-time">
                    <Clock size={12} />
                    {formatDate(event.startTime)}
                    {event.endTime && event.endTime !== event.startTime && (
                      <> - {formatDate(event.endTime)}</>
                    )}
                  </span>
                  {event.location && (
                    <span className="event-location">
                      <MapPin size={12} />
                      {event.location}
                    </span>
                  )}
                </div>
              </div>
              <button 
                className="event-delete"
                onClick={() => deleteEvent(event.id)}
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
