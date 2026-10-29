import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { savedBundlesRequest } from '../api/savedBundlesApi';
import HelpBundleView from '../features/help/HelpBundleView';

export default function SavedBundlesPage() {
  const { isAuthenticated, isLoading, user, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  // Key account state by identity so one person's data never flashes for another account.
  return <SavedBundles key={user?.sub ?? 'guest'} auth={{ isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently }} />;
}
function SavedBundles({ auth }) {
  const { isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently } = auth;
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [renaming, setRenaming] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    savedBundlesRequest(getAccessTokenSilently).then(data => {
      if (active) { setItems(data.items); setCursor(data.nextCursor); }
    }).catch(error => { if (active) setError(error.message); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [isAuthenticated, getAccessTokenSilently]);
  async function run(action) {
    setError(null); setBusy(true);
    try { await action(); } catch (error) { setError(error.message); } finally { setBusy(false); }
  }
  if (isLoading) return <main className="about-page"><p role="status">Loading your account…</p></main>;
  if (!isAuthenticated) return <main className="about-page"><h1>Your saved bundles</h1>
    <p>Sign in to keep your bundles together and return to them on any device.</p>
    <button className="account-button" onClick={() => run(() => loginWithRedirect({ appState: { returnTo: '/saved' } }))}>Sign in or create an account</button>
    {error && <p role="alert">{error}</p>}
  </main>;
  if (selected) return <><div className="saved-back"><button className="account-button" onClick={() => setSelected(null)}>Back to saved bundles</button></div>
    <HelpBundleView heading={selected.title} bundle={selected.bundle} onStartOver={() => setSelected(null)} startOverLabel="Back to saved bundles" /></>;
  return <main className="about-page"><h1>Your saved bundles</h1>
    <p>Return to the Scripture, prayers, reflections, and songs you have saved.</p>
    {error && <p role="alert">{error}</p>}
    {busy && <p role="status">Loading saved bundles…</p>}
    {!busy && !error && !items.length && <p>Your saved bundles will appear here after you save a moment of help.</p>}
    <ul className="saved-bundle-list">{items.map(item => <li key={item.id}>
      <button className="saved-bundle-open" disabled={busy} onClick={() => run(async () => {
        const data = await savedBundlesRequest(getAccessTokenSilently, `/${item.id}`); setSelected(data.item);
      })}>{item.title}<span>{new Date(item.createdAt).toLocaleDateString()}</span></button>
      {renaming === item.id ? <form className="bundle-name-form" onSubmit={event => {
        event.preventDefault();
        if (!newTitle.trim()) return;
        run(async () => {
          const data = await savedBundlesRequest(getAccessTokenSilently, `/${item.id}`, {
            method: 'PATCH', body: JSON.stringify({ title: newTitle.trim() }),
          });
          setItems(current => current.map(row => row.id === item.id ? { ...row, title: data.item.title } : row));
          setRenaming(null);
        });
      }}>
        <label htmlFor={`bundle-name-${item.id}`}>Bundle name</label>
        <input id={`bundle-name-${item.id}`} type="text" value={newTitle} onChange={event => setNewTitle(event.target.value)} maxLength={120} required disabled={busy} />
        <div className="bundle-name-actions">
          <button type="submit" className="account-button" disabled={busy || !newTitle.trim()}>Save name</button>
          <button type="button" className="account-button" disabled={busy} onClick={() => setRenaming(null)}>Cancel</button>
        </div>
      </form> : <button type="button" className="saved-remove" disabled={busy} onClick={() => {
        setRenaming(item.id); setNewTitle(item.title); setRemoving(null); setError(null);
      }} aria-label={`Rename ${item.title}`}>Rename</button>}
      {removing === item.id ? <div><p>Remove this saved bundle from your account?</p>
        <button className="account-button" disabled={busy} onClick={() => run(async () => {
          await savedBundlesRequest(getAccessTokenSilently, `/${item.id}`, { method: 'DELETE' });
          setItems(current => current.filter(row => row.id !== item.id)); setRemoving(null);
        })}>Confirm removal</button> <button className="account-button" onClick={() => setRemoving(null)}>Keep bundle</button>
      </div> : <button className="saved-remove" disabled={busy} onClick={() => { setRemoving(item.id); setRenaming(null); }} aria-label={`Remove ${item.title}`}>Remove</button>}
    </li>)}</ul>
    {cursor && <button className="account-button" disabled={busy} onClick={() => run(async () => {
      const data = await savedBundlesRequest(getAccessTokenSilently, `?before=${encodeURIComponent(cursor)}`);
      setItems(current => [...current, ...data.items]); setCursor(data.nextCursor);
    })}>Load more</button>}
  </main>;
}
