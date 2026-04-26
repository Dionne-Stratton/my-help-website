export default function CrisisHelpBadge({ onClose }) {
  return (
    <aside style={styles.badge} aria-label="Crisis support information">
      {/* ❌ Close button */}
      <button onClick={onClose} style={styles.closeButton} aria-label="Close">
        ×
      </button>

      <p style={styles.label}>In crisis?</p>

      <a href="tel:988" style={styles.link}>
        Call or text 988
      </a>
    </aside>
  );
}

const styles = {
  badge: {
    position: "fixed",
    top: "16px",
    right: "16px",
    zIndex: 50,
    padding: "12px 16px 10px",
    borderRadius: "16px",
    border: "1px solid rgba(175, 229, 249, 0.28)",
    background: "rgba(20, 44, 57, 0.82)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 0 0 rgba(175, 229, 249, 0)",
    animation: "crisisBadgeGlow 1400ms ease-out 600ms 1",
    textAlign: "right",
  },

  /* ❌ Close button (top-left inside badge) */
  closeButton: {
    position: "absolute",
    top: "6px",
    left: "8px",
    border: "none",
    background: "transparent",
    color: "var(--text-muted)",
    fontSize: "1rem",
    cursor: "pointer",
    lineHeight: 1,
    padding: 0,
  },

  label: {
    margin: "0 0 2px",
    fontSize: "0.9rem",
    color: "var(--text-muted)",
  },

  link: {
    color: "var(--accent)",
    fontSize: "0.9rem",
    fontWeight: 700,
    textDecoration: "none",
  },
};
