const key = 'myhelp:bundle-draft';
export function rememberBundle(bundle, sessionId, suggestedTitle = 'A saved moment') {
  try { sessionStorage.setItem(key, JSON.stringify({ bundle, sessionId, suggestedTitle, expires: Date.now() + 30 * 60 * 1000 })); } catch { /* Saving remains optional when storage is unavailable. */ }
}
export function restoreBundle() {
  try {
    const draft = JSON.parse(sessionStorage.getItem(key));
    return draft?.expires > Date.now() && draft.bundle && typeof draft.sessionId === 'string' ? draft : null;
  } catch { return null; }
}

export function clearBundleDraft() {
  try { sessionStorage.removeItem(key); } catch { /* Storage may be disabled. */ }
}
