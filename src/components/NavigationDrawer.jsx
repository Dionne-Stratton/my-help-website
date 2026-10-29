import { useEffect, useRef, useState } from "react";

export default function NavigationDrawer({ navigation, children }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [focused, setFocused] = useState(false);
  const toggleRef = useRef(null);
  const navRef = useRef(null);
  const gesture = useRef(null);
  const suppressClickUntil = useRef(0);
  const open = hovered || expanded || focused;

  function close() {
    setHovered(false);
    setExpanded(false);
    setFocused(false);
    if (navRef.current?.contains(document.activeElement)) toggleRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setHovered(false);
        setExpanded(false);
        setFocused(false);
        toggleRef.current?.focus();
      }
    }
    function onOutsidePress(event) {
      if (!event.target.closest(".navigation-panel")) {
        setHovered(false);
        setExpanded(false);
        setFocused(false);
        if (navRef.current?.contains(document.activeElement)) toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onOutsidePress);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onOutsidePress);
    };
  }, [open]);

  function startSwipe(event) {
    if (event.pointerType === "mouse" || event.target.closest("input, textarea, select, [contenteditable]")) return;
    const inPanel = navRef.current?.contains(event.target) || toggleRef.current?.contains(event.target);
    if (!inPanel && event.clientX > 24) return;
    gesture.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
  }

  function endSwipe(event) {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx > 0 && !open) setExpanded(true);
    else if (dx < 0 && open) close();
    else return;
    suppressClickUntil.current = Date.now() + 500;
    event.preventDefault();
  }

  return (
    <div
      className={`app-shell${open ? " nav-is-open" : ""}`}
      onPointerDownCapture={startSwipe}
      onPointerUpCapture={endSwipe}
      onPointerCancelCapture={() => { gesture.current = null; }}
      onClickCapture={(event) => {
        if (event.detail !== 0 && Date.now() < suppressClickUntil.current) {
          event.preventDefault();
          event.stopPropagation();
          suppressClickUntil.current = 0;
        }
      }}
    >
      <a className="skip-link" href="#page-content">Skip to content</a>
      <div
        className="navigation-panel"
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) setHovered(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") setHovered(false);
        }}
      >
        <div className="navigation-edge" aria-hidden="true" />
        <button
          ref={toggleRef}
          type="button"
          className="navigation-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => { if (open) close(); else setExpanded(true); }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            {open ? <path d="m15 5-7 7 7 7" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        <nav
          ref={navRef}
          id="main-navigation"
          className="side-nav"
          aria-label="Main navigation"
          inert={!open}
          aria-hidden={!open}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setFocused(false);
              setExpanded(false);
            }
          }}
          onClick={(event) => { if (event.target.closest("a")) close(); }}
        >
          {navigation}
        </nav>
      </div>
      {children}
    </div>
  );
}
