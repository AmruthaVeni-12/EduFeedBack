import './AdminAnalysis.css'
import { useState } from 'react'

export default function AdminAnalysis({ registeredSubjects, createdForms, submissions = [], suggestions = [] }){
  const [showAdminDetailsForm, setShowAdminDetailsForm] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(null)
  const [adminDetails, setAdminDetails] = useState({
    department: '',
    role: '',
    experience: '',
    expertise: '',
    bio: ''
  })

  const totalSubjects = registeredSubjects?.length || 0
  const totalForms = createdForms?.length || 0
  const attemptedForms = new Set(submissions.map(s => s.formId)).size
  const unattemptedForms = Math.max(0, totalForms - attemptedForms)

  const formsBySubject = {}
  
  if (createdForms) {
    createdForms.forEach(form => {
      if (!formsBySubject[form.subjectName]) {
        formsBySubject[form.subjectName] = 0
      }
      formsBySubject[form.subjectName]++
    })
  }

  const getResponses = (formId) => submissions.filter(s => s.formId === formId)

  const buildRatingData = (form, questionId = null) => {
    let formQuestions = form.questions || []
    if (formQuestions.length === 0 && form.type) {
      // Fallback for old format
      formQuestions = [{id: form.id, type: form.type, scaleMax: form.scaleMax}]
    }
    
    const question = questionId ? formQuestions.find(q => q.id === questionId) : formQuestions[0]
    const max = question?.scaleMax || 5
    const counts = Array.from({ length: max }, () => 0)
    const responses = getResponses(form.id).filter(r => !questionId || r.questionId === questionId || !r.questionId)
    responses.forEach(r => {
      const val = parseInt(r.value, 10)
      if (!isNaN(val) && val >= 1 && val <= max) {
        counts[val - 1]++
      }
    })
    return counts
  }

  const buildOptionData = (form, questionId = null) => {
    let formQuestions = form.questions || []
    if (formQuestions.length === 0 && form.type) {
      // Fallback for old format
      formQuestions = [{id: form.id, type: form.type, options: form.options}]
    }
    
    const question = questionId ? formQuestions.find(q => q.id === questionId) : formQuestions[0]
    const options = question?.options || form.options || []
    const counts = {}
    options.forEach(o => { counts[o] = 0 })
    getResponses(form.id).filter(r => !questionId || r.questionId === questionId || !r.questionId).forEach(r => {
      const v = r.value
      if (v && counts[v] !== undefined) {
        counts[v]++
      } else if (v) {
        counts.Other = (counts.Other || 0) + 1
      }
    })
    return counts
  }

  const handleAdminDetailsChange = (e) => {
    const { name, value } = e.target
    setAdminDetails(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveAdminDetails = () => {
    console.log('Admin details saved:', adminDetails)
    alert('Admin details saved successfully!')
    setShowAdminDetailsForm(false)
    setAdminDetails({
      department: '',
      role: '',
      experience: '',
      expertise: '',
      bio: ''
    })
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Analysis & Statistics</h2>
        <button 
          className="btn-add-details" 
          onClick={() => setShowAdminDetailsForm(!showAdminDetailsForm)}
        >
          {showAdminDetailsForm ? '✕ Close' : '+ Add Admin Details'}
        </button>
      </div>
      
      {showAdminDetailsForm && (
        <div className="admin-details-form">
          <h3>Add Admin Profile Details (Anonymous)</h3>
          <p className="form-note">Note: All data is anonymously stored and used only for educational purposes.</p>
          
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              placeholder="e.g., Computer Science, Engineering"
              value={adminDetails.department}
              onChange={handleAdminDetailsChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role/Position</label>
            <input
              type="text"
              id="role"
              name="role"
              placeholder="e.g., Admin, Coordinator, Manager"
              value={adminDetails.role}
              onChange={handleAdminDetailsChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience">Years of Experience</label>
            <input
              type="number"
              id="experience"
              name="experience"
              placeholder="e.g., 5"
              min="0"
              value={adminDetails.experience}
              onChange={handleAdminDetailsChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="expertise">Area of Expertise</label>
            <input
              type="text"
              id="expertise"
              name="expertise"
              placeholder="e.g., Data Science, Web Development"
              value={adminDetails.expertise}
              onChange={handleAdminDetailsChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">About (Bio)</label>
            <textarea
              id="bio"
              name="bio"
              placeholder="Write a brief bio about yourself..."
              rows="4"
              value={adminDetails.bio}
              onChange={handleAdminDetailsChange}
            ></textarea>
          </div>

          <div className="form-actions">
            <button className="btn-save" onClick={handleSaveAdminDetails}>Save Details</button>
            <button className="btn-cancel" onClick={() => setShowAdminDetailsForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{totalSubjects}</h3>
            <p>Registered Subjects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{totalForms}</h3>
            <p>Feedback Forms Created</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{attemptedForms}</h3>
            <p>Forms Attempted</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{unattemptedForms}</h3>
            <p>Forms Not Attempted</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💡</div>
          <div className="stat-content">
            <h3>{suggestions.length}</h3>
            <p>Suggestions Received</p>
          </div>
        </div>
      </div>

      <div className="analysis-section">
        <h3>Forms by Subject</h3>
        {Object.keys(formsBySubject).length > 0 ? (
          <div className="subject-breakdown">
            {Object.entries(formsBySubject).map(([subject, count]) => (
              <div className="breakdown-item" key={subject}>
                <div className="breakdown-label">{subject}</div>
                <div className="breakdown-bar">
                  <div className="bar-fill" style={{width: `${(count / totalForms) * 100}%`}}></div>
                </div>
                <div className="breakdown-value">{count} form{count !== 1 ? 's' : ''}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No data available. Create some feedback forms to see analytics here.</p>
        )}
      </div>

      <div className="analysis-section">
        <h3>Form Results</h3>
        {createdForms.length === 0 ? (
          <p className="empty-state">No forms created yet. Add a feedback form to start collecting responses.</p>
        ) : (
          <div className="subject-breakdown">
            {createdForms.map(form => {
              const responses = getResponses(form.id)
              const responseCount = responses.length
              const hasMultipleQuestions = form.questions && form.questions.length > 0

              const renderChart = () => {
                // Handle new multi-question format
                if (hasMultipleQuestions) {
                  return (
                    <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                      {form.questions.map(question => {
                        const questionResponses = responses.filter(r => r.question === question.text)
                        if (questionResponses.length === 0 && responses.length === 0) return null

                        if (question.type === 'rating') {
                          const counts = buildRatingData(form, question.id)
                          const max = Math.max(...counts, 1)
                          return (
                            <div key={question.id}>
                              <p style={{margin: '0 0 8px 0', fontSize: 12, opacity: 0.85}}><strong>{question.text}</strong></p>
                              <div className="subject-breakdown">
                                {counts.map((count, index) => {
                                  const label = `${index + 1}`
                                  const width = Math.round((count / max) * 100)
                                  return (
                                    <div className="breakdown-item" key={label}>
                                      <div className="breakdown-label">{label}</div>
                                      <div className="breakdown-bar">
                                        <div className="bar-fill" style={{ width: `${width}%` }}></div>
                                      </div>
                                      <div className="breakdown-value">{count}</div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        }

                        if (question.type === 'mcq') {
                          const counts = buildOptionData(form, question.id)
                          const max = Math.max(...Object.values(counts), 1)
                          return (
                            <div key={question.id}>
                              <p style={{margin: '0 0 8px 0', fontSize: 12, opacity: 0.85}}><strong>{question.text}</strong></p>
                              <div className="subject-breakdown">
                                {Object.entries(counts).map(([label, count]) => {
                                  const width = Math.round((count / max) * 100)
                                  return (
                                    <div className="breakdown-item" key={label}>
                                      <div className="breakdown-label">{label}</div>
                                      <div className="breakdown-bar">
                                        <div className="bar-fill" style={{ width: `${width}%` }}></div>
                                      </div>
                                      <div className="breakdown-value">{count}</div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        }

                        if (question.type === 'yesno') {
                          const yes = questionResponses.filter(r => String(r.value).toLowerCase() === 'yes').length
                          const no = questionResponses.filter(r => String(r.value).toLowerCase() === 'no').length
                          const max = Math.max(yes, no, 1)
                          return (
                            <div key={question.id}>
                              <p style={{margin: '0 0 8px 0', fontSize: 12, opacity: 0.85}}><strong>{question.text}</strong></p>
                              <div className="subject-breakdown">
                                {[['Yes', yes], ['No', no]].map(([label, count]) => {
                                  const width = Math.round((count / max) * 100)
                                  return (
                                    <div className="breakdown-item" key={label}>
                                      <div className="breakdown-label">{label}</div>
                                      <div className="breakdown-bar">
                                        <div className="bar-fill" style={{ width: `${width}%` }}></div>
                                      </div>
                                      <div className="breakdown-value">{count}</div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        }

                        if (question.type === 'text') {
                          return (
                            <div key={question.id}>
                              <p style={{margin: '0 0 8px 0', fontSize: 12, opacity: 0.85}}><strong>{question.text}</strong></p>
                              <div className="forms-grid">
                                {questionResponses.map(r => (
                                  <div key={r.id} className="form-item">
                                    <div className="form-icon">✏️</div>
                                    <p className="form-desc">{r.value}</p>
                                    <p className="form-meta" style={{fontSize:12, opacity:0.7}}>{new Date(r.submittedAt).toLocaleString()}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        }

                        return null
                      })}
                    </div>
                  )
                }

                // Handle old single-question format
                if (form.type === 'rating') {
                  const counts = buildRatingData(form)
                  const max = Math.max(...counts, 1)
                  return (
                    <div className="subject-breakdown">
                      {counts.map((count, index) => {
                        const label = `${index + 1}`
                        const width = Math.round((count / max) * 100)
                        return (
                          <div className="breakdown-item" key={label}>
                            <div className="breakdown-label">{label}</div>
                            <div className="breakdown-bar">
                              <div className="bar-fill" style={{ width: `${width}%` }}></div>
                            </div>
                            <div className="breakdown-value">{count}</div>
                          </div>
                        )
                      })}
                    </div>
                  )
                }

                if (form.type === 'mcq') {
                  const counts = buildOptionData(form)
                  const max = Math.max(...Object.values(counts), 1)
                  return (
                    <div className="subject-breakdown">
                      {Object.entries(counts).map(([label, count]) => {
                        const width = Math.round((count / max) * 100)
                        return (
                          <div className="breakdown-item" key={label}>
                            <div className="breakdown-label">{label}</div>
                            <div className="breakdown-bar">
                              <div className="bar-fill" style={{ width: `${width}%` }}></div>
                            </div>
                            <div className="breakdown-value">{count}</div>
                          </div>
                        )
                      })}
                    </div>
                  )
                }

                if (form.type === 'yesno') {
                  const yes = responses.filter(r => String(r.value).toLowerCase() === 'yes').length
                  const no = responses.filter(r => String(r.value).toLowerCase() === 'no').length
                  const max = Math.max(yes, no, 1)
                  return (
                    <div className="subject-breakdown">
                      {[['Yes', yes], ['No', no]].map(([label, count]) => {
                        const width = Math.round((count / max) * 100)
                        return (
                          <div className="breakdown-item" key={label}>
                            <div className="breakdown-label">{label}</div>
                            <div className="breakdown-bar">
                              <div className="bar-fill" style={{ width: `${width}%` }}></div>
                            </div>
                            <div className="breakdown-value">{count}</div>
                          </div>
                        )
                      })}
                    </div>
                  )
                }

                if (form.type === 'text') {
                  return (
                    <div className="forms-grid">
                      {responses.map(r => (
                        <div key={r.id} className="form-item">
                          <div className="form-icon">✏️</div>
                          <p className="form-desc">{r.value}</p>
                          <p className="form-meta" style={{fontSize:12, opacity:0.7}}>{new Date(r.submittedAt).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  )
                }

                return <p className="empty-state">No visualization available for this form type.</p>
              }

              return (
                <div className="breakdown-item" key={form.id} style={{flexDirection:'column', alignItems:'flex-start'}}>
                  <div style={{width:'100%'}}>
                    <div className="breakdown-label" style={{fontWeight:'600'}}>{form.title}</div>
                    {hasMultipleQuestions ? (
                      <div style={{color:'rgba(255,255,255,0.7)', margin:'4px 0 8px'}}>
                        Questions: {form.questions.length}
                      </div>
                    ) : (
                      <div style={{color:'rgba(255,255,255,0.7)', margin:'4px 0 8px'}}>{form.question}</div>
                    )}
                    <div style={{color:'rgba(255,255,255,0.7)', marginBottom:'8px'}}>Responses: {responseCount}</div>
                    {responseCount === 0 ? (
                      <p className="empty-state">No responses yet.</p>
                    ) : (
                      renderChart()
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="analysis-section">
        <h3>Submission Details</h3>
        {submissions.length === 0 ? (
          <p className="empty-state">No submissions yet.</p>
        ) : (
          <div>
            <div style={{marginBottom: 16}}>
              <p style={{margin: '0 0 12px 0', color: 'rgba(255,255,255,0.85)'}}>
                <strong>Total Submissions:</strong> {submissions.length}
              </p>
            </div>
            <div className="forms-grid">
              {submissions.map(sub => {
                const form = createdForms.find(f => f.id === sub.formId)
                return (
                  <div key={sub.id} className="form-item">
                    <div className="form-icon">📝</div>
                    <h4 style={{margin: '8px 0 4px'}}>{form?.title || 'Form'}</h4>
                    <p className="form-meta">
                      <strong>Question:</strong> {sub.question}
                    </p>
                    <p className="form-meta">
                      <strong>Response:</strong> {sub.value}
                    </p>
                    {sub.studentName && (
                      <p className="form-meta">
                        <strong>Student:</strong> {sub.studentName} {sub.studentId && `(${sub.studentId})`}
                      </p>
                    )}
                    <p className="form-meta" style={{fontSize: 11, opacity: 0.7}}>
                      {new Date(sub.submittedAt).toLocaleString()}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="analysis-section">
        <h3>Suggestions</h3>
        {suggestions.length === 0 ? (
          <p className="empty-state">No suggestions have been submitted yet.</p>
        ) : (
          <div className="forms-grid">
            {suggestions.map(suggestion => (
              <button
                key={suggestion.id}
                type="button"
                className="form-item"
                onClick={() => setSelectedSuggestion(suggestion)}
                style={{textAlign: 'left', cursor: 'pointer'}}
              >
                <div className="form-icon">💡</div>
                <h4 style={{margin: '8px 0 4px'}}>{suggestion.studentName || 'Student Suggestion'}</h4>
                <p className="form-meta" style={{marginBottom: 6}}>{suggestion.text?.slice(0, 80) || 'No message provided...'}</p>
                <p className="form-meta" style={{fontSize: 11, opacity: 0.7}}>
                  {new Date(suggestion.createdAt || suggestion.submittedAt || Date.now()).toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        )}

        {selectedSuggestion && (
          <div className="suggestion-detail" style={{marginTop: 16, padding: 18, borderRadius: 12, background: 'rgba(255,255,255,0.06)'}}>
            <h4>Suggestion Detail</h4>
            <p><strong>From:</strong> {selectedSuggestion.studentName || 'Student'} {selectedSuggestion.studentId ? `(${selectedSuggestion.studentId})` : ''}</p>
            <p><strong>Subject:</strong> {selectedSuggestion.section?.subjectId || selectedSuggestion.subjectId || 'N/A'}</p>
            <p><strong>Section:</strong> {selectedSuggestion.section?.id || selectedSuggestion.sectionId || 'N/A'}</p>
            <p style={{marginTop: 12, whiteSpace: 'pre-wrap'}}>{selectedSuggestion.text}</p>
            <button className="btn" type="button" onClick={() => setSelectedSuggestion(null)} style={{marginTop: 12}}>
              Close
            </button>
          </div>
        )}
      </div>

      <div className="analysis-section">
        <h3>Summary</h3>
        <div className="summary-card">
          <p><strong>Active Subjects:</strong> {totalSubjects}</p>
          <p><strong>Total Forms:</strong> {totalForms}</p>
          <p><strong>Average Forms per Subject:</strong> {totalSubjects > 0 ? (totalForms / totalSubjects).toFixed(2) : 0}</p>
        </div>
      </div>
    </div>
  )
}
