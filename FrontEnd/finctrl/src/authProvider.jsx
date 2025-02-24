import { Auth0Provider } from "@auth0/auth0-react";

const AuthProvider = ({ children }) => {
  return (
    <Auth0Provider
      domain="dev-v5nfmrpr6ppncfak.us.auth0.com"
      clientId="vZBnh2biJWshflqxdPDQ51Jl6XRrxsHN"
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;
