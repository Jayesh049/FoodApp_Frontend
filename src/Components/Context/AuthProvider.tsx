import React, { useState, useEffect, useContext, type ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_V1 } from "../../utils/apiBase";
import { setCsrfToken, getAuthHeaders } from "../../utils/apiAuth";
import type { User } from "../../types/models";

export type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<unknown>;
  demoLogin: () => Promise<unknown>;
  signUp: (
    name: string,
    password: string,
    email: string,
    confirm: string
  ) => Promise<unknown>;
  logout: () => Promise<void>;
  resetPasswordEmail: string | null;
  setResetEmail: React.Dispatch<React.SetStateAction<string | null>>;
  otpPassEmail: string | null;
  setOtpPassEmail: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AuthContext = React.createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [resetPasswordEmail, setResetEmail] = useState<string | null>(null);
  const [otpPassEmail, setOtpPassEmail] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${API_V1}/auth/csrf`)
      .then((res) => {
        if (res.data && res.data.csrfToken) setCsrfToken(res.data.csrfToken);
      })
      .catch(() => {});
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn) {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("user");
      }
    }
  }, []);

  async function signUp(
    name: string,
    password: string,
    email: string,
    confirm: string
  ) {
    const res = await axios.post(`${API_V1}/auth/signup`, {
      name,
      password,
      confirmPassword: confirm,
      email,
    });
    return res.data;
  }

  async function login(email: string, password: string) {
    const res = await axios.post(`${API_V1}/auth/login`, {
      email,
      password,
    });
    setUser(res.data.user);
    setCsrfToken(res.data.csrfToken || "");
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data;
  }

  async function demoLogin() {
    const res = await axios.post(`${API_V1}/auth/demo`, {});
    setUser(res.data.user);
    setCsrfToken(res.data.csrfToken || "");
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data;
  }

  async function logout() {
    try {
      await axios.post(`${API_V1}/auth/logout`, {}, { headers: getAuthHeaders() });
    } catch {
      // Cookie may already be gone. Still clear local state.
    }
    Cookies.remove("csrf");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("user");
    setUser(null);
    setCsrfToken("");
  }

  const value: AuthContextValue = {
    user,
    login,
    demoLogin,
    signUp,
    logout,
    resetPasswordEmail,
    setResetEmail,
    otpPassEmail,
    setOtpPassEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
