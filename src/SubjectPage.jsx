import './SubjectPage.css'

export default function SubjectPage({ subject, onBack }){
  if (!subject) {
    return (
      <div className="subject-page-wrap">
        <button className="btn-back" onClick={onBack}>← Back to Dashboard</button>
        <p>No subject selected</p>
      </div>
    )
  }

  return (
    <div className="subject-page-wrap">
      <button className="btn-back" onClick={onBack}>← Back to Dashboard</button>
      
      <div className="subject-header">
        <h1>{subject.name}</h1>
        <p className="subject-meta">Total Sections: {subject.sections?.length || 0}</p>
      </div>

      <div className="sections-container">
        <h2>Sections</h2>
        <div className="sections-grid">
          {subject.sections?.map(section => (
            <div className="section-item" key={section}>
              <div className="section-icon">📝</div>
              <h3>{section}</h3>
              <p className="section-desc">View feedback and details for {section}</p>
              <button className="btn-section">View Section</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
