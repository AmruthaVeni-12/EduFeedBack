import './Header.css'

export default function Header({ route, setRoute, isAuthenticated, setRouteRaw, setLoginMode, onLogout }){
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="left">
          <div className="logo" onClick={() => isAuthenticated ? setRoute('dashboard') : (setRouteRaw('login'), setLoginMode('signin'))} style={{cursor:'pointer'}}>
            <span className="logo-badge">🎓</span>
            <span className="logo-text">EduFeedback</span>
          </div>
          {isAuthenticated && (
            <nav className="nav">
              <button className={route==='dashboard'? 'nav-btn active':'nav-btn'} onClick={() => setRoute('dashboard')}>Dashboard</button>
            </nav>
          )}
        </div>
        <div className="actions">
          {!isAuthenticated ? (
            <>
              <button className="btn-ghost" onClick={() => { setRouteRaw('login'); setLoginMode('signin') }}>Sign In</button>
              <button className="btn-primary" onClick={() => { setRouteRaw('login'); setLoginMode('signup') }}>Sign Up</button>
            </>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => { if(onLogout) onLogout(); else { setRouteRaw('login'); setLoginMode('signin') } }}>Sign Out</button>
            </>
          )}
        </div>
      </div>
      {/* header tabs removed per user request */}
    </header>
  )
}
