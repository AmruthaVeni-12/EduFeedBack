import './Footer.css'

export default function Footer(){
  return (
    <footer className="site-footer banner-footer">
      <div className="footer-banner">
        <div className="banner-left">
          <div className="banner-left-inner">
              <div className="banner-small">EduFeedback</div>
              <h3 className="banner-title">Modern student feedback</h3>
              <div className="banner-sub">Collect, analyze and improve learning outcomes</div>
            </div>
        </div>

        <div className="banner-layers">
          <div className="layer layer-3" />
          <div className="layer layer-2" />
          <div className="layer layer-1" />
        </div>

        <div className="banner-right">
          <h4 className="right-title">Insights that matter</h4>
          <p className="right-text">Use simple tools to gather student feedback, visualize responses, and act on insights to improve teaching and learning.</p>
        </div>
      </div>

      <div className="footer-bottom">© {new Date().getFullYear()} EduFeedback</div>
    </footer>
  )
}
