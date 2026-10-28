import { useEffect, useRef, useState } from "react";
import CrisisHelpBadge from "./components/CrisisHelpBadge";
import HelpFlow from "./features/help/HelpFlow";
import AboutPage from "./components/AboutPage";
import "./App.css";

function currentPage() {
  return window.location.hash === "#about" ? "about" : "help";
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
    document.title = page === "about" ? "About My Help" : "My Help";
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
      </nav>
      {showCrisisHelpBadge && (
        <CrisisHelpBadge onClose={() => setShowCrisisHelpBadge(false)} />
      )}
      <div id="page-content" className="page-content" ref={contentRef} tabIndex={-1}>
        {/* Keep the request and bundle mounted when visitors read About. */}
        <div hidden={page !== "help"}><HelpFlow /></div>
        {page === "about" && <AboutPage onShowCrisisHelp={() => setShowCrisisHelpBadge(true)} />}
      </div>
    </div>
  );
}

export default App;
