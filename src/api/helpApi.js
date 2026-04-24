const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function submitHelpRequest({ input, sessionId }) {
  const response = await fetch(`${API_BASE_URL}/api/help`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input,
      sessionId,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error || "Something went wrong while finding your help.",
    );
  }

  return data;
}
