import { createContext, useContext, useEffect, useState } from 'react';
import { pb } from '../services/pocketbase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    if (pb.authStore.isValid) {
      setUser(pb.authStore.model);
    }

    // Listen for auth changes
    const unsub = pb.authStore.onChange(() => {
      setUser(pb.authStore.isValid ? pb.authStore.model : null);
    });

    // Stop loading after first check
    setLoading(false);

    return () => unsub();
  }, []);

  const login = async (email, password) => {
    await pb.collection('users').authWithPassword(email, password);
  };

  const register = async (email, password, fullName, username) => {
    await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      fullName,
      username,
    });
    await login(email, password);
  };

  const logout = () => {
    pb.authStore.clear();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);