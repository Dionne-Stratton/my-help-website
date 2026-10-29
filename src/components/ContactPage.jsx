import { useState } from "react";
import { CONTACT_FORM_ENDPOINT } from "../constants/contact";

const reasons = [
  "Suggest or submit a resource",
  "Report a problem",
  "Ask a question",
  "Share encouragement or feedback",
  "Something else",
];

export default function ContactPage() {
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("idle");
  const isResource = reason === reasons[0];
  const isSending = status === "sending";

  async function handleSubmit(event) {
    event.preventDefault();
    if (!CONTACT_FORM_ENDPOINT || isSending) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    // Do not submit a filled honeypot.
    if (values._honey) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    setStatus("sending");
    try {
      const response = await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...values,
          _replyto: values.email,
          _subject: "My Help: " + reason,
          _template: "table",
          _url: window.location.origin + "/contact",
        }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok || !(data.success === true || data.success === "true")) {
        throw new Error("Message not accepted");
      }
      form.reset();
      setReason("");
      setStatus("sent");
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(timeout);
    }
  }

  return (
    <main className="about-page">
      <header className="about-intro">
        <p className="about-eyebrow">Contact</p>
        <h1>We’d love to hear from you.</h1>
        <p>Have a question, an idea, or a word of encouragement? Share what’s on your mind, tell us about a problem, or suggest a resource that could encourage someone else.</p>
      </header>

      <section className="about-section" aria-labelledby="contact-send">
        <h2 id="contact-send">Send a message</h2>
        {status === "sent" ? (
          <div role="status">
            <p>Thank you for reaching out. Your message has been submitted.</p>
            <button type="button" className="about-cta" onClick={() => setStatus("idle")}>Write another message</button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <fieldset disabled={isSending}>
              <legend className="contact-sr-only">Your contact details and message</legend>
              <label htmlFor="contact-name">Name</label>
              <input id="contact-name" name="name" autoComplete="name" maxLength={100} required />
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required aria-describedby="contact-email-note" />
              <p id="contact-email-note" className="contact-hint">So we can reply to your message.</p>

              <label htmlFor="contact-reason">What would you like to contact us about?</label>
              <select id="contact-reason" name="reason" value={reason} onChange={(event) => setReason(event.target.value)} required>
                <option value="">Choose a reason</option>
                {reasons.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>

              {isResource && (
                <>
                  <label htmlFor="contact-resource-type">What kind of resource?</label>
                  <select id="contact-resource-type" name="resource_type" required defaultValue="">
                    <option value="">Choose a resource type</option>
                    <option>Song or music</option><option>Reflection or devotional</option><option>Prayer</option><option>Scripture suggestion</option><option>Other</option>
                  </select>
                  <label htmlFor="contact-resource-link">Resource link</label>
                  <input id="contact-resource-link" name="resource_link" type="url" pattern="https?://.+" placeholder="https://" maxLength={2000} required aria-describedby="contact-resource-note" />
                  <p id="contact-resource-note" className="contact-hint">Share a website link or a Google Drive link set to “Anyone with the link can view.” Please don’t send files or links that require a login.</p>
                </>
              )}

              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" rows={6} maxLength={5000} required aria-describedby="contact-message-note" />
              <p id="contact-message-note" className="contact-hint">
                {isResource ? "Tell us about the resource, who created it, and how it could encourage visitors." : reason === reasons[1] ? "Tell us what you were trying to do and what happened. Your device and browser can help us investigate, too." : "Tell us how we can help or what you’d like to share."}
              </p>
              <div className="contact-honeypot" aria-hidden="true">
                <label htmlFor="contact-website">Leave this field empty</label>
                <input id="contact-website" name="_honey" tabIndex={-1} autoComplete="off" />
              </div>
              <p className="contact-hint">Messages are processed by FormSubmit and delivered by email. This form accepts text and links only; there are no file uploads.</p>
              {!CONTACT_FORM_ENDPOINT && <p role="status" className="contact-hint">We’re finishing the contact form setup. Sending messages isn’t available just yet.</p>}
              <button className="about-cta" type="submit" disabled={!CONTACT_FORM_ENDPOINT || isSending}>{isSending ? "Sending…" : "Send message"}</button>
            </fieldset>
            {status === "error" && <p role="alert">Your message couldn’t be confirmed as sent. Your text is still here; please try again in a moment.</p>}
          </form>
        )}
      </section>

      <section className="about-section" aria-labelledby="contact-resources">
        <h2 id="contact-resources">Have something encouraging to share?</h2>
        <p>You’re welcome to suggest a song, a short reflection, a prayer, or another resource you think could help visitors. A link to your own website or a publicly viewable Google Drive file is a good place to start.</p>
        <p>Suggestions are reviewed before anything is added, and submitting a resource doesn’t guarantee it will be included. If you created the resource, please let us know; we’ll need permission from the rights holder before publishing someone else’s work.</p>
      </section>
    </main>
  );
}
