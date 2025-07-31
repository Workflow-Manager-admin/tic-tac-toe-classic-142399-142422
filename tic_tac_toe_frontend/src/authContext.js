import React, { createContext, useContext, useState } from "react";
import * as api from "./api";

// Provides: user, token, login(), register(), logout()
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const val = window.localStorage.getItem("tictactoe-user");
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try {
      return window.localStorage.getItem("tictactoe-token") || null;
    } catch {
      return null;
    }
  });

  // PUBLIC_INTERFACE
  async function handleLogin(username, password) {
    const resp = await api.login(username, password);
    setUser({ username });
    // If backend provides JWT, store here
    if (resp.token) {
      setToken(resp.token);
      window.localStorage.setItem("tictactoe-token", resp.token);
    }
    window.localStorage.setItem("tictactoe-user", JSON.stringify({ username }));
    return true;
  }

  // PUBLIC_INTERFACE
  async function handleRegister(username, password) {
    await api.register(username, password);
    return handleLogin(username, password); // Auto-login after register
  }

  // PUBLIC_INTERFACE
  function handleLogout() {
    setUser(null);
    setToken(null);
    window.localStorage.removeItem("tictactoe-user");
    window.localStorage.removeItem("tictactoe-token");
    window.location.hash = "#/login";
  }

  return (
    <AuthContext.Provider value={{
      user, token,
      login: handleLogin,
      logout: handleLogout,
      register: handleRegister
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}
