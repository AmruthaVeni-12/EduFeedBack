import { useState, useEffect } from 'react'
import './Login.css'
import { authAPI } from './api.js'

export default function Login({ mode = 'signin', onLogin = () => {}, setMode = () => {}, subjects = [], sections = [] }) {
  const [role, setRole] = useState('student')
  const [fullName, setFullName] = useState('')
  const [collegeId, setCollegeId] = useState('')
  const [password, setPassword] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [authMode, setAuthMode] = useState(mode)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { setAuthMode(mode) }, [mode])

  // Reset enrollment selections when switching between admin/student or signin/signup modes
  useEffect(() => {
    setSelectedSubject('')
    setSelectedSection('')
    setError('')
  }, [role, authMode])

  const availableSections = sections.filter(s => String(s.subjectId) === String(selectedSubject))

  async function submit(e) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      let userData;

      if (authMode === 'signup') {
        // Registration
        if (role === 'admin') {
          userData = await authAPI.register({
            username: collegeId,
            email: `${collegeId}@admin.com`,
            password: password
          })
        } else {
          // For students, we might need to create them differently
          // This depends on your backend API design
          userData = {
            username: collegeId,
            email: `${collegeId}@student.com`,
            password: password,
            role: 'student',
            subjectId: selectedSubject,
            sectionId: selectedSection
          }
        }
      } else {
        // Login
        userData = await authAPI.login({
          username: collegeId,
          password: password
        })
      }

      // Add role and enrollment info to user data
      const completeUserData = {
        ...userData,
        role,
        fullName,
        subjectId: selectedSubject,
        sectionId: selectedSection
      }

      onLogin(completeUserData)
    } catch (error) {
      console.error('Authentication error:', error)
      setError(error.message || 'Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
          <div className="brand">
            <div className="brand-icon" aria-hidden>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#g)" />
                <path d="M4 9l8-4 8 4-8 4-8-4z" fill="#fff" opacity="0.95" />
                <path d="M12 13v4" stroke="#fff" strokeWidth="0.9" strokeLinecap="round" />
                <defs>
                  <linearGradient id="g" x1="0" x2="1">
                    <stop offset="0" stopColor="#9333EA" />
                    <stop offset="1" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="brand-title">EduFeedback</h1>
            <p className="brand-sub">Modern feedback platform for educational excellence</p>
          </div>
        </div>

        <div className="segmented" role="tablist" style={{marginTop:12}}>
          <button className={role === 'student' ? 'seg-btn active' : 'seg-btn'} onClick={() => setRole('student')}>Student</button>
          <button className={role === 'admin' ? 'seg-btn active' : 'seg-btn'} onClick={() => setRole('admin')}>Admin</button>
        </div>

        <form className="login-form" onSubmit={submit}>
          <label className="field">
            <div className="label">Full Name</div>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your name" />
          </label>

          <label className="field">
            <div className="label">{role === 'student' ? 'Student ID' : 'Faculty ID'}</div>
            <input value={collegeId} onChange={(e) => setCollegeId(e.target.value)} placeholder={role === 'student' ? 'e.g., STU001' : 'e.g., FAC001'} />
          </label>
          {role === 'student' && authMode === 'signup' && (
            <>
              <label className="field">
                <div className="label">Select Subject</div>
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                  <option value="">Choose a subject</option>
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </label>

              <label className="field">
                <div className="label">Select Section</div>
                <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} disabled={!selectedSubject}>
                  <option value="">Choose a section</option>
                  {availableSections.map(sec => (
                    <option key={sec.id} value={sec.id}>{sec.sectionName}</option>
                  ))}
                </select>
              </label>
            </>
          )}
          <label className="field">
            <div className="label">Password</div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
          </label>

          {error && (
            <div className="error-message" style={{
              color: '#dc3545',
              fontSize: '14px',
              marginBottom: '12px',
              padding: '8px',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}

          <button className="btn primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Please wait...' : (authMode === 'signup' ? 'Sign Up' : 'Sign In')}
          </button>
          <button className="btn ghost" type="button" onClick={() => { 
            if (role === 'admin') {
              setFullName('Demo Faculty'); 
              setCollegeId('FAC001'); 
              setPassword('demo123');
            } else {
              setFullName('Demo Student'); 
              setCollegeId('STU001'); 
              setPassword('demo123');
              if (authMode === 'signup') {
                if (subjects.length > 0) {
                  setSelectedSubject(subjects[0].id)
                  const matchingSection = sections.find(s => String(s.subjectId) === String(subjects[0].id))
                  setSelectedSection(matchingSection?.id || '')
                }
              }
            }
          }}>
            {authMode === 'signup' ? 'Use Demo' : `Demo ${role === 'admin' ? 'Faculty' : 'Student'} Login`}
          </button>
        </form>
      </div>
    </div>
  )
}
