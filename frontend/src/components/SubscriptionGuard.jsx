// src/components/SubscriptionGuard.jsx
import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

export default function SubscriptionGuard({ children }) {
  const { user, loading } = useContext(UserContext);
  if (loading) return <div>Loading...</div>;
  if (!user || !user.isSubscribed) {
    return (
      <div>
        <h2>Feature Unavailable</h2>
        <p>This feature is available for subscribed users only. Please subscribe to access this functionality.</p>
      </div>
    );
  }
  return children;
}
