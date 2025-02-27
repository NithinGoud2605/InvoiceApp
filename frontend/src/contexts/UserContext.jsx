// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getMe } from '../services/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const userData = await getMe();
      setUser(userData.user); // adjust if your API returns { user: ... }
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
