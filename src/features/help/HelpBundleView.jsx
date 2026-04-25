import SongResourceCard from "./SongResourceCard";
import GospelInvitation from "./GospelInvitation";
import logo from "../../assets/logo.png";

export default function HelpBundleView({
  bundle,
  onStartOver,
  isExiting = false,
}) {
  const scriptures = bundle?.scripture || [];
  const reflection = bundle?.reflection?.[0];
  const prayer = bundle?.prayer?.[0];
  const song = bundle?.song?.[0];

  return (
    <main
      style={{
        ...styles.page,
        animation: isExiting
          ? "pageSlideDissolveOut 500ms ease-in both"
          : "pageSlideResolveIn 600ms ease-out both",
      }}
    >
      <div style={styles.container}>
        <div style={styles.logoWrapper}>
          <img src={logo} alt="My Help" style={styles.logo} />
        </div>

        <header style={styles.header}>
          <h1 style={styles.heading}>Your help for this moment</h1>
        </header>

        <section style={styles.card}>
          <p style={styles.sectionLabel}>Scripture</p>

          {scriptures.map((verse) => (
            <article key={verse.id} style={styles.resourceBlock}>
              <h2 style={styles.resourceTitle}>{verse.title}</h2>
              <p style={styles.bodyText}>{verse.body_text}</p>
            </article>
          ))}
        </section>

        {reflection && (
          <section style={styles.card}>
            <p style={styles.sectionLabel}>Reflection</p>
            <article>
              <h2 style={styles.resourceTitle}>{reflection.title}</h2>

              {reflection.scripture_reference && (
                <p style={styles.reference}>
                  Based on {reflection.scripture_reference}
                </p>
              )}

              <p style={styles.bodyText}>{reflection.body_text}</p>
            </article>
          </section>
        )}

        {prayer && (
          <section style={styles.card}>
            <p style={styles.sectionLabel}>Prayer</p>
            <article>
              <h2 style={styles.resourceTitle}>{prayer.title}</h2>
              <p style={styles.bodyText}>{prayer.body_text}</p>
            </article>
          </section>
        )}

        {song && (
          <section style={styles.card}>
            <p style={styles.sectionLabel}>Song</p>
            <SongResourceCard song={song} />
          </section>
        )}

        <GospelInvitation bundle={bundle} />

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onStartOver}>
            Create a new moment
          </button>
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "48px 20px",
    background: "var(--bg)",
    color: "var(--text-main)",
  },
  container: {
    maxWidth: "720px",
    margin: "0 auto",
  },

  logoWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "18px",
  },

  logo: {
    height: "64px",
    objectFit: "contain",
    opacity: 0.85,
  },

  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  heading: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    lineHeight: 1.1,
    margin: 0,
    fontWeight: 600,
    letterSpacing: "-0.03em",
  },
  card: {
    marginBottom: "20px",
    padding: "24px",
    borderRadius: "22px",
    border: "1px solid var(--border)",
    background: "linear-gradient(180deg, var(--surface-soft), var(--surface))",
    boxShadow: "0 18px 45px rgba(0, 0, 0, 0.18)",
  },
  sectionLabel: {
    margin: "0 0 18px",
    fontSize: "0.78rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--accent)",
    fontWeight: 700,
  },
  resourceBlock: {
    marginBottom: "24px",
  },
  resourceTitle: {
    margin: "0 0 10px",
    fontSize: "1.25rem",
    lineHeight: 1.25,
    fontWeight: 600,
    color: "var(--text-main)",
  },
  bodyText: {
    margin: 0,
    fontSize: "1rem",
    lineHeight: 1.75,
    color: "var(--text-soft)",
    textAlign: "left",
  },
  reference: {
    margin: "0 0 14px",
    fontSize: "0.95rem",
    color: "var(--text-muted)",
    fontStyle: "italic",
  },
  actions: {
    textAlign: "center",
    marginTop: "32px",
  },
  secondaryButton: {
    border: "1px solid var(--border)",
    borderRadius: "999px",
    padding: "10px 18px",
    background: "transparent",
    color: "var(--text-soft)",
  },
};
