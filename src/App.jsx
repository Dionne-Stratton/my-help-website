import { useEffect, useRef, useState } from "react";
import { Link, Navigate, NavLink, Route, Routes, useLocation } from "react-router-dom";
import CrisisHelpBadge from "./components/CrisisHelpBadge";
import HelpFlow from "./features/help/HelpFlow";
import AboutPage from "./components/AboutPage";
import DonatePage from "./components/DonatePage";
import ContactPage from "./components/ContactPage";
import MyStoryPage from "./components/MyStoryPage";
import logo from "./assets/logo.png";
import "./App.css";

function App() {
  const [showCrisisHelpBadge, setShowCrisisHelpBadge] = useState(true);
  const { pathname } = useLocation();
  const pagePath = pathname.toLowerCase().replace(/\/+$/, "") || "/";
  const page = { "/": "help", "/about": "about", "/my-story": "story", "/donate": "donate", "/contact": "contact" }[pagePath] || "help";
  const contentRef = useRef(null);

  useEffect(() => {
    contentRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.title = page === "story" ? "My Story | My Help" : page === "contact" ? "Contact My Help" : page === "donate" ? "Support My Help" : page === "about" ? "About My Help" : "My Help";
  }, [page]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#page-content">Skip to content</a>
      <nav className="side-nav" aria-label="Main navigation">
        <Link to="/" className="side-nav-brand" aria-label="My Help home" title="My Help home">
          <img src={logo} alt="My Help" />
        </Link>
        <div className="side-nav-links">
        <NavLink to="/" end className="side-nav-link" aria-label="Find Help" title="Find Help" aria-current={page === "help" ? "page" : undefined}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
          </svg>
          <span>Find Help</span>
        </NavLink>
        <NavLink to="/about" className="side-nav-link" aria-label="About My Help" title="About My Help" aria-current={page === "about" ? "page" : undefined}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10v1" />
          </svg>
          <span>About</span>
        </NavLink>
        <NavLink to="/my-story" className="side-nav-link" aria-label="My Story" title="My Story" aria-current={page === "story" ? "page" : undefined}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15" />
          </svg>
          <span>My Story</span>
        </NavLink>
        <NavLink to="/donate" className="side-nav-link" aria-label="Donate to support My Help" title="Donate" aria-current={page === "donate" ? "page" : undefined}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
          </svg>
          <span>Donate</span>
        </NavLink>
        <NavLink to="/contact" className="side-nav-link" aria-label="Contact My Help" title="Contact" aria-current={page === "contact" ? "page" : undefined}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" />
          </svg>
          <span>Contact</span>
        </NavLink>
        </div>
      </nav>
      {showCrisisHelpBadge && (
        <CrisisHelpBadge onClose={() => setShowCrisisHelpBadge(false)} />
      )}
      <div id="page-content" className="page-content" ref={contentRef} tabIndex={-1}>
        {/* Keep the request and bundle mounted when visitors browse the other pages. */}
        <div hidden={page !== "help"}><HelpFlow /></div>
        <Routes>
          <Route path="/" element={null} />
          <Route path="/about" element={<AboutPage onShowCrisisHelp={() => setShowCrisisHelpBadge(true)} />} />
          <Route path="/my-story" element={<MyStoryPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/contact" element={null} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <div hidden={page !== "contact"}><ContactPage /></div>
      </div>
    </div>
  );
}

export default App;
