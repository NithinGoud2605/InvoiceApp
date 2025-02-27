// src/components/TestUserAPI.jsx
import React, { useEffect, useState } from 'react';
import { getMe } from '../services/api';

export default function TestUserAPI() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUser();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>Loading...</div>;

  return (
    <div>
      <h3>User Data:</h3>
      <pre>{JSON.stringify(userData, null, 2)}</pre>
    </div>
  );
}
