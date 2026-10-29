# Current implementation

This describes the `feature/auth0-saved-bundles` branch. It supersedes earlier V1 proposals about accounts, saving, and resource browsing. Branch changes are not automatically deployed.

## Help and saving

- Anyone can submit a help request without signing in. The backend interprets the request and selects curated Scripture, prayer, reflection, and song resources.
- Results omit the old small logo. **Save this bundle** and its name form appear immediately below the heading, before the resources.
- Saving keeps the entire bundle, rather than individual resources. Short requests suggest a name from the input; longer requests use the primary interpreted tag. The name is editable before saving and limited to 120 characters.
- A guest enters the name and signs in through Auth0. A temporary sessionStorage draft retains the bundle, request ID, and chosen name for 30 minutes across the redirect. It excludes the original help text. After returning, the user confirms Save bundle.
- This draft is not a permanent guest library. Starting a new moment or signing out clears it.
- In **Saved**, signed-in users open, rename, or remove their own bundles. The list shows names and save dates, with Load more pagination. Removal asks for confirmation.
- Renaming preserves the original save date and resource snapshot. Separate requests can have identical names; retrying the same request does not create another saved copy for that account.
- Saved detail pages use the chosen name as the heading and display the stored snapshot without rerunning AI or matching.

## Accounts and API

Auth0 Universal Login handles sign-in, signup, and password reset. The SPA uses Authorization Code with PKCE and stores tokens in SDK memory. Saved API calls use an access token for `https://myhelp-api`, with read/write saved-bundle scopes. The backend verifies the token and derives ownership from its subject.

The implemented routes are public `POST /api/help` and authenticated `GET`/`POST /api/saved-bundles`, plus `GET`/`PATCH`/`DELETE /api/saved-bundles/:id`. See the backend README for the contract. Earlier proposed `/api/saved-resources`, browse, tag, and profile routes are not implemented.

## Remaining decisions and release checks

- Independent browsing without a help request remains undecided. No browse UI or API is included in this branch.
- Scoring, weighting, and resource selection can be tuned separately; this feature does not change their behavior.
- Auth0 still uses shared tenant branding from the music site. Choosing shared organization branding or per-app branding is deferred.
- Local sign-in, saving, and renaming have been user-tested. Before release, check signup, password-reset email delivery, logout, and a second account's isolation against the real tenant. Automated tests do not send account emails.
- Deploy the saved-bundle schema and backend before the frontend. No new migration is needed for naming or the results layout.

See the repository README for local ports, environment overrides, validation commands, and Auth0 origins. Public frontend variables are visible in the shipped app; private credentials belong on the backend.
