import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { authConfig } from './config';

export default function MyHelpAuthProvider({ children }) {
  const navigate = useNavigate();
  return <Auth0Provider domain={authConfig.domain} clientId={authConfig.clientId}
    cacheLocation="memory"
    authorizationParams={{
      redirect_uri: `${window.location.origin}/auth/callback`,
      audience: authConfig.audience,
      scope: 'openid profile email read:saved_bundles write:saved_bundles',
    }}
    onRedirectCallback={(state) => {
      const path = state?.returnTo;
      navigate(typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') ? path : '/', { replace: true });
    }}>
    {children}
  </Auth0Provider>;
}
