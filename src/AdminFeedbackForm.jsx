import { useState } from 'react'
import './AdminFeedbackForm.css'

export default function AdminFeedbackForm({ registeredSubjects, subjectSections, createdForms, onCreateForm, onUpdateForm, onDeleteForm }){
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [formType, setFormType] = useState('rating')
  const [question, setQuestion] = useState('')
  const [mcqOptions, setMcqOptions] = useState('')
  const [ratingScale, setRatingScale] = useState(5)
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [timeLimitMinutes, setTimeLimitMinutes] = useState('')
  const [editingFormId, setEditingFormId] = useState(null)

  function resetForm() {
    setSelectedSubject('')
    setSelectedSection('')
    setFormType('rating')
    setQuestion('')
    setMcqOptions('')
    setRatingScale(5)
    setFormTitle('')
    setFormDescription('')
    setStartDate('')
    setEndDate('')
    setEditingFormId(null)
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!selectedSubject || !selectedSection || !formTitle.trim()) {
      return
    }

    const subject = registeredSubjects?.find(s => s.id === parseInt(selectedSubject))
    const section = subjectSections?.find(s => s.id === parseInt(selectedSection))

    const formPayload = {
      id: editingFormId || Date.now(),
      subjectId: selectedSubject,
      subjectName: subject?.name,
      sectionId: selectedSection,
      sectionName: section?.sectionName || '',
      type: formType,
      question: question.trim() || formTitle,
      options: formType === 'mcq' ? mcqOptions.split(',').map(o => o.trim()).filter(Boolean) : [],
      scaleMax: formType === 'rating' ? Number(ratingScale) || 5 : undefined,
      timeLimitMinutes: timeLimitMinutes ? Number(timeLimitMinutes) : null,
      title: formTitle,
      description: formDescription,
      startDate: startDate || null,
      endDate: endDate || null,
      createdAt: new Date().toISOString()
    }

    if (editingFormId) {
      onUpdateForm(formPayload)
      resetForm()
      return
    }

    onCreateForm(formPayload)
    resetForm()
  }

  const sectionsForSubject = subjectSections.filter(s => s.subjectId === selectedSubject)

  return (
    <div className="admin-panel">
      <h2>Create Feedback Forms</h2>
      
      {registeredSubjects && registeredSubjects.length > 0 ? (
        <>
          <form className="form-create" onSubmit={handleSubmit}>
            <label className="field">
              <div className="label">Select Subject</div>
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} required>
                <option value="">Choose a registered subject</option>
                {registeredSubjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                ))}
              </select>
            </label>

            <label className="field">
              <div className="label">Select Section</div>
              <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} required>
                <option value="">Choose a section</option>
                {sectionsForSubject.map(sec => (
                  <option key={sec.id} value={sec.id}>{sec.sectionName}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <div className="label">Form Type</div>
              <select value={formType} onChange={(e) => setFormType(e.target.value)}>
                <option value="rating">Rating (1-5)</option>
                <option value="mcq">Multiple Choice</option>
                <option value="yesno">Yes / No</option>
                <option value="text">Open Text</option>
              </select>
            </label>

            <label className="field">
              <div className="label">Question</div>
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., How would you rate the teaching?"
                required
              />
            </label>

            {formType === 'mcq' && (
              <label className="field">
                <div className="label">Options (comma separated)</div>
                <input
                  value={mcqOptions}
                  onChange={(e) => setMcqOptions(e.target.value)}
                  placeholder="e.g., Excellent,Good,Average,Poor"
                />
              </label>
            )}

            {formType === 'rating' && (
              <label className="field">
                <div className="label">Rating Scale Max</div>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={ratingScale}
                  onChange={(e) => setRatingScale(e.target.value)}
                />
              </label>
            )}

            <label className="field">
              <div className="label">Form Title</div>
              <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g., Mid-semester Feedback" required />
            </label>

            <label className="field">
              <div className="label">Form Description</div>
              <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Describe the feedback form..." rows="4"></textarea>
            </label>

            <label className="field">
              <div className="label">Start Date</div>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>

            <label className="field">
              <div className="label">End Date</div>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>

            <label className="field">
              <div className="label">Time Limit (minutes)</div>
              <input
                type="number"
                min="0"
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(e.target.value)}
                placeholder="Leave blank for no limit"
              />
            </label>

            <div className="form-actions">
              <button className="btn primary" type="submit">
                {editingFormId ? 'Save Changes' : 'Create Form'}
              </button>
              {editingFormId && (
                <button className="btn" type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="forms-list">
            <h3>Created Forms ({createdForms?.length || 0})</h3>
            {createdForms && createdForms.length > 0 ? (
              <div className="forms-grid">
                {createdForms.map(form => {
                  const now = new Date()
                  const end = form.endDate ? new Date(form.endDate) : null
                  const isClosed = end && now > end

                  return (
                    <div className="form-item" key={form.id}>
                      <div className="form-icon">📋</div>
                      <div className="form-header">
                        <h4>{form.title}</h4>
                        <div className="form-actions">
                          <button
                            className="btn"
                            type="button"
                            onClick={() => {
                              setEditingFormId(form.id)
                              setSelectedSubject(form.subjectId)
                              setSelectedSection(form.sectionId)
                              setFormType(form.type || 'rating')
                              setQuestion(form.question || form.title)
                              setMcqOptions((form.options || []).join(', '))
                              setRatingScale(form.scaleMax || 5)
                              setTimeLimitMinutes(form.timeLimitMinutes || '')
                              setFormTitle(form.title)
                              setFormDescription(form.description || '')
                              setStartDate(form.startDate || '')
                              setEndDate(form.endDate || '')
                            }}
                          >
                            Edit
                          </button>
                          <button className="btn" type="button" onClick={() => onDeleteForm(form.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="form-meta">
                        {form.subjectName} • {form.sectionName || form.section}
                        {isClosed && ' (Closed)'}
                      </p>
                      <p className="form-meta" style={{marginTop: 4}}>
                        <strong>Type:</strong> {form.type || 'rating'} • <strong>Question:</strong> {form.question || form.title}
                      </p>
                      {typeof form.timeLimitMinutes === 'number' && form.timeLimitMinutes > 0 && (
                        <p className="form-meta" style={{marginTop: 4}}>
                          <strong>Time limit:</strong> {form.timeLimitMinutes} min
                        </p>
                      )}
                      {form.startDate && <p className="form-deadline">Opens: {form.startDate}</p>}
                      {form.endDate && <p className="form-deadline">Closes: {form.endDate}</p>}
                      <p className="form-desc">{form.description || 'No description'}</p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="empty-state">No forms created yet. Create one above.</p>
            )}
          </div>
        </>
      ) : (
        <p className="empty-state">Please register subjects first to create feedback forms.</p>
      )}
    </div>
  )
}
