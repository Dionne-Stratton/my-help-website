import { useEffect, useRef, useState } from "react";
import CrisisHelpBadge from "./components/CrisisHelpBadge";
import HelpFlow from "./features/help/HelpFlow";
import AboutPage from "./components/AboutPage";
import DonatePage from "./components/DonatePage";
import "./App.css";

function currentPage() {
  const hash = window.location.hash;
  if (hash === "#donate") return "donate";
  return hash === "#about" ? "about" : "help";
}

function App() {
  const [showCrisisHelpBadge, setShowCrisisHelpBadge] = useState(true);
  const [page, setPage] = useState(currentPage);
  const contentRef = useRef(null);

  useEffect(() => {
    function handleNavigation() {
      if (window.location.hash !== "#page-content") setPage(currentPage());
      contentRef.current?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
    window.addEventListener("hashchange", handleNavigation);
    return () => window.removeEventListener("hashchange", handleNavigation);
  }, []);

  useEffect(() => {
    document.title = page === "donate" ? "Support My Help" : page === "about" ? "About My Help" : "My Help";
  }, [page]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#page-content">Skip to content</a>
      <nav className="side-nav" aria-label="Main navigation">
        <a href="#help" className="side-nav-link" aria-label="Find Help" title="Find Help" aria-current={page === "help" ? "page" : undefined}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
          </svg>
          <span>Find Help</span>
        </a>
        <a href="#about" className="side-nav-link" aria-label="About My Help" title="About My Help" aria-current={page === "about" ? "page" : undefined}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10v1" />
          </svg>
          <span>About</span>
        </a>
        <a href="#donate" className="side-nav-link" aria-label="Donate to support My Help" title="Donate" aria-current={page === "donate" ? "page" : undefined}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
          </svg>
          <span>Donate</span>
        </a>
      </nav>
      {showCrisisHelpBadge && (
        <CrisisHelpBadge onClose={() => setShowCrisisHelpBadge(false)} />
      )}
      <div id="page-content" className="page-content" ref={contentRef} tabIndex={-1}>
        {/* Keep the request and bundle mounted when visitors read About or Donate. */}
        <div hidden={page !== "help"}><HelpFlow /></div>
        {page === "about" && <AboutPage onShowCrisisHelp={() => setShowCrisisHelpBadge(true)} />}
        {page === "donate" && <DonatePage />}
      </div>
    </div>
  );
}

export default App;
