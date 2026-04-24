import logo from "../../assets/logo.png";

export default function GentleLoading({ isExiting = false }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        textAlign: "center",
        padding: "20px",
        background: "var(--bg)",
        color: "var(--text-main)",
        animation: isExiting
          ? "pageFadeOut 500ms ease-in both"
          : "pageFadeIn 500ms ease-out both",
      }}
    >
      <img
        src={logo}
        alt="My Help"
        style={{
          height: "96px",
          objectFit: "contain",
          opacity: 0.85,
          animation: isExiting
            ? "softDissolve 500ms ease-in both"
            : "softResolve 800ms ease-out both, gentleBreathe 2200ms ease-in-out 800ms infinite",
        }}
      />

      <p
        style={{
          margin: 0,
          fontSize: "clamp(1.75rem, 4vw, 2.6rem)",
          lineHeight: 1.15,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          maxWidth: "720px",
          animation: isExiting
            ? "softDissolve 500ms ease-in both"
            : "softResolve 900ms ease-out 120ms both",
        }}
        aria-live="polite"
      >
        Finding your help for this moment...
      </p>
    </main>
  );
}
