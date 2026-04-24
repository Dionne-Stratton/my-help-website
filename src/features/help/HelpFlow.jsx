import { useState } from "react";
import { submitHelpRequest } from "../../api/helpApi";

import HelpInputScreen from "./HelpInputScreen";
import GentleLoading from "./GentleLoading";
import HelpBundleView from "./HelpBundleView";

function generateSessionId() {
  return crypto.randomUUID();
}

export default function HelpFlow() {
  const [status, setStatus] = useState("idle"); // idle | loading | loading-exit | results | results-exit | error
  const [input, setInput] = useState("");
  const [bundle, setBundle] = useState(null);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(generateSessionId());

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setStatus("loading");
    setError(null);

    try {
      const minimumLoadingTime = new Promise((resolve) =>
        setTimeout(resolve, 1200),
      );

      const [data] = await Promise.all([
        submitHelpRequest({ input, sessionId }),
        minimumLoadingTime,
      ]);

      setBundle(data.bundle);
      setStatus("loading-exit");

      setTimeout(() => {
        setStatus("results");
      }, 500);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setStatus("error");
    }
  };

  const handleStartOver = () => {
    setStatus("results-exit");

    setTimeout(() => {
      setInput("");
      setBundle(null);
      setError(null);
      setSessionId(generateSessionId());
      setStatus("idle");
    }, 500);
  };

  if (status === "idle") {
    return (
      <HelpInputScreen
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
      />
    );
  }

  if (status === "loading" || status === "loading-exit") {
    return <GentleLoading isExiting={status === "loading-exit"} />;
  }

  if (status === "results" || status === "results-exit") {
    return (
      <HelpBundleView
        bundle={bundle}
        onStartOver={handleStartOver}
        isExiting={status === "results-exit"}
      />
    );
  }

  if (status === "error") {
    return (
      <div style={{ padding: 24 }}>
        <p>{error}</p>
        <button onClick={handleStartOver}>Start over</button>
      </div>
    );
  }

  return null;
}
