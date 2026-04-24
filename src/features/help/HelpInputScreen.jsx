import logo from "../../assets/logo.png";

export default function HelpInputScreen({ input, setInput, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        textAlign: "center",
        padding: "20px",
        color: "#e8ebef",
      }}
    >
      <img
        src={logo}
        alt="My Help"
        style={{
          height: "150px",
          objectFit: "contain",
          opacity: 0.9,
        }}
      />

      <h1 style={{ margin: 0 }}>What are you going through right now?</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell me what feels heavy..."
          rows={3}
          style={{
            padding: "12px",
            resize: "none",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text-main)",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px",
            borderRadius: "999px",
            border: "1px solid var(--border)",
            background: "var(--accent-soft)",
            color: "var(--text-main)",
          }}
        >
          Find help
        </button>
      </form>
    </main>
  );
}
