import './AdminAnalysis.css'
import { useState } from 'react'

export default function AdminAnalysis({ registeredSubjects, createdForms, submissions = [], suggestions = [] }){
  const [showAdminDetailsForm, setShowAdminDetailsForm] = useState(false)
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

  const buildRatingData = (form) => {
    const max = form.scaleMax || 5
    const counts = Array.from({ length: max }, () => 0)
    const responses = getResponses(form.id)
    responses.forEach(r => {
      const val = parseInt(r.value, 10)
      if (!isNaN(val) && val >= 1 && val <= max) {
        counts[val - 1]++
      }
    })
    return counts
  }

  const buildOptionData = (form) => {
    const options = form.options || []
    const counts = {}
    options.forEach(o => { counts[o] = 0 })
    getResponses(form.id).forEach(r => {
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

              const renderChart = () => {
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
                    <div className="breakdown-label" style={{fontWeight:'600'}}>{form.title} ({form.type || 'rating'})</div>
                    <div style={{color:'rgba(255,255,255,0.7)', margin:'4px 0 8px'}}>{form.question}</div>
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
