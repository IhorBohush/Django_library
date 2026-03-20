import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const res = await axiosInstance.get("users/me/");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("access")) {
      getUser();
    }
  }, []);

  const logout = async () => {
    try {
        const refresh = localStorage.getItem("refresh");

        await axiosInstance.post("logout/", {
        refresh: refresh
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
    <AuthContext.Provider value={{ user, getUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};