import { useState } from 'react'
import './AdminFeedbackForm.css'

export default function AdminFeedbackForm({ registeredSubjects, subjectSections, createdForms, onCreateForm, onUpdateForm, onDeleteForm }){
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [currentType, setCurrentType] = useState('rating')
  const [currentOptions, setCurrentOptions] = useState('')
  const [currentRatingScale, setCurrentRatingScale] = useState(5)
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [timeLimitMinutes, setTimeLimitMinutes] = useState('')
  const [editingFormId, setEditingFormId] = useState(null)
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null)

  function resetForm() {
    setSelectedSubject('')
    setSelectedSection('')
    setQuestions([])
    setCurrentQuestion('')
    setCurrentType('rating')
    setCurrentOptions('')
    setCurrentRatingScale(5)
    setFormTitle('')
    setFormDescription('')
    setStartDate('')
    setEndDate('')
    setEditingFormId(null)
    setEditingQuestionIndex(null)
  }

  function addQuestion() {
    if (!currentQuestion.trim()) {
      alert('Please enter a question.')
      return
    }

    const newQuestion = {
      id: Date.now(),
      text: currentQuestion.trim(),
      type: currentType,
      options: currentType === 'mcq' ? currentOptions.split(',').map(o => o.trim()).filter(Boolean) : [],
      scaleMax: currentType === 'rating' ? Number(currentRatingScale) || 5 : undefined,
    }

    if (editingQuestionIndex !== null) {
      const updated = [...questions]
      updated[editingQuestionIndex] = newQuestion
      setQuestions(updated)
      setEditingQuestionIndex(null)
    } else {
      setQuestions([...questions, newQuestion])
    }

    // Reset question fields
    setCurrentQuestion('')
    setCurrentType('rating')
    setCurrentOptions('')
    setCurrentRatingScale(5)
  }

  function removeQuestion(index) {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  function editQuestion(index) {
    const q = questions[index]
    setCurrentQuestion(q.text)
    setCurrentType(q.type)
    setCurrentOptions(q.options?.join(', ') || '')
    setCurrentRatingScale(q.scaleMax || 5)
    setEditingQuestionIndex(index)
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!selectedSubject || !selectedSection || !formTitle.trim() || questions.length === 0) {
      alert('Please fill in all required fields and add at least one question.')
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
      questions: questions,
      title: formTitle,
      description: formDescription,
      startDate: startDate || null,
      endDate: endDate || null,
      timeLimitMinutes: timeLimitMinutes ? Number(timeLimitMinutes) : null,
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
              <div className="label">Form Title</div>
              <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g., Mid-semester Feedback" required />
            </label>

            <label className="field">
              <div className="label">Form Description</div>
              <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Describe the feedback form..." rows="3"></textarea>
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

            <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16, marginTop: 16}}>
              <h3 style={{marginTop: 0}}>Questions ({questions.length})</h3>
              
              <div style={{background: 'rgba(255,255,255,0.05)', padding: 14, borderRadius: 8, marginBottom: 16}}>
                <label className="field">
                  <div className="label">Question Type</div>
                  <select value={currentType} onChange={(e) => setCurrentType(e.target.value)}>
                    <option value="rating">Rating</option>
                    <option value="mcq">Multiple Choice</option>
                    <option value="yesno">Yes / No</option>
                    <option value="text">Open Text</option>
                  </select>
                </label>

                <label className="field">
                  <div className="label">Question Text</div>
                  <input
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    placeholder="e.g., How would you rate the teaching quality?"
                  />
                </label>

                {currentType === 'mcq' && (
                  <label className="field">
                    <div className="label">Options (comma separated)</div>
                    <input
                      value={currentOptions}
                      onChange={(e) => setCurrentOptions(e.target.value)}
                      placeholder="e.g., Excellent,Good,Average,Poor"
                    />
                  </label>
                )}

                {currentType === 'rating' && (
                  <label className="field">
                    <div className="label">Rating Scale Max</div>
                    <input
                      type="number"
                      min="2"
                      max="10"
                      value={currentRatingScale}
                      onChange={(e) => setCurrentRatingScale(e.target.value)}
                    />
                  </label>
                )}

                <button
                  type="button"
                  className="btn primary"
                  onClick={addQuestion}
                  style={{width: '100%'}}
                >
                  {editingQuestionIndex !== null ? '✓ Update Question' : '+ Add Question'}
                </button>
                {editingQuestionIndex !== null && (
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      setEditingQuestionIndex(null)
                      setCurrentQuestion('')
                      setCurrentType('rating')
                      setCurrentOptions('')
                      setCurrentRatingScale(5)
                    }}
                    style={{width: '100%', marginTop: 8}}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              {questions.length > 0 && (
                <div style={{marginBottom: 16}}>
                  <h4>Added Questions:</h4>
                  {questions.map((q, idx) => (
                    <div key={q.id} style={{background: 'rgba(255,255,255,0.08)', padding: 12, borderRadius: 6, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12}}>
                      <div style={{flex: 1}}>
                        <p style={{margin: '0 0 4px 0', fontWeight: 500}}>{idx + 1}. {q.text}</p>
                        <p style={{margin: 0, fontSize: 12, opacity: 0.7}}>Type: <strong>{q.type}</strong> {q.options?.length > 0 && `• Options: ${q.options.join(', ')}`}</p>
                      </div>
                      <div style={{display: 'flex', gap: 6}}>
                        <button
                          type="button"
                          className="btn"
                          onClick={() => editQuestion(idx)}
                          style={{padding: '6px 12px', fontSize: 12}}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn"
                          onClick={() => removeQuestion(idx)}
                          style={{padding: '6px 12px', fontSize: 12}}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
                              setQuestions(form.questions || [])
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
                        <strong>Questions:</strong> {form.questions?.length || 1}
                      </p>
                      {form.questions && form.questions.length > 0 && (
                        <p className="form-meta" style={{marginTop: 4, fontSize: 12}}>
                          {form.questions.map(q => q.text).join(' • ')}
                        </p>
                      )}
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
