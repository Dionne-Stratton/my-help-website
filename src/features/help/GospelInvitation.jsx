import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { getGospelVariant } from "./gospelVariants";

export default function GospelInvitation({ bundle }) {
  const [isOpen, setIsOpen] = useState(false);

  const variant = useMemo(() => getGospelVariant(bundle), [bundle]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <section style={styles.invitation}>
        <p style={styles.kicker}>{variant.kicker}</p>
        <button style={styles.openButton} onClick={() => setIsOpen(true)}>
          {variant.buttonText}
        </button>
      </section>

      {isOpen &&
        createPortal(
          <div style={styles.backdrop} onClick={() => setIsOpen(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button
                style={styles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                ×
              </button>

              <p style={styles.modalLabel}>The Gospel</p>

              <h2 style={styles.modalTitle}>{variant.title}</h2>

              <p style={styles.modalText}>{variant.intro}</p>

              <p style={styles.modalText}>
                Jesus Christ, the Son of God, came to rescue us. He lived
                without sin, died on the cross for our sins, and rose again so
                that all who trust in Him can be forgiven, made new, and brought
                near to God forever.
              </p>

              <p style={styles.modalText}>
                If you want to come to Him, you can turn from sin, trust Jesus,
                and call on Him. He is merciful, faithful, and near to all who
                seek Him.
              </p>

              <p style={styles.prayer}>
                “Lord Jesus, I need You. I believe You died for my sins and rose
                again. Forgive me, make me new, and draw me near to God. I give
                myself to You. Amen.”
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

const styles = {
  invitation: {
    marginTop: "28px",
    padding: "24px",
    borderRadius: "22px",
    border: "1px solid rgba(175, 229, 249, 0.22)",
    background: "rgba(175, 229, 249, 0.08)",
    textAlign: "center",
  },
  kicker: {
    margin: "0 0 12px",
    color: "var(--text-soft)",
    fontSize: "0.95rem",
  },
  openButton: {
    border: "1px solid rgba(175, 229, 249, 0.35)",
    borderRadius: "999px",
    padding: "10px 18px",
    background: "rgba(175, 229, 249, 0.14)",
    color: "var(--text-main)",
    cursor: "pointer",
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "56px 20px",
    background: "rgba(0, 0, 0, 0.55)",
    backdropFilter: "blur(8px)",
    overflowY: "auto",
    animation: "modalFadeIn 180ms ease-out both",
  },
  modal: {
    position: "relative",
    width: "100%",
    maxWidth: "680px",
    padding: "30px",
    borderRadius: "24px",
    border: "1px solid var(--border)",
    background: "linear-gradient(180deg, var(--surface-soft), var(--surface))",
    boxShadow: "0 24px 80px rgba(0, 0, 0, 0.35)",
    animation: "modalResolveIn 220ms ease-out both",
  },
  closeButton: {
    position: "absolute",
    top: "14px",
    right: "16px",
    border: "none",
    background: "transparent",
    color: "var(--text-muted)",
    fontSize: "1.8rem",
    cursor: "pointer",
  },
  modalLabel: {
    margin: "0 0 12px",
    color: "var(--accent)",
    fontSize: "0.78rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontWeight: 700,
  },
  modalTitle: {
    margin: "0 0 18px",
    fontSize: "1.8rem",
    lineHeight: 1.15,
  },
  modalText: {
    color: "var(--text-soft)",
    lineHeight: 1.75,
  },
  prayer: {
    marginTop: "20px",
    padding: "18px",
    borderRadius: "18px",
    background: "rgba(255, 255, 255, 0.06)",
    color: "var(--text-main)",
    lineHeight: 1.7,
    fontStyle: "italic",
  },
};
