import { useMemo, useState } from 'react'
import './AdminAnalysis.css'

export default function AdminSuggestions({ suggestions, onAddSuggestion }) {
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')

  const categoryCounts = useMemo(() => {
    const counts = {}
    suggestions.forEach(s => {
      const key = s.category?.trim() || 'General'
      counts[key] = (counts[key] || 0) + 1
    })
    return counts
  }, [suggestions])

  function handleSubmit(e) {
    e.preventDefault()
    if (!message.trim()) return

    onAddSuggestion({
      id: Date.now(),
      category: category.trim() || 'General',
      message: message.trim(),
      createdAt: new Date().toISOString()
    })

    setCategory('')
    setMessage('')
  }

  return (
    <div className="admin-panel">
      <h2>Suggestion Box</h2>

      <form className="form-create" onSubmit={handleSubmit}>
        <label className="field">
          <div className="label">Category (optional)</div>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Improvements, Features, Bugs"
          />
        </label>

        <label className="field">
          <div className="label">Suggestion</div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your suggestion..."
            rows={4}
          />
        </label>

        <button className="btn primary" type="submit">Add Suggestion</button>
      </form>

      <div className="analysis-section" style={{marginTop: 20}}>
        <h3>Suggestion Categories</h3>
        {suggestions.length === 0 ? (
          <p className="empty-state">No suggestions yet. Add one above to get started.</p>
        ) : (
          <div className="subject-breakdown">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const max = Math.max(...Object.values(categoryCounts))
              const widthPct = max ? Math.round((count / max) * 100) : 0
              return (
                <div className="breakdown-item" key={cat}>
                  <div className="breakdown-label">{cat}</div>
                  <div className="breakdown-bar">
                    <div className="bar-fill" style={{ width: `${widthPct}%` }}></div>
                  </div>
                  <div className="breakdown-value">{count}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="analysis-section">
        <h3>All Suggestions</h3>
        {suggestions.length === 0 ? (
          <p className="empty-state">No suggestions yet.</p>
        ) : (
          <div className="forms-grid">
            {suggestions.map(s => (
              <div key={s.id} className="form-item">
                <div className="form-icon">💬</div>
                <h4>{s.category || 'General'}</h4>
                <p className="form-desc">{s.message}</p>
                {s.studentName && (
                  <p className="form-meta" style={{fontSize: 12, opacity: 0.85}}>
                    <strong>From:</strong> {s.studentName} {s.studentId && `(${s.studentId})`}
                  </p>
                )}
                <p className="form-meta" style={{fontSize: 12, opacity: 0.75}}>
                  {new Date(s.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
