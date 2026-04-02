import { useState } from 'react'
import './AdminAddSections.css'

export default function AdminAddSections({ registeredSubjects, subjectSections, onAddSection, onUpdateSection, onDeleteSection }){
  const [selectedSubject, setSelectedSubject] = useState('')
  const [sectionName, setSectionName] = useState('')
  const [sectionDescription, setSectionDescription] = useState('')
  const [editingSectionId, setEditingSectionId] = useState(null)

  function resetForm() {
    setSelectedSubject('')
    setSectionName('')
    setSectionDescription('')
    setEditingSectionId(null)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!selectedSubject || !sectionName.trim()) return

    const subject = registeredSubjects?.find(s => s.id === parseInt(selectedSubject))

    if (editingSectionId) {
      onUpdateSection({
        id: editingSectionId,
        subjectId: selectedSubject,
        subjectName: subject?.name,
        sectionName: sectionName,
        description: sectionDescription
      })
      resetForm()
      return
    }

    onAddSection({
      id: Date.now(),
      subjectId: selectedSubject,
      subjectName: subject?.name,
      sectionName: sectionName,
      description: sectionDescription
    })
    resetForm()
  }

  const getSectionsForSubject = (subjectId) => {
    return subjectSections?.filter(s => s.subjectId === subjectId) || []
  }

  return (
    <div className="admin-panel">
      <h2>Add Sections to Subjects</h2>
      
      {registeredSubjects && registeredSubjects.length > 0 ? (
        <>
          <form className="section-form" onSubmit={handleSubmit}>
            <label className="field">
              <div className="label">Select Subject</div>
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} required>
                <option value="">Choose a subject</option>
                {registeredSubjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <div className="label">Section Name</div>
              <input value={sectionName} onChange={(e) => setSectionName(e.target.value)} placeholder="e.g., Section A" required />
            </label>

            <label className="field">
              <div className="label">Section Description</div>
              <textarea value={sectionDescription} onChange={(e) => setSectionDescription(e.target.value)} placeholder="Describe this section..." rows="3"></textarea>
            </label>

            <button className="btn primary" type="submit">Add Section</button>
          </form>

          <div className="sections-overview">
            <h3>Sections Overview</h3>
            {registeredSubjects.map(subject => {
              const sections = getSectionsForSubject(subject.id.toString())
              return (
                <div className="subject-sections" key={subject.id}>
                  <h4>{subject.name} ({sections.length} sections)</h4>
                  {sections.length > 0 ? (
                    <div className="sections-list-item">
                      {sections.map(sec => {
                        const isEditing = editingSectionId === sec.id
                        return (
                          <div className="section-badge" key={sec.id}>
                            {isEditing ? (
                              <>
                                <input
                                  className="badge-input"
                                  value={sectionName}
                                  onChange={(e) => setSectionName(e.target.value)}
                                  placeholder="Section name"
                                />
                                <textarea
                                  className="badge-textarea"
                                  value={sectionDescription}
                                  onChange={(e) => setSectionDescription(e.target.value)}
                                  placeholder="Section description"
                                />
                                <div className="badge-actions">
                                  <button className="btn primary" onClick={handleSubmit} type="button">Save</button>
                                  <button className="btn" onClick={resetForm} type="button">Cancel</button>
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="badge-text">{sec.sectionName}</span>
                                {sec.description && <span className="badge-desc">{sec.description}</span>}
                                <div className="badge-actions">
                                  <button
                                    className="btn"
                                    type="button"
                                    onClick={() => {
                                      setEditingSectionId(sec.id)
                                      setSelectedSubject(sec.subjectId)
                                      setSectionName(sec.sectionName)
                                      setSectionDescription(sec.description || '')
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button className="btn" type="button" onClick={() => onDeleteSection(sec.id)}>
                                    Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="no-sections">No sections added yet</p>
                  )}
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <p className="empty-state">Please register subjects first to add sections.</p>
      )}
    </div>
  )
}
