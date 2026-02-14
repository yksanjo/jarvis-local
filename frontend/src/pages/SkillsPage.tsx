import { Puzzle, Power, Settings, Plus } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import './SkillsPage.css'

export function SkillsPage() {
  const { skills, toggleSkill } = useAppStore()

  return (
    <div className="page skills-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Skills</h1>
          <p className="page-subtitle">Manage your AI skills and plugins</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} />
          Add Skill
        </button>
      </div>

      <div className="skills-grid">
        {skills.map((skill) => (
          <div key={skill.id} className={`skill-card ${skill.enabled ? 'enabled' : ''}`}>
            <div className="skill-header">
              <div className="skill-icon">
                <Puzzle size={24} />
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={skill.enabled}
                  onChange={() => toggleSkill(skill.id)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="skill-content">
              <h3 className="skill-name">{skill.name}</h3>
              <p className="skill-description">{skill.description}</p>
            </div>
            <div className="skill-footer">
              <button className="skill-settings">
                <Settings size={16} />
                Configure
              </button>
            </div>
          </div>
        ))}

        <div className="skill-card add-new">
          <div className="skill-add-content">
            <Plus size={32} />
            <p>Add Custom Skill</p>
          </div>
        </div>
      </div>

      <div className="skills-info card">
        <h3>About Skills</h3>
        <p>
          Skills extend Jarvis's capabilities. Enable or disable skills based on your needs.
          All skills run locally - no data is sent to external servers.
        </p>
        <ul>
          <li><strong>Calculator</strong> - Perform mathematical calculations</li>
          <li><strong>Timer</strong> - Set timers and alarms</li>
          <li><strong>Notes</strong> - Take and manage notes</li>
          <li><strong>Weather</strong> - Get cached weather information</li>
        </ul>
      </div>
    </div>
  )
}
