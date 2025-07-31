import React, { useState, useEffect } from "react";
import "./App.css";
import { AuthProvider } from "./authContext";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import GamePage from "./pages/GamePage";
import HistoryPage from "./pages/HistoryPage";
import LeaderboardPage from "./pages/LeaderboardPage";

// Simple client-side SPA router using hash routes
function getRoute() {
  const route = window.location.hash.replace(/^#\//, "") || "game";
  return route;
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    function onHashChange() {
      setRoute(getRoute());
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  let Content;
  if (route === "login" || route === "register") {
    Content = <AuthPage />;
  } else if (route === "history") {
    Content = <HistoryPage />;
  } else if (route === "leaderboard") {
    Content = <LeaderboardPage />;
  } else {
    Content = <GamePage />;
  }

  return (
    <AuthProvider>
      <Layout
        theme={theme}
        toggleTheme={toggleTheme}
      >
        {Content}
      </Layout>
    </AuthProvider>
  );
}

export default App;
