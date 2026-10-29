import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { saveBundle } from '../../api/savedBundlesApi';
import { rememberBundle } from './bundleDraft';

export default function SaveBundleButton({ bundle, sessionId }) {
  const { isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  async function save() {
    setError(null);
    setStatus('saving');
    try {
      if (!isAuthenticated) {
        rememberBundle(bundle, sessionId);
        await loginWithRedirect({ appState: { returnTo: '/' } });
        return;
      }
      await saveBundle(getAccessTokenSilently, bundle, sessionId);
      setStatus('saved');
    } catch (error) { setError(error.message || 'Unable to save this bundle.'); setStatus('idle'); }
  }
  return <div className="save-bundle-action">
    {status === 'saved' ? <p role="status">Saved to your account. <Link to="/saved">View saved bundles</Link></p>
      : <button type="button" className="account-button" disabled={isLoading || status === 'saving'} onClick={save}>
        {status === 'saving' ? 'Saving…' : isAuthenticated ? 'Save this bundle' : 'Sign in to save this bundle'}
      </button>}
    {error && <p role="alert">{error}</p>}
  </div>;
}
