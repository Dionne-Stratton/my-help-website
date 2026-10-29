import React, { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AuthCallbackPage from '../src/auth/AuthCallbackPage';
import SaveBundleButton from '../src/features/help/SaveBundleButton';
import SavedBundlesPage from '../src/components/SavedBundlesPage';
import HelpFlow from '../src/features/help/HelpFlow';
import { suggestBundleTitle } from '../src/features/help/bundleTitle';
import { clearBundleDraft, rememberBundle, restoreBundle } from '../src/features/help/bundleDraft';

const mocks = vi.hoisted(() => ({ auth: {}, request: vi.fn(), save: vi.fn(), help: vi.fn() }));
vi.mock('../src/api/helpApi', () => ({ submitHelpRequest: (...args) => mocks.help(...args) }));
vi.mock('@auth0/auth0-react', () => ({ useAuth0: () => mocks.auth }));
vi.mock('../src/api/savedBundlesApi', () => ({ savedBundlesRequest: (...args) => mocks.request(...args), saveBundle: (...args) => mocks.save(...args) }));
const bundle = { scripture: [{ id: 'verse', title: 'Always held', body_text: 'A Scripture passage.' }], prayer: [], reflection: [], song: [] };
const wrap = component => <MemoryRouter>{component}</MemoryRouter>;
beforeEach(() => {
  sessionStorage.clear();
  mocks.request.mockReset(); mocks.save.mockReset(); mocks.help.mockReset();
  mocks.auth = { isAuthenticated: false, isLoading: false, user: undefined, loginWithRedirect: vi.fn().mockResolvedValue(), getAccessTokenSilently: vi.fn() };
});
afterEach(cleanup);

describe('bundle sign-in and saves', () => {
  it('preserves the bundle before redirecting a guest, without saving input or making an API call', async () => {
    render(wrap(<SaveBundleButton bundle={bundle} sessionId="moment-1" />));
    fireEvent.click(screen.getByRole('button', { name: 'Save this bundle' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Bundle name' }), { target: { value: 'Sad' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in and save' }));
    await waitFor(() => expect(mocks.auth.loginWithRedirect).toHaveBeenCalled());
    expect(restoreBundle().bundle).toEqual(bundle);
    expect(restoreBundle().suggestedTitle).toBe('Sad');
    expect(restoreBundle()).not.toHaveProperty('input');
    expect(mocks.save).not.toHaveBeenCalled();
  });
  it('saves for a signed-in account and shows success only after the server responds', async () => {
    mocks.auth.isAuthenticated = true;
    mocks.save.mockResolvedValue({ item: { id: 'saved-1' } });
    render(wrap(<SaveBundleButton bundle={bundle} sessionId="moment-1" />));
    fireEvent.click(screen.getByRole('button', { name: 'Save this bundle' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Bundle name' }), { target: { value: 'Sad - evening comfort' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save bundle' }));
    await screen.findByRole('status');
    expect(mocks.save).toHaveBeenCalledWith(mocks.auth.getAccessTokenSilently, bundle, 'moment-1', 'Sad - evening comfort');
    expect(screen.getByRole('link', { name: 'View saved bundles' }).getAttribute('href')).toBe('/saved');
  });
  it('shows save failures and permits retry', async () => {
    mocks.auth.isAuthenticated = true; mocks.save.mockRejectedValue(new Error('Please sign in again.'));
    render(wrap(<SaveBundleButton bundle={bundle} sessionId="moment-1" />));
    fireEvent.click(screen.getByRole('button', { name: 'Save this bundle' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save bundle' }));
    expect((await screen.findByRole('alert')).textContent).toContain('Please sign in again.');
    expect(screen.getByRole('button', { name: 'Save bundle' }).disabled).toBe(false);
  });
  it('restores the saved sign-in draft under React StrictMode', () => {
    rememberBundle(bundle, 'moment-1');
    render(wrap(<StrictMode><HelpFlow /></StrictMode>));
    expect(screen.getByText('Always held')).toBeTruthy();
    expect(screen.getByRole('textbox', { name: 'Bundle name' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sign in and save' })).toBeTruthy();
  });
  it('expires drafts and clears them on request', () => {
    rememberBundle(bundle, 'moment-1');
    const value = JSON.parse(sessionStorage.getItem('myhelp:bundle-draft'));
    value.expires = 1; sessionStorage.setItem('myhelp:bundle-draft', JSON.stringify(value));
    expect(restoreBundle()).toBe(null);
    clearBundleDraft(); expect(sessionStorage.length).toBe(0);
  });
});

describe('saved bundle account boundaries', () => {
  it('guests are offered sign-in and do not request private data', () => {
    render(wrap(<SavedBundlesPage />));
    expect(screen.getByRole('button', { name: 'Sign in or create an account' })).toBeTruthy();
    expect(mocks.request).not.toHaveBeenCalled();
  });
  it('does not display the previous account list while a new account loads', async () => {
    mocks.auth.isAuthenticated = true; mocks.auth.user = { sub: 'alice' };
    mocks.request.mockResolvedValueOnce({ items: [{ id: 'a', title: 'Alice moment', createdAt: '2026-01-01' }], nextCursor: null });
    const view = render(wrap(<SavedBundlesPage />));
    await screen.findByRole('button', { name: /^Alice moment/ });
    mocks.auth.user = { sub: 'bob' }; mocks.request.mockReturnValue(new Promise(() => {}));
    view.rerender(wrap(<SavedBundlesPage />));
    expect(screen.queryByRole('button', { name: /^Alice moment/ })).toBe(null);
  });
  it('requires confirmation before removing a saved bundle', async () => {
    mocks.auth.isAuthenticated = true; mocks.auth.user = { sub: 'alice' };
    mocks.request.mockResolvedValueOnce({ items: [{ id: 'a', title: 'My moment', createdAt: '2026-01-01' }], nextCursor: null });
    render(wrap(<SavedBundlesPage />));
    fireEvent.click(await screen.findByRole('button', { name: 'Remove My moment' }));
    expect(mocks.request).toHaveBeenCalledTimes(1);
    mocks.request.mockResolvedValueOnce({ success: true });
    fireEvent.click(screen.getByRole('button', { name: 'Confirm removal' }));
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Remove My moment' })).toBe(null));
    expect(mocks.request).toHaveBeenLastCalledWith(mocks.auth.getAccessTokenSilently, '/a', { method: 'DELETE' });
  });
});


describe('bundle names', () => {
  it('uses short requests as names and primary tags for longer requests', () => {
    expect(suggestBundleTitle('sad', 'grief')).toBe('Sad');
    expect(suggestBundleTitle('  sad   today  ', 'grief')).toBe('Sad today');
    expect(suggestBundleTitle('I have been going through a very difficult time and need encouragement', 'discouragement')).toBe('Discouragement');
    expect(suggestBundleTitle('', 'spiritual_dryness')).toBe('Spiritual dryness');
    expect(suggestBundleTitle()).toBe('A saved moment');
  });
  it('prefills a suggested name and lets a person cancel without saving', () => {
    mocks.auth.isAuthenticated = true;
    render(wrap(<SaveBundleButton bundle={bundle} sessionId="moment-1" suggestedTitle="Sad" />));
    fireEvent.click(screen.getByRole('button', { name: 'Save this bundle' }));
    expect(screen.getByRole('textbox', { name: 'Bundle name' }).value).toBe('Sad');
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mocks.save).not.toHaveBeenCalled();
    expect(screen.queryByRole('textbox')).toBe(null);
  });
  it('disables saving a blank name', () => {
    mocks.auth.isAuthenticated = true;
    render(wrap(<SaveBundleButton bundle={bundle} sessionId="moment-1" initiallyEditing />));
    fireEvent.change(screen.getByRole('textbox', { name: 'Bundle name' }), { target: { value: '   ' } });
    expect(screen.getByRole('button', { name: 'Save bundle' }).disabled).toBe(true);
    expect(mocks.save).not.toHaveBeenCalled();
  });
  it('renames a saved bundle and refreshes the displayed name', async () => {
    mocks.auth.isAuthenticated = true; mocks.auth.user = { sub: 'alice' };
    mocks.request.mockResolvedValueOnce({ items: [{ id: 'a', title: 'Old name', createdAt: '2026-01-01' }], nextCursor: null });
    render(wrap(<SavedBundlesPage />));
    fireEvent.click(await screen.findByRole('button', { name: 'Rename Old name' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Bundle name' }), { target: { value: 'Sad - morning' } });
    mocks.request.mockResolvedValueOnce({ item: { id: 'a', title: 'Sad - morning' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save name' }));
    await screen.findByRole('button', { name: 'Rename Sad - morning' });
    expect(mocks.request).toHaveBeenLastCalledWith(mocks.auth.getAccessTokenSilently, '/a', { method: 'PATCH', body: JSON.stringify({ title: 'Sad - morning' }) });
  });
  it('retains a rename draft after an API failure', async () => {
    mocks.auth.isAuthenticated = true; mocks.auth.user = { sub: 'alice' };
    mocks.request.mockResolvedValueOnce({ items: [{ id: 'a', title: 'Old name', createdAt: '2026-01-01' }], nextCursor: null });
    render(wrap(<SavedBundlesPage />));
    fireEvent.click(await screen.findByRole('button', { name: 'Rename Old name' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Bundle name' }), { target: { value: 'My new name' } });
    mocks.request.mockRejectedValueOnce(new Error('Connection unavailable.'));
    fireEvent.click(screen.getByRole('button', { name: 'Save name' }));
    await screen.findByRole('alert');
    expect(screen.getByRole('textbox', { name: 'Bundle name' }).value).toBe('My new name');
    expect(screen.getByRole('button', { name: 'Save name' }).disabled).toBe(false);
  });
});


it('uses the API primary tag to name a bundle for a longer request', async () => {
  mocks.auth.isAuthenticated = true;
  mocks.help.mockResolvedValue({ bundle, primaryTag: 'discouragement' });
  render(wrap(<HelpFlow />));
  fireEvent.change(screen.getByPlaceholderText('Tell me what feels heavy...'), { target: { value: 'I have been feeling very overwhelmed by everything happening in my life this week.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Find help' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Save this bundle' }, { timeout: 3000 }));
  expect(screen.getByRole('textbox', { name: 'Bundle name' }).value).toBe('Discouragement');
});


describe('sign-in callback recovery', () => {
  const callback = () => render(<MemoryRouter initialEntries={['/auth/callback?error=access_denied&state=example']}>
    <Routes>
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/" element={<HelpFlow />} />
    </Routes>
  </MemoryRouter>);

  it('returns to the preserved bundle after canceled consent without showing an error', async () => {
    rememberBundle(bundle, 'moment-1', 'Evening comfort');
    mocks.auth.error = { error: 'access_denied', error_description: 'User canceled' };
    callback();
    expect(await screen.findByText('Always held')).toBeTruthy();
    expect(screen.getByRole('textbox', { name: 'Bundle name' }).value).toBe('Evening comfort');
    expect(screen.queryByRole('alert')).toBe(null);
    expect(screen.queryByText('Sign-in could not finish')).toBe(null);
  });

  it('waits for Auth0 to process the callback before handling cancellation', () => {
    mocks.auth.isLoading = true;
    mocks.auth.error = { error: 'access_denied' };
    callback();
    expect(screen.getByRole('status').textContent).toBe('Finishing sign-in…');
    expect(screen.queryByRole('heading', { name: 'Sign-in could not finish' })).toBe(null);
  });

  it('lets users leave a real sign-in error without refreshing or retaining a notice', async () => {
    mocks.auth.error = new Error('Invalid state');
    callback();
    expect(screen.getByRole('heading', { name: 'Sign-in could not finish' })).toBeTruthy();
    const link = screen.getByRole('link', { name: 'Return to Find Help' });
    expect(link.className).toBe('about-cta');
    fireEvent.click(link);
    await waitFor(() => expect(screen.queryByRole('heading', { name: 'Sign-in could not finish' })).toBe(null));
    expect(screen.queryByRole('alert')).toBe(null);
  });
});
