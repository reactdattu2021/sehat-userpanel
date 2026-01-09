// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { LoginApi, SignupApi, LogoutApi } from "../apis/authapis";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // SIGNUP
  const signup = async (userData) => {
    try {
      const response = await SignupApi(userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Signup failed",
      };
    }
  };

  // LOGIN
  const login = async (email, password) => {
    try {
      const response = await LoginApi({ email, password });
      const data = response.data;

      // Save token
      localStorage.setItem("authToken", data.JWTtoken);

      // Save user data
      const userData = {
        userId: data.userID,
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        role: data.role,
        phone: data.phone,
      };
      localStorage.setItem("userData", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  // GOOGLE LOGIN CALLBACK
  const handleGoogleCallback = (token, userData) => {
    // Save token
    localStorage.setItem("authToken", token);

    // Save user data
    localStorage.setItem("userData", JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
  };


  // LOGOUT
  const logout = async () => {
    try {
      // Call backend logout API first
      await LogoutApi();

      // Only clear frontend state after backend confirms success
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      setUser(null);
      setIsAuthenticated(false);

      return { success: true };
    } catch (error) {
      // If backend logout fails, still clear frontend for security
      // But you can show an error message to user
      console.error("Logout API failed:", error);

      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      setUser(null);
      setIsAuthenticated(false);

      return {
        success: false,
        error: error.response?.data?.message || "Logout failed on server",
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    signup,
    login,
    handleGoogleCallback,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
