// These identifiers are public. No client secret belongs in a browser app.
export const authConfig = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || 'dev-t2whljcmqk7brtx1.us.auth0.com',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'SBOao6kDdL3NmGpWNrKTQUQuccBaTXwo',
  audience: import.meta.env.VITE_AUTH0_AUDIENCE || 'https://myhelp-api',
};
