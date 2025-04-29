import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user on first visit
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile`, {
          withCredentials: true
        });
        
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/users`, userData, {
        withCredentials: true
      });
      
      setUser(res.data);
      setIsAuthenticated(true);
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
        email,
        password
      }, {
        withCredentials: true
      });
      
      setUser(res.data);
      setIsAuthenticated(true);
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed'
      };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/logout`, {}, {
        withCredentials: true
      });
      
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Update profile
  const updateProfile = async (userData) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/users/profile`, userData, {
        withCredentials: true
      });
      
      setUser(res.data);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Profile update failed'
      };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      register,
      login,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;