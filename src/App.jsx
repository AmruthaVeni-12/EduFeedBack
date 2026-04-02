import { useState, useEffect } from 'react'
import './App.css'
import Header from './Header'
import Footer from './Footer'
import Login from './Login'
import Dashboard from './Dashboard'
import SubjectPage from './SubjectPage'

// Default seed data so students can enroll even before an admin has registered subjects.
const DEFAULT_SUBJECTS = Array.from({length:10}, (_, i) => ({
  id: i + 1,
  name: `Engineering Subject ${i + 1}`,
  code: `ENG${String(i + 1).padStart(3, '0')}`,
}))

const DEFAULT_SECTIONS = DEFAULT_SUBJECTS.flatMap(subject =>
  Array.from({length: 5}, (_, idx) => ({
    id: `${subject.id}-${idx + 1}`,
    subjectId: subject.id,
    sectionName: `Section ${idx + 1}`,
  }))
)

function App() {
  const [route, setRoute] = useState('login')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginMode, setLoginMode] = useState('signin')
  const [user, setUser] = useState(null)
  const [currentSubject, setCurrentSubject] = useState(null)
  const [adminAccount, setAdminAccount] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('edu_admin'))
    } catch (e) {
      return null
    }
  })
  const [registeredSubjects, setRegisteredSubjects] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('edu_registered_subjects'))
      return stored && Array.isArray(stored) ? stored : DEFAULT_SUBJECTS
    } catch (e) {
      return DEFAULT_SUBJECTS
    }
  })
  const [subjectSections, setSubjectSections] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('edu_subject_sections'))
      return stored && Array.isArray(stored) ? stored : DEFAULT_SECTIONS
    } catch (e) {
      return DEFAULT_SECTIONS
    }
  })
  const [createdForms, setCreatedForms] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('edu_created_forms'))
      return stored && Array.isArray(stored) ? stored : []
    } catch (e) {
      return []
    }
  })
  const [submissions, setSubmissions] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('edu_submissions'))
      return stored && Array.isArray(stored) ? stored : []
    } catch (e) {
      return []
    }
  })
  const [suggestions, setSuggestions] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('edu_suggestions'))
      return stored && Array.isArray(stored) ? stored : []
    } catch (e) {
      return []
    }
  })
  const [students, setStudents] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('edu_students'))
      return stored && Array.isArray(stored) ? stored : []
    } catch (e) {
      return []
    }
  })

  const handleRegisterSubject = (subject) => {
    setRegisteredSubjects(prev => [...prev, subject])
  }

  const handleAddSection = (section) => {
    setSubjectSections(prev => [...prev, section])
  }

  const handleUpdateSection = (updatedSection) => {
    setSubjectSections(prev => prev.map(s => s.id === updatedSection.id ? updatedSection : s))
  }

  const handleDeleteSection = (sectionId) => {
    setSubjectSections(prev => prev.filter(s => s.id !== sectionId))
    setCreatedForms(prev => prev.filter(f => f.sectionId !== sectionId))
    setSubmissions(prev => prev.filter(s => s.sectionId !== sectionId))
  }

  const handleCreateForm = (form) => {
    setCreatedForms(prev => [...prev, form])
  }

  const handleUpdateForm = (updatedForm) => {
    setCreatedForms(prev => prev.map(f => f.id === updatedForm.id ? updatedForm : f))
  }

  const handleDeleteForm = (formId) => {
    setCreatedForms(prev => prev.filter(f => f.id !== formId))
    setSubmissions(prev => prev.filter(s => s.formId !== formId))
  }

  const handleAddSuggestion = (suggestion) => {
    setSuggestions(prev => [...prev, suggestion])
  }

  const handleSubmitResponse = (submission) => {
    setSubmissions(prev => [...prev, submission])
  }

  const handleEnrollStudent = ({ subjectId, sectionId }) => {
    setUser(prev => {
      if (!prev) return prev
      return { ...prev, subjectId, sectionId }
    })

    setStudents(prev => {
      if (!user) return prev
      const updated = prev.map(s => {
        if (s.collegeId === user.collegeId) {
          return { ...s, subjectId, sectionId }
        }
        return s
      })
      if (!updated.some(s => s.collegeId === user?.collegeId)) {
        return [...prev, { ...user, subjectId, sectionId }]
      }
      return updated
    })
  }

  useEffect(() => {
    try { localStorage.setItem('edu_registered_subjects', JSON.stringify(registeredSubjects)) } catch (_) {}
  }, [registeredSubjects])

  useEffect(() => {
    try { localStorage.setItem('edu_subject_sections', JSON.stringify(subjectSections)) } catch (_) {}
  }, [subjectSections])

  useEffect(() => {
    try { localStorage.setItem('edu_created_forms', JSON.stringify(createdForms)) } catch (_) {}
  }, [createdForms])

  useEffect(() => {
    try { localStorage.setItem('edu_submissions', JSON.stringify(submissions)) } catch (_) {}
  }, [submissions])

  useEffect(() => {
    try { localStorage.setItem('edu_suggestions', JSON.stringify(suggestions)) } catch (_) {}
  }, [suggestions])

  useEffect(() => {
    try { localStorage.setItem('edu_students', JSON.stringify(students)) } catch (_) {}
  }, [students])

  function handleNavigate(target, data = null) {
    // allow subject route when authenticated
    if (isAuthenticated && target.startsWith('subject:')) {
      setCurrentSubject(data)
      setRoute(target)
      return
    }
    // after sign-in/sign-up, only dashboard and subject pages are accessible
    if (isAuthenticated && target !== 'dashboard' && target !== 'login' && !target.startsWith('subject:')) {
      // ignore navigation to any route other than dashboard when authenticated
      return
    }
    // protect routes that require auth
    if ((target === 'dashboard' || target.startsWith('subject:')) && !isAuthenticated) {
      setLoginMode('signin')
      setRoute('login')
      return
    }
    setRoute(target)
  }

  return (
    <div className="app-root">
      <div className="gradient-anim" aria-hidden></div>
      <div className="pattern-overlay" aria-hidden></div>
      <div className="vignette" aria-hidden></div>
      <Header route={route} setRoute={handleNavigate} isAuthenticated={isAuthenticated} setRouteRaw={setRoute} setLoginMode={setLoginMode} onLogout={() => { setUser(null); setIsAuthenticated(false); setRoute('login') }} />
      <main className="main">
        {route === 'login' && (
          <Login
            mode={loginMode}
            subjects={registeredSubjects}
            sections={subjectSections}
            onLogin={(data) => {
              if (data.role === 'student') {
                // signup: store enrollment info; signin: validate against stored students
                if (loginMode === 'signup') {
                  if (!data.subjectId || !data.sectionId) {
                    alert('Please select a subject and section to enroll.')
                    return
                  }

                  const existing = students.find(s => s.collegeId === data.collegeId)
                  if (existing) {
                    alert('A student with that ID already exists. Please sign in instead.')
                    return
                  }

                  const student = {
                    role: 'student',
                    fullName: data.fullName,
                    collegeId: data.collegeId,
                    password: data.password,
                    subjectId: data.subjectId,
                    sectionId: data.sectionId,
                  }

                  setStudents(prev => [...prev, student])
                  setUser(student)
                  setIsAuthenticated(true)
                  setRoute('dashboard')
                  return
                }

                const saved = students.find(s => s.collegeId === data.collegeId && s.password === data.password)
                if (!saved) {
                  alert('No student found with those credentials. Please sign up first.')
                  return
                }

                setUser(saved)
                setIsAuthenticated(true)
                setRoute('dashboard')
                return
              }

              // For admin: enforce a single admin account stored in localStorage
              const saved = adminAccount
              if (!saved) {
                // first admin to sign up becomes the single admin
                const acct = { fullName: data.fullName || 'Admin', collegeId: data.collegeId, password: data.password }
                try { localStorage.setItem('edu_admin', JSON.stringify(acct)) } catch (e) {}
                setAdminAccount(acct)
                setUser({ role: 'admin', name: acct.fullName })
                setIsAuthenticated(true)
                setRoute('dashboard')
                return
              }

              // authenticate against stored admin
              if (data.collegeId === saved.collegeId && data.password === saved.password) {
                setUser({ role: 'admin', name: saved.fullName })
                setIsAuthenticated(true)
                setRoute('dashboard')
                return
              }

              alert('Admin credentials do not match the registered admin.')
            }}
            setMode={setLoginMode}
          />
        )}

        {route === 'dashboard' && (
          isAuthenticated ? (
            <Dashboard
              setRoute={handleNavigate}
              user={user}
              onSignOut={() => { setUser(null); setIsAuthenticated(false); setRoute('login') }}
              registeredSubjects={registeredSubjects}
              subjectSections={subjectSections}
              createdForms={createdForms}
              submissions={submissions}
              suggestions={suggestions}
              onRegisterSubject={handleRegisterSubject}
              onCreateForm={handleCreateForm}
              onUpdateForm={handleUpdateForm}
              onDeleteForm={handleDeleteForm}
              onAddSection={handleAddSection}
              onUpdateSection={handleUpdateSection}
              onDeleteSection={handleDeleteSection}
              onAddSuggestion={handleAddSuggestion}
              onSubmitResponse={handleSubmitResponse}
              onEnrollStudent={handleEnrollStudent}
            />
          ) : (
            <Login mode="signin" onLogin={(data) => { setUser(data); setIsAuthenticated(true); setRoute('dashboard') }} setMode={setLoginMode} />
          )
        )}

        {route.startsWith('subject:') && (
          isAuthenticated ? <SubjectPage subject={currentSubject} onBack={() => setRoute('dashboard')} />
            : <Login mode="signin" onLogin={(data) => { setUser(data); setIsAuthenticated(true); setRoute('dashboard') }} setMode={setLoginMode} />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
