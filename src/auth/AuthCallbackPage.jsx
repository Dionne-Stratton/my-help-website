import { useAuth0 } from '@auth0/auth0-react';
import { Link, Navigate } from 'react-router-dom';

export default function AuthCallbackPage() {
  const { error, isLoading } = useAuth0();

  if (isLoading) {
    return <main className="about-page"><p role="status">Finishing sign-in…</p></main>;
  }

  // Declining consent is a normal choice. Return to help, including any saved draft.
  if (!error || error.error === 'access_denied') {
    return <Navigate to="/" replace />;
  }

  return <main className="about-page">
    <h1>Sign-in could not finish</h1>
    <p>You can return to My Help and continue without signing in. If you’d like to save a bundle, you can try signing in again from the navigation.</p>
    <Link to="/" className="about-cta">Return to Find Help</Link>
  </main>;
}
