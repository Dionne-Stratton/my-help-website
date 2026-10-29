import { useId, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { saveBundle } from '../../api/savedBundlesApi';
import { rememberBundle } from './bundleDraft';
import { MAX_BUNDLE_TITLE_LENGTH } from './bundleTitle';

export default function SaveBundleButton({ bundle, sessionId, suggestedTitle = 'A saved moment', initiallyEditing = false }) {
  const { isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const [status, setStatus] = useState(initiallyEditing ? 'naming' : 'idle');
  const [title, setTitle] = useState(suggestedTitle);
  const [error, setError] = useState(null);
  const titleId = useId();
  const saving = status === 'saving';
  async function save(event) {
    event.preventDefault();
    const name = title.trim();
    if (!name) { setError('Please enter a name for this bundle.'); return; }
    if (name.length > MAX_BUNDLE_TITLE_LENGTH) { setError('Use 120 characters or fewer.'); return; }
    setError(null);
    setStatus('saving');
    try {
      if (!isAuthenticated) {
        rememberBundle(bundle, sessionId, name);
        await loginWithRedirect({ appState: { returnTo: '/' } });
        return;
      }
      const data = await saveBundle(getAccessTokenSilently, bundle, sessionId, name);
      setTitle(data.item.title ?? name);
      setStatus('saved');
    } catch (error) { setError(error.message || 'Unable to save this bundle.'); setStatus('naming'); }
  }
  return <div className="save-bundle-action">
    {status === 'saved' ? <p role="status">“{title}” is saved to your account. <Link to="/saved">View saved bundles</Link></p>
      : status === 'idle' ? <button type="button" className="account-button" disabled={isLoading} onClick={() => setStatus('naming')}>Save this bundle</button>
        : <form className="bundle-name-form" onSubmit={save}>
          <label htmlFor={titleId}>Bundle name</label>
          <input id={titleId} type="text" value={title} onChange={event => setTitle(event.target.value)} required maxLength={MAX_BUNDLE_TITLE_LENGTH} disabled={saving} />
          <p>You can change this name now or rename it later in Saved.</p>
          <div className="bundle-name-actions">
            <button type="submit" className="account-button" disabled={isLoading || saving || !title.trim()}>{saving ? 'Saving…' : isAuthenticated ? 'Save bundle' : 'Sign in and save'}</button>
            <button type="button" className="account-button" disabled={saving} onClick={() => { setStatus('idle'); setError(null); }}>Cancel</button>
          </div>
        </form>}
    {error && <p role="alert">{error}</p>}
  </div>;
}
