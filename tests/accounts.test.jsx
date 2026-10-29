import React, { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SaveBundleButton from '../src/features/help/SaveBundleButton';
import SavedBundlesPage from '../src/components/SavedBundlesPage';
import HelpFlow from '../src/features/help/HelpFlow';
import { clearBundleDraft, rememberBundle, restoreBundle } from '../src/features/help/bundleDraft';

const mocks = vi.hoisted(() => ({ auth: {}, request: vi.fn(), save: vi.fn() }));
vi.mock('@auth0/auth0-react', () => ({ useAuth0: () => mocks.auth }));
vi.mock('../src/api/savedBundlesApi', () => ({ savedBundlesRequest: (...args) => mocks.request(...args), saveBundle: (...args) => mocks.save(...args) }));
const bundle = { scripture: [{ id: 'verse', title: 'Always held', body_text: 'A Scripture passage.' }], prayer: [], reflection: [], song: [] };
const wrap = component => <MemoryRouter>{component}</MemoryRouter>;
beforeEach(() => {
  sessionStorage.clear();
  mocks.request.mockReset(); mocks.save.mockReset();
  mocks.auth = { isAuthenticated: false, isLoading: false, user: undefined, loginWithRedirect: vi.fn().mockResolvedValue(), getAccessTokenSilently: vi.fn() };
});
afterEach(cleanup);

describe('bundle sign-in and saves', () => {
  it('preserves the bundle before redirecting a guest, without saving input or making an API call', async () => {
    render(wrap(<SaveBundleButton bundle={bundle} sessionId="moment-1" />));
    fireEvent.click(screen.getByRole('button', { name: 'Sign in to save this bundle' }));
    await waitFor(() => expect(mocks.auth.loginWithRedirect).toHaveBeenCalled());
    expect(restoreBundle().bundle).toEqual(bundle);
    expect(restoreBundle()).not.toHaveProperty('input');
    expect(mocks.save).not.toHaveBeenCalled();
  });
  it('saves for a signed-in account and shows success only after the server responds', async () => {
    mocks.auth.isAuthenticated = true;
    mocks.save.mockResolvedValue({ item: { id: 'saved-1' } });
    render(wrap(<SaveBundleButton bundle={bundle} sessionId="moment-1" />));
    fireEvent.click(screen.getByRole('button', { name: 'Save this bundle' }));
    await screen.findByRole('status');
    expect(mocks.save).toHaveBeenCalledWith(mocks.auth.getAccessTokenSilently, bundle, 'moment-1');
    expect(screen.getByRole('link', { name: 'View saved bundles' }).getAttribute('href')).toBe('/saved');
  });
  it('shows save failures and permits retry', async () => {
    mocks.auth.isAuthenticated = true; mocks.save.mockRejectedValue(new Error('Please sign in again.'));
    render(wrap(<SaveBundleButton bundle={bundle} sessionId="moment-1" />));
    fireEvent.click(screen.getByRole('button', { name: 'Save this bundle' }));
    expect((await screen.findByRole('alert')).textContent).toContain('Please sign in again.');
    expect(screen.getByRole('button', { name: 'Save this bundle' }).disabled).toBe(false);
  });
  it('restores the saved sign-in draft under React StrictMode', () => {
    rememberBundle(bundle, 'moment-1');
    render(wrap(<StrictMode><HelpFlow /></StrictMode>));
    expect(screen.getByText('Always held')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sign in to save this bundle' })).toBeTruthy();
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
