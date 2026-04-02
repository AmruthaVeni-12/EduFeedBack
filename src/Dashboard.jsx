import { useEffect, useState } from 'react'
import './Dashboard.css'
import AdminRegister from './AdminRegister'
import AdminFeedbackForm from './AdminFeedbackForm'
import AdminAnalysis from './AdminAnalysis'
import AdminAddSections from './AdminAddSections'

export default function Dashboard({
  setRoute,
  user,
  onSignOut,
  registeredSubjects,
  subjectSections,
  createdForms,
  submissions,
  suggestions,
  onRegisterSubject,
  onCreateForm,
  onUpdateForm,
  onDeleteForm,
  onAddSection,
  onUpdateSection,
  onDeleteSection,
  onAddSuggestion,
  onSubmitResponse,
  onEnrollStudent,
}){
  const [adminTab, setAdminTab] = useState('register')
  const [activeForm, setActiveForm] = useState(null)
  const [activeFormStartedAt, setActiveFormStartedAt] = useState(null)
  const [remainingSeconds, setRemainingSeconds] = useState(null)
  const [responseValue, setResponseValue] = useState('')

  // sample data for a student – 10 engineering subjects with 5 sections each
  const subjects = Array.from({length:10}, (_, i) => ({
    id: i + 1,
    name: `Engineering Subject ${i + 1}`,
    sections: Array.from({length:5}, (_, j) => `Section ${j + 1}`)
  }));

  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';

  const studentSubjects = registeredSubjects.length > 0
    ? registeredSubjects.map(sub => ({
        ...sub,
        sections: subjectSections
          .filter(s => String(s.subjectId) === String(sub.id))
          .map(s => s.sectionName)
      }))
    : subjects

  const openFormForResponse = (form) => {
    const alreadySubmitted = submissions.some(s => s.formId === form.id)
    if (alreadySubmitted) {
      alert('You have already submitted this form.')
      return
    }

    const now = new Date()
    const start = form.startDate ? new Date(form.startDate) : null
    const end = form.endDate ? new Date(form.endDate) : null

    if (start && now < start) {
      alert('This form is not open yet.')
      return
    }

    if (end && now > end) {
      alert('This form is closed.')
      return
    }

    setActiveForm(form)
    setActiveFormStartedAt(now)
    setResponseValue(form.type === 'rating' ? '1' : '')

    if (form.timeLimitMinutes && form.timeLimitMinutes > 0) {
      setRemainingSeconds(form.timeLimitMinutes * 60)
    } else {
      setRemainingSeconds(null)
    }
  }

  useEffect(() => {
    if (remainingSeconds === null) return

    if (remainingSeconds <= 0) {
      setRemainingSeconds(0)
      return
    }

    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev === null) return null
        const next = prev - 1
        if (next <= 0) {
          clearInterval(interval)
          return 0
        }
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [remainingSeconds])

  const submitResponse = () => {
    if (!activeForm) return
    if (activeForm.timeLimitMinutes && remainingSeconds !== null && remainingSeconds <= 0) {
      alert('Time is up for this form.')
      setActiveForm(null)
      setRemainingSeconds(null)
      return
    }

    const value = responseValue.toString().trim()
    if (!value) {
      alert('Please provide a response.')
      return
    }

    if (typeof onSubmitResponse === 'function') {
      onSubmitResponse({
        id: Date.now(),
        formId: activeForm.id,
        subjectId: activeForm.subjectId,
        sectionId: activeForm.sectionId,
        type: activeForm.type,
        question: activeForm.question,
        value,
        submittedAt: new Date().toISOString(),
      })
    }

    setActiveForm(null)
    setRemainingSeconds(null)
    setResponseValue('')
    alert('Feedback submitted (demo).')
  }

  return (
    <div className="dashboard-wrap">
      <div className="dash-hero">
        <div>
          <h2>Welcome to your dashboard</h2>
          {isStudent && <p>Here are your courses and sections for the current term.</p>}
          {isAdmin && <p>Manage subjects, create feedback forms, and analyze data.</p>}
          {!isStudent && !isAdmin && <p>This is a simple placeholder dashboard. Write feedback, view reports, or manage your account.</p>}
        </div>
      </div>

      {isAdmin ? (
        <div className="admin-dashboard">
          <div className="admin-nav">
            <button className={`admin-nav-btn ${adminTab === 'register' ? 'active' : ''}`} onClick={() => setAdminTab('register')}>
              <span className="nav-icon">📚</span>
              Register Subject
            </button>
            <button className={`admin-nav-btn ${adminTab === 'sections' ? 'active' : ''}`} onClick={() => setAdminTab('sections')}>
              <span className="nav-icon">➕</span>
              Add Sections
            </button>
            <button className={`admin-nav-btn ${adminTab === 'forms' ? 'active' : ''}`} onClick={() => setAdminTab('forms')}>
              <span className="nav-icon">📋</span>
              Create Forms
            </button>
            <button className={`admin-nav-btn ${adminTab === 'analysis' ? 'active' : ''}`} onClick={() => setAdminTab('analysis')}>
              <span className="nav-icon">📊</span>
              Analysis
            </button>
          </div>

          <div className="admin-content">
            {adminTab === 'register' && (
              <AdminRegister registeredSubjects={registeredSubjects} onRegisterSubject={onRegisterSubject} />
            )}
            {adminTab === 'sections' && (
              <AdminAddSections
                registeredSubjects={registeredSubjects}
                subjectSections={subjectSections}
                onAddSection={onAddSection}
                onUpdateSection={onUpdateSection}
                onDeleteSection={onDeleteSection}
              />
            )}
            {adminTab === 'forms' && (
              <AdminFeedbackForm
                registeredSubjects={registeredSubjects}
                subjectSections={subjectSections}
                createdForms={createdForms}
                onCreateForm={onCreateForm}
                onUpdateForm={onUpdateForm}
                onDeleteForm={onDeleteForm}
              />
            )}
            {adminTab === 'analysis' && (
              <AdminAnalysis
                registeredSubjects={registeredSubjects}
                createdForms={createdForms}
                submissions={submissions}
                suggestions={suggestions}
              />
            )}
          </div>
        </div>
      ) : isStudent ? (
        <div className="student-dashboard">
          <div className="student-section">
            <h3>Your Enrollment</h3>
            {user?.subjectId && user?.sectionId ? (
              <div style={{padding: '12px 14px', background: 'rgba(255,255,255,0.08)', borderRadius: 8}}>
                <p style={{margin: 0}}><strong>Subject:</strong> {registeredSubjects.find(s => String(s.id) === String(user.subjectId))?.name || 'Unknown'}</p>
                <p style={{margin: 0}}><strong>Section:</strong> {subjectSections.find(s => String(s.id) === String(user.sectionId))?.sectionName || 'Unknown'}</p>
                <button className="btn" style={{marginTop: 12}} onClick={() => onEnrollStudent({ subjectId: '', sectionId: '' })}>
                  Change Enrollment
                </button>
              </div>
            ) : (
              <div className="form-create">
                <p className="empty-state">Select your subject and section to see assigned feedback forms.</p>
                <label className="field">
                  <div className="label">Select Subject</div>
                  <select value={user?.subjectId || ''} onChange={(e) => onEnrollStudent({ subjectId: e.target.value, sectionId: '' })}>
                    <option value="">Choose a subject</option>
                    {registeredSubjects.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <div className="label">Select Section</div>
                  <select
                    value={user?.sectionId || ''}
                    onChange={(e) => onEnrollStudent({ subjectId: user?.subjectId || '', sectionId: e.target.value })}
                    disabled={!user?.subjectId}
                  >
                    <option value="">Choose a section</option>
                    {subjectSections
                      .filter(s => String(s.subjectId) === String(user?.subjectId))
                      .map(sec => (
                        <option key={sec.id} value={sec.id}>{sec.sectionName}</option>
                      ))}
                  </select>
                </label>
              </div>
            )}
          </div>

          <div className="student-section">
            <h3>Upcoming / Active Feedback</h3>
            {(!user?.subjectId || !user?.sectionId) ? (
              <p className="empty-state">Enroll first to see feedback forms for your section.</p>
            ) : (
              <>{
                (() => {
                  const studentForms = createdForms.filter(form =>
                    String(form.subjectId) === String(user.subjectId) &&
                    String(form.sectionId) === String(user.sectionId)
                  )

                  if (studentForms.length === 0) {
                    return <p className="empty-state">No feedback forms have been created for your section yet.</p>
                  }

                  return (
                    <div className="forms-grid">
                      {studentForms.map(form => {
                        const now = new Date()
                        const start = form.startDate ? new Date(form.startDate) : null
                        const end = form.endDate ? new Date(form.endDate) : null
                        const completed = submissions.some(s => s.formId === form.id)
                        const upcoming = start && now < start
                        const closed = end && now > end

                        return (
                          <div className="form-card" key={form.id}>
                            <div className="form-card-header">
                              <div>
                                <strong>{form.title}</strong>
                                <div className="form-meta">{form.subjectName} • {form.sectionName || form.section}</div>
                              </div>
                              <div className="form-status">
                                {completed ? (
                                  <span className="badge completed">Completed</span>
                                ) : upcoming ? (
                                  <span className="badge upcoming">Upcoming</span>
                                ) : closed ? (
                                  <span className="badge closed">Closed</span>
                                ) : (
                                  <span className="badge open">Open</span>
                                )}
                              </div>
                            </div>

                            <p className="form-desc">{form.question || form.title}</p>
                            <div className="form-dates">
                              {form.startDate && <span>Starts: {form.startDate}</span>}
                              {form.endDate && <span>Ends: {form.endDate}</span>}
                            </div>

                            <div className="form-actions">
                              <button
                                className="btn primary"
                                onClick={() => openFormForResponse(form)}
                                disabled={completed || upcoming || closed}
                              >
                                {completed ? 'Submitted' : (upcoming ? 'Upcoming' : (closed ? 'Closed' : 'Submit'))}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })()
              }</>
            )}
          </div>

          <div className="student-section">
            <h3>Suggestion Box</h3>
            <p style={{marginTop:0}}>Share feedback or suggestions with your admin.</p>
            <form
              className="form-create"
              onSubmit={(e) => {
                e.preventDefault()
                const msg = e.target.suggestion.value?.trim()
                if (!msg) return
                onAddSuggestion({
                  id: Date.now(),
                  category: 'Student',
                  message: msg,
                  createdAt: new Date().toISOString(),
                })
                e.target.suggestion.value = ''
                alert('Suggestion submitted!')
              }}
            >
              <label className="field">
                <div className="label">Your suggestion</div>
                <textarea name="suggestion" rows={3} placeholder="Type your suggestion here..."></textarea>
              </label>
              <button className="btn primary" type="submit">Submit Suggestion</button>
            </form>
          </div>

          {activeForm && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Answer: {activeForm.question || activeForm.title}</h3>
                <p style={{margin:'4px 0 12px', color:'rgba(255,255,255,0.75)'}}>
                  {activeForm.subjectName} • {activeForm.sectionName || activeForm.section}
                </p>

                {activeForm.type === 'rating' && (
                  <label className="field">
                    <div className="label">Select rating</div>
                    <select value={responseValue} onChange={(e) => setResponseValue(e.target.value)}>
                      {Array.from({length: (activeForm.scaleMax || 5)}, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </label>
                )}

                {activeForm.type === 'mcq' && (
                  <label className="field">
                    <div className="label">Choose an option</div>
                    <select value={responseValue} onChange={(e) => setResponseValue(e.target.value)}>
                      <option value="">Select...</option>
                      {(activeForm.options || []).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </label>
                )}

                {activeForm.type === 'yesno' && (
                  <label className="field">
                    <div className="label">Choose</div>
                    <select value={responseValue} onChange={(e) => setResponseValue(e.target.value)}>
                      <option value="">Select...</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </label>
                )}

                {activeForm.type === 'text' && (
                  <label className="field">
                    <div className="label">Your response</div>
                    <textarea
                      value={responseValue}
                      onChange={(e) => setResponseValue(e.target.value)}
                      rows={5}
                      placeholder="Write your feedback here..."
                    />
                  </label>
                )}

                {remainingSeconds !== null && (
                  <div style={{marginBottom: 12, color: 'rgba(255,255,255,0.75)'}}>
                    Time remaining: {Math.floor(remainingSeconds / 60).toString().padStart(2, '0')}:{(remainingSeconds % 60).toString().padStart(2, '0')}
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    className="btn primary"
                    onClick={submitResponse}
                    disabled={remainingSeconds !== null && remainingSeconds <= 0}
                  >
                    Submit
                  </button>
                  <button className="btn" onClick={() => { setActiveForm(null); setRemainingSeconds(null) }}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="dash-card">
          <h3 style={{margin:0}}>Recent Activity</h3>
          <p style={{color:'rgba(255,255,255,0.8)'}}>No activity yet — start by writing feedback.</p>
          <div className="dash-small">
            <div className="tile">No reports</div>
            <div className="tile">No submissions</div>
          </div>
        </div>
      )}
    </div>
  )
}
