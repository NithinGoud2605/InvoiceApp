import React, { createContext, useState, useEffect } from 'react';
import { getMe } from '../services/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('⚠️ No token found. User is not logged in.');
        setUser(null);
        return;
      }

      console.log('🔍 Fetching user data...');
      const response = await getMe(token);

      if (response && response.user) {
        setUser(response.user);
        console.log('✅ User data loaded:', response.user);
      } else {
        console.warn('⚠️ No user data found in response:', response);
        setUser(null);
      }
    } catch (err) {
      console.error('❌ Error fetching user data:', err);
      setError(err.message || 'Failed to fetch user data');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
