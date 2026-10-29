# My Help - Frontend

My Help is a faith-centered web application that helps visitors find relevant Scripture, prayers, reflections, and worship music for what they are facing. This repository contains the React frontend; interpretation, resource matching, and the `/api/help` endpoint live in the separate backend.

## Tech and development

- React 19, React Router 7, Vite 8.
- Cloudflare Workers static-asset deployment using Wrangler (see `wrangler.jsonc`).
- Install dependencies with `npm install`; start the Vite dev server with `npm run dev`.
- Run `npm run lint` for ESLint and `npm run build` for a production build.
- `npm run preview` builds and previews through Wrangler; `npm run deploy` builds and deploys with Wrangler. Cloudflare deployment requires the appropriate account authentication.
- Set `VITE_API_BASE_URL` to the running backend's origin for help requests. The frontend defaults to `http://localhost:8787` in development and the deployed backend URL in production. Do not embed private API keys in `VITE_` variables.

## Current pages

| Path | Purpose | Entry point |
| --- | --- | --- |
| `/` | Find Help: describe a situation and receive a resource bundle | `src/features/help/HelpFlow.jsx` |
| `/about` | App purpose, approach, and resources | `src/components/AboutPage.jsx` |
| `/my-story` | Personal story behind the project | `src/components/MyStoryPage.jsx` |
| `/donate` | Optional support through hosted PayPal checkout | `src/components/DonatePage.jsx` |
| `/saved` | Account-owned bundles: open, rename, and remove | `src/components/SavedBundlesPage.jsx` |
| `/auth/callback` | Auth0 sign-in return | `src/auth/MyHelpAuthProvider.jsx` |
| `/contact` | Feedback, questions, problem reports, and resource suggestions | `src/components/ContactPage.jsx` |

Unrecognized paths redirect to `/`. `src/App.jsx` owns routes, page titles, navigation links, and the dismissible crisis-help badge. The Find Help flow and contact form remain mounted when navigating between pages, preserving in-progress input.

## Find Help flow and API boundary

1. `HelpInputScreen.jsx` collects the visitor's words.
2. `HelpFlow.jsx` sends `{ input, sessionId }` to `POST ${VITE_API_BASE_URL}/api/help` via `src/api/helpApi.js`.
3. The backend returns a resource bundle (and optional debug information). The frontend shows a gentle loading transition and renders the results through `HelpBundleView.jsx`.
4. A new request resets the flow and creates a new session ID.

Treat the backend API contract as authoritative for response fields and resource matching. This frontend does not implement the backend matching algorithm or the resource database. The older design documents under `docs/` describe the broader project and may include historical plans; check current server code before interpreting those documents as implemented behavior.

## Navigation and presentation

- `src/components/NavigationDrawer.jsx` renders the collapsible sidebar with the small site logo. A hamburger toggle and touch swipe open/close it; clicking outside or pressing Escape closes it.
- On hover-capable mouse devices, the drawer opens when the pointer enters the navigation area, and schedules closure **1.5 seconds after pointer leave**; reentering cancels that timeout. Keyboard focus also holds it open.
- The Find Help page displays its own larger artwork. About, My Story, and Donate have separate panoramic banners under their headings; Contact intentionally has no banner.
- Styles live primarily in `src/App.css` and `src/index.css`. Artwork is in `src/assets/` (`about-banner.webp`, `my-story-banner.webp`, `donate-banner.webp`, and the logo assets).

## Contact and donations

- `src/components/ContactPage.jsx` posts JSON to the FormSubmit endpoint configured in `src/constants/contact.js`, with client-side feedback, a honeypot, and a request timeout. It supports text and public resource links, not uploads.
- `src/components/DonatePage.jsx` links to PayPal via `PAYPAL_SUPPORT_URL` in `src/constants/donations.js`. PayPal handles payment; a frontend return URL is not proof of a successful transaction.

## Documentation maintenance

When a feature changes, update this README for new pages, navigation, deployment or frontend behavior. Coordinate API contract changes with the backend repository and update its documentation too; avoid copying speculative server behavior into this README.

## Optional accounts and saved bundles

Auth0 handles sign-in, account creation, and password resets using Universal Login.
Visitors can still request help without an account. The navigation includes Sign in,
Sign out, and Saved. Save opens an editable name form: short requests such as
"sad" suggest "Sad", and longer requests use the primary interpretation tag.
The backend exposes that tag as `primaryTag` in `/api/help`; no additional AI
request is needed. Names are limited to 120 characters and can be changed later
with Rename in Saved. Separate requests may have the same name without replacing
each other. The chosen name appears when opening a saved bundle as well.

A temporary sessionStorage draft preserves the resource bundle, source ID, and
chosen name across sign-in for 30 minutes, not the original help input. Returning
from sign-in reopens the name form; confirm Save bundle to persist it to the signed-in
account. Create a new moment and sign-out clear this draft. Tokens stay in SDK
memory, not localStorage; a reload may require sign-in again when a browser
prevents Auth0's silent session check. Existing saved bundles can be renamed;
this naming update requires no new database migration.

Auth0's configured public values are in `src/auth/config.js` and can be overridden
with the `VITE_AUTH0_*` variables in `.env.example`. The app uses Authorization Code
with PKCE. A public SPA has no client secret, and none should be added to frontend
variables. Saved-bundle API requests send an API access token with the audience
`https://myhelp-api` and scopes `read:saved_bundles write:saved_bundles`.

The configured frontend origins are `http://localhost:5173`,
`http://127.0.0.1:5173`, and
`https://my-help-website.dionnestratton.workers.dev`. Each callback URL is the
origin plus `/auth/callback`; logout URLs and web origins are the exact origins.
Local Vite uses strict port 5173 so it cannot silently choose an unregistered port.
If deploying a custom domain, add its exact origin and callback in Auth0 before
using it. No tenant-wide branding or existing music-app settings were changed.

### Test both repositories locally

1. In `my-help-node-server`, check out `feature/auth0-saved-bundles` and run `npm ci`.
   On an existing database, apply only the new saved-bundle schema if it is missing:
   `npx wrangler d1 execute my-help-db --local --file=./api/migrations/003_saved_bundles.sql`.
   If this already succeeded, skip it. Do not rerun historical seeds just to test accounts.
   See the backend README for fresh-database setup.
2. Start that backend with `npm run dev` (port 8787). Its Auth0 public settings are
   in `wrangler.toml`; keep the existing OpenAI key in the local `.dev.vars` file.
3. In this frontend repository, check out the same branch, run `npm ci`, then
   `npm run dev`. The default development API URL is `http://localhost:8787`.
4. Check anonymous help, then sign in, save a bundle, open it from Saved, reload,
   and sign back in if needed. Sign out and verify private bundles are hidden.
   Use a second account to confirm the first account's saved bundles are absent.
5. Check account creation, password-reset email delivery, and logout in the real
   Auth0 tenant before release. Automated tests do not send real account emails.

Production builds default to the verified backend URL
`https://my-help-node-server.dionnestratton.workers.dev`; `VITE_API_BASE_URL`
overrides it. Deploy backend migration `003_saved_bundles.sql` and the backend
Worker before deploying the matching frontend. The changes are not deployed by
pushing a feature branch.

Run `npm test`, `npm run lint`, and `npm run build` for validation. Saved-list and
button tests mock Auth0; backend tests independently verify signed JWTs and real
SQLite ownership queries. A real-user round trip remains a release smoke test.

When testing locally, `.env.local` can set `VITE_API_BASE_URL=http://localhost:8787`; this overrides an older `.env` value pointing at the deployed backend. Restart Vite after editing environment files.

Bundle result pages omit the older small logo. The Save control and editable-name form sit directly below the page heading, before the Scripture and other resources.

## Current scope and follow-up work

See [Current implementation](docs/Current%20Implementation.md) for the implemented
account and saved-bundle flow. Earlier V1 design documents are proposals where
they conflict with that summary. Independent resource browsing remains undecided;
individual-resource saving and permanent guest device storage are not implemented.
Shared Auth0 login branding is deferred. Keep any future browse feature and
scoring/weighting changes in separate branches from this account feature.
