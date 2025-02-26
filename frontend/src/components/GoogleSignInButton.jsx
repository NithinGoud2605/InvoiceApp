// src/components/GoogleSignInButton.jsx
import React, { useEffect } from 'react';

export default function GoogleSignInButton({ onSuccess, onError }) {
  const ref = React.useRef(null);

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // Corrected variable name
        callback: (response) => {
          if (response.credential) { // Fixed typo from credentiall
            onSuccess(response.credential);
          } else {
            onError('No credential received');
          }
        },
      });
      window.google.accounts.id.renderButton(
        ref.current,
        { theme: 'outline', size: 'large' }
      );
    }
  }, [onSuccess, onError]);

  return <div ref={ref} id="google-signin-button" />;
}