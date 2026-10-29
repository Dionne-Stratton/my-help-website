import { API_BASE_URL } from './helpApi';

export async function savedBundlesRequest(getAccessTokenSilently, path = '', options = {}) {
  const token = await getAccessTokenSilently();
  const response = await fetch(`${API_BASE_URL}/api/saved-bundles${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || 'Unable to access saved bundles right now.');
  return data;
}
export function saveBundle(getToken, bundle, sourceId) {
  const resourceIds = Object.fromEntries(['scripture', 'prayer', 'reflection', 'song']
    .map(slot => [slot, (bundle[slot] ?? []).map(resource => resource.id)]));
  return savedBundlesRequest(getToken, '', { method: 'POST', body: JSON.stringify({ sourceId, resourceIds }) });
}
