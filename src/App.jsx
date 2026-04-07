import { useState, useEffect } from 'react'
import './App.css'
import Header from './Header'
import Footer from './Footer'
import Login from './Login'
import Dashboard from './Dashboard'
import SubjectPage from './SubjectPage'
import { subjectAPI, sectionAPI, studentAPI, feedbackFormAPI, submissionAPI, suggestionAPI } from './api.js'

function App() {
  const [route, setRoute] = useState('login')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginMode, setLoginMode] = useState('signin')
  const [user, setUser] = useState(null)
  const [currentSubject, setCurrentSubject] = useState(null)

  // API-loaded data states
  const [registeredSubjects, setRegisteredSubjects] = useState([])
  const [subjectSections, setSubjectSections] = useState([])
  const [createdForms, setCreatedForms] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [students, setStudents] = useState([])

  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load all data from APIs
  const loadAllData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [subjectsData, sectionsData, formsData, submissionsData, suggestionsData, studentsData] = await Promise.all([
        subjectAPI.getAll(),
        sectionAPI.getAll(),
        feedbackFormAPI.getAll(),
        submissionAPI.getAll(),
        suggestionAPI.getAll(),
        studentAPI.getAll()
      ])

      setRegisteredSubjects(subjectsData)
      setSubjectSections(sectionsData)
      setCreatedForms(formsData)
      setSubmissions(submissionsData)
      setSuggestions(suggestionsData)
      setStudents(studentsData)
    } catch (error) {
      console.error('Failed to load data:', error)
      setError('Failed to load application data. Please refresh the page.')
    } finally {
      setIsLoading(false)
    }
  }

  // Load data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadAllData()
    }
  }, [isAuthenticated, user])

  const handleRegisterSubject = async (subject) => {
    try {
      const newSubject = await subjectAPI.create(subject)
      setRegisteredSubjects(prev => [...prev, newSubject])
    } catch (error) {
      console.error('Failed to create subject:', error)
      alert('Failed to create subject. Please try again.')
    }
  }

  const handleAddSection = async (section) => {
    try {
      const newSection = await sectionAPI.create(section.subjectId, section)
      setSubjectSections(prev => [...prev, newSection])
    } catch (error) {
      console.error('Failed to create section:', error)
      alert('Failed to create section. Please try again.')
    }
  }

  const handleUpdateSection = async (updatedSection) => {
    try {
      const result = await sectionAPI.update(updatedSection.id, updatedSection)
      setSubjectSections(prev => prev.map(s => s.id === updatedSection.id ? result : s))
    } catch (error) {
      console.error('Failed to update section:', error)
      alert('Failed to update section. Please try again.')
    }
  }

  const handleDeleteSection = async (sectionId) => {
    try {
      await sectionAPI.delete(sectionId)
      setSubjectSections(prev => prev.filter(s => s.id !== sectionId))
      setCreatedForms(prev => prev.filter(f => f.sectionId !== sectionId))
      setSubmissions(prev => prev.filter(s => s.sectionId !== sectionId))
    } catch (error) {
      console.error('Failed to delete section:', error)
      alert('Failed to delete section. Please try again.')
    }
  }

  const handleCreateForm = async (form) => {
    try {
      const newForm = await feedbackFormAPI.create(form)
      setCreatedForms(prev => [...prev, newForm])
    } catch (error) {
      console.error('Failed to create form:', error)
      alert('Failed to create feedback form. Please try again.')
    }
  }

  const handleUpdateForm = async (updatedForm) => {
    try {
      const result = await feedbackFormAPI.update(updatedForm.id, updatedForm)
      setCreatedForms(prev => prev.map(f => f.id === updatedForm.id ? result : f))
    } catch (error) {
      console.error('Failed to update form:', error)
      alert('Failed to update feedback form. Please try again.')
    }
  }

  const handleDeleteForm = async (formId) => {
    try {
      await feedbackFormAPI.delete(formId)
      setCreatedForms(prev => prev.filter(f => f.id !== formId))
      setSubmissions(prev => prev.filter(s => s.formId !== formId))
    } catch (error) {
      console.error('Failed to delete form:', error)
      alert('Failed to delete feedback form. Please try again.')
    }
  }

  const handleAddSuggestion = async (suggestion) => {
    try {
      const payload = {
        studentName: suggestion.studentName,
        text: suggestion.message || suggestion.text,
        section: { id: suggestion.sectionId },
      }
      const newSuggestion = await suggestionAPI.create(payload)
      setSuggestions(prev => [...prev, newSuggestion])
    } catch (error) {
      console.error('Failed to create suggestion:', error)
      alert('Failed to submit suggestion. Please try again.')
    }
  }

  const handleSubmitResponse = async (submission) => {
    try {
      const newSubmission = await submissionAPI.create(submission)
      setSubmissions(prev => [...prev, newSubmission])
    } catch (error) {
      console.error('Failed to submit response:', error)
      alert('Failed to submit response. Please try again.')
    }
  }

  const handleEnrollStudent = async ({ subjectId, sectionId }) => {
    try {
      const studentData = {
        studentName: user.fullName,
        email: `${user.username}@student.com`,
        section: { id: sectionId }
      }
      const newStudent = await studentAPI.create(studentData)
      setStudents(prev => [...prev, newStudent])

      setUser(prev => {
        if (!prev) return prev
        return { ...prev, subjectId, sectionId }
      })
    } catch (error) {
      console.error('Failed to enroll student:', error)
      alert('Failed to enroll in subject. Please try again.')
    }
  }

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

  const handleLogin = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    setRoute('dashboard')
  }

  const handleSignOut = () => {
    setUser(null)
    setIsAuthenticated(false)
    setRoute('login')
    // Clear all data when signing out
    setRegisteredSubjects([])
    setSubjectSections([])
    setCreatedForms([])
    setSubmissions([])
    setSuggestions([])
    setStudents([])
  }

  return (
    <div className="app-root">
      <div className="gradient-anim" aria-hidden></div>
      <div className="pattern-overlay" aria-hidden></div>
      <div className="vignette" aria-hidden></div>
      <Header route={route} setRoute={handleNavigate} isAuthenticated={isAuthenticated} setRouteRaw={setRoute} setLoginMode={setLoginMode} onLogout={handleSignOut} />
      <main className="main">
        {route === 'login' && (
          <Login
            mode={loginMode}
            onLogin={handleLogin}
            setMode={setLoginMode}
            subjects={registeredSubjects}
            sections={subjectSections}
          />
        )}

        {route === 'dashboard' && (
          isAuthenticated ? (
            <Dashboard
              setRoute={handleNavigate}
              user={user}
              onSignOut={handleSignOut}
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
            <Login mode="signin" onLogin={handleLogin} setMode={setLoginMode} subjects={registeredSubjects} sections={subjectSections} />
          )
        )}

        {route.startsWith('subject:') && (
          isAuthenticated ? <SubjectPage subject={currentSubject} onBack={() => setRoute('dashboard')} />
            : <Login mode="signin" onLogin={handleLogin} setMode={setLoginMode} subjects={registeredSubjects} sections={subjectSections} />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
