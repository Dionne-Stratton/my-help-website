import { clearBundleDraft } from '../features/help/bundleDraft';
import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { NavLink } from 'react-router-dom';

const icon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 22v-3a8 8 0 0 1 16 0v3" /></svg>;
export default function AccountNavigation() {
  const { isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
  const [actionError, setActionError] = useState(null);
  async function signIn() {
    setActionError(null);
    try { await loginWithRedirect({ appState: { returnTo: '/saved' } }); }
    catch { setActionError('Sign-in could not start. Please try again.'); }
  }
  async function signOut() {
    clearBundleDraft();
    try { await logout({ logoutParams: { returnTo: window.location.origin } }); }
    catch { setActionError("Sign-out could not finish. Please try again."); }
  }
  return <div className="account-navigation">
    <NavLink className="side-nav-link" to="/saved" title="Saved bundles">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M6 3h12v19l-6-4-6 4Z" /></svg><span>Saved</span>
    </NavLink>
    {isAuthenticated ? <button type="button" className="side-nav-link" onClick={signOut}>{icon}<span>Sign out</span></button>
      : <button type="button" disabled={isLoading} className="side-nav-link" onClick={signIn}>{icon}<span>{isLoading ? 'Loading' : 'Sign in'}</span></button>}
    {actionError && <p role="alert">{actionError}</p>}
  </div>;
}
