import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const defaultAuthContext = {
  user: null,
  token: null,
  loading: false,
  login: async () => {},
  logout: () => {},
};

const AuthContext = createContext(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || '/api/v1'}/auth/me`);
      setUser(res.data);
    } catch (err) {
      console.error(err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL || '/api/v1'}/auth/login`, { username, password });
    localStorage.setItem('token', res.data.access_token);
    setToken(res.data.access_token);
    setUser(res.data.user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
