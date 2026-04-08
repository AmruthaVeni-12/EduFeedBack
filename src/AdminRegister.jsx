import { useState } from 'react'
import './AdminRegister.css'

export default function AdminRegister({ registeredSubjects, onRegisterSubject }){
  console.log('AdminRegister received subjects:', registeredSubjects)
  const [subjectName, setSubjectName] = useState('')
  const [subjectCode, setSubjectCode] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (subjectName.trim() && subjectCode.trim()) {
      onRegisterSubject({ id: Date.now(), name: subjectName, code: subjectCode })
      setSubjectName('')
      setSubjectCode('')
    }
  }

  return (
    <div className="admin-panel">
      <h2>Register Subject</h2>
      
      <form className="register-form" onSubmit={handleSubmit}>
        <label className="field">
          <div className="label">Subject Name</div>
          <input value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="e.g., Data Structures" required />
        </label>
        
        <label className="field">
          <div className="label">Subject Code</div>
          <input value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} placeholder="e.g., CS101" required />
        </label>
        
        <button className="btn primary" type="submit">Register Subject</button>
      </form>

      <div className="registered-list">
        <h3>Registered Subjects ({registeredSubjects?.length || 0})</h3>
        {registeredSubjects && registeredSubjects.length > 0 ? (
          <div className="subjects-grid">
            {registeredSubjects.map(sub => (
              <div className="subject-item" key={sub.id}>
                <div className="subject-icon">📚</div>
                <h4>{sub.name}</h4>
                <p>{sub.code}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No subjects registered yet. Register one above to get started.</p>
        )}
      </div>
    </div>
  )
}
