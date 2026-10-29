# My Help - Frontend

My Help is a faith-centered web application that helps visitors find relevant Scripture, prayers, reflections, and worship music for what they are facing. This repository contains the React frontend; interpretation, resource matching, and the `/api/help` endpoint live in the separate backend.

## Tech and development

- React 19, React Router 7, Vite 8.
- Cloudflare Workers static-asset deployment using Wrangler (see `wrangler.jsonc`).
- Install dependencies with `npm install`; start the Vite dev server with `npm run dev`.
- Run `npm run lint` for ESLint and `npm run build` for a production build.
- `npm run preview` builds and previews through Wrangler; `npm run deploy` builds and deploys with Wrangler. Cloudflare deployment requires the appropriate account authentication.
- Set `VITE_API_BASE_URL` to the running backend's origin for help requests. The frontend defaults to `http://localhost:3000` if it is not set. Do not embed private API keys in `VITE_` variables.

## Current pages

| Path | Purpose | Entry point |
| --- | --- | --- |
| `/` | Find Help: describe a situation and receive a resource bundle | `src/features/help/HelpFlow.jsx` |
| `/about` | App purpose, approach, and resources | `src/components/AboutPage.jsx` |
| `/my-story` | Personal story behind the project | `src/components/MyStoryPage.jsx` |
| `/donate` | Optional support through hosted PayPal checkout | `src/components/DonatePage.jsx` |
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
