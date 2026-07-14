import { createContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = useCallback(async () => {
    try {
      const res = await axiosInstance.get("users/me/");
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 1. ініціалізація при старті app
  useEffect(() => {
    const token = localStorage.getItem("access");

    if (token) {
      getUser();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [getUser]);

  // 2. універсальний login refresh (використовуєш після login)
  const loginUser = async () => {
    const token = localStorage.getItem("access");

    if (token) {
      await getUser();
    }
  };

  // 3. logout
  const logout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");

      await axiosInstance.post("/logout/", {
        refresh,
      });
    } catch (err) {
      console.log("Logout error", err);
    }

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setUser(null);

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        getUser,
        loginUser,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};