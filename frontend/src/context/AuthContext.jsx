import React, { createContext, useContext, useEffect, useState } from "react";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser
} from "../services/authService";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();

        if (response.success) {
          setUser(response.user);
        }
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (userData) => {
    const response = await registerUser(userData);

    if (response.success) {
      setUser(response.user);
    }

    return response;
  };

  const login = async (userData) => {
    const response = await loginUser(userData);

    if (response.success) {
      setUser(response.user);
    }

    return response;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export {
  AuthProvider,
  useAuth
};