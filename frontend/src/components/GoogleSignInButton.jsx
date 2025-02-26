// src/components/GoogleSignInButton.jsx
import React, { useEffect } from 'react';

export default function GoogleSignInButton({ onSuccess, onError }) {
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google Client ID
      callback: (response) => {
        if (response.credential) {
          onSuccess(response.credential);
        } else {
          onError('No credential received');
        }
      }
    });
    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      { theme: 'outline', size: 'large' }
    );
  }, [onSuccess, onError]);

  return <div id="google-signin-button"></div>;
}
