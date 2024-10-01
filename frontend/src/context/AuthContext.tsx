import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

interface AuthContextType {
  user: any;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthContextProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

const apiUrl =
  window.location.hostname === "localhost"
    ? "http://localhost:8000/api"
    : process.env.REACT_APP_BACKEND_URL;

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedAccessToken = sessionStorage.getItem("accessToken");
    if (storedUser && storedAccessToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signup = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post(apiUrl + "/auth/register/", {
        username,
        email,
        password,
      });
      sessionStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Signup error:", error.response?.data);
      } else {
        console.error("Signup error:", error);
      }
      throw error;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(apiUrl + "/auth/login/", {
        username,
        password,
      });
      sessionStorage.setItem("accessToken", response.data.access);
      sessionStorage.setItem("refreshToken", response.data.refresh);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
