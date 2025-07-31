import React from "react";
import { useAuth } from "../authContext";

const NAVBAR_HEIGHT = 64;
// Color variables from request
const PALETTE = {
  accent: "#ffeb3b",
  primary: "#1976d2",
  secondary: "#424242",
};

export default function Layout({ theme, toggleTheme, children }) {
  const { user, logout } = useAuth();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "var(--bg-primary)",
      }}
    >
      <header
        style={{
          height: NAVBAR_HEIGHT,
          background: PALETTE.primary,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          padding: "0 36px",
          justifyContent: "space-between",
        }}
        className="navbar"
      >
        <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: "0.07em" }}>
            &#11036; Tic Tac Toe
          </span>
          <a href="#/" style={navLinkStyle}>Game</a>
          <a href="#/history" style={navLinkStyle}>History</a>
          <a href="#/leaderboard" style={navLinkStyle}>Leaderboard</a>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            className="theme-toggle"
            style={{
              background: theme === "light" ? PALETTE.secondary : PALETTE.primary,
              color: PALETTE.accent,
              fontWeight: 600,
              fontSize: 15,
            }}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: PALETTE.accent }}>Hi, <b>{user.username}</b></span>
              <button
                style={logoutBtnStyle}
                onClick={logout}
              >Logout</button>
            </div>
          ) : (
            <a href="#/login" style={navLinkStyle}>Login</a>
          )}
        </div>
      </header>
      <main
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-start",
          background: "var(--bg-primary)",
          transition: "background 0.2s",
        }}
      >
        <div
          className="layout-wrapper"
          style={{
            margin: "2rem 0",
            display: "flex",
            flexDirection: "row",
            width: "100%",
            maxWidth: 1200,
            minHeight: 550,
            borderRadius: 24,
            background: "var(--bg-secondary)",
            boxShadow: "0 2px 16px rgba(20,40,50,0.04)",
            overflow: "hidden",
          }}
        >
          {/* Left Panel */}
          <aside
            style={{
              width: 210,
              borderRight: `1px solid ${PALETTE.primary}30`,
              padding: "1.5rem 1.2rem",
              background: "var(--bg-primary)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
            className="side-panel"
          >
            <UserInfoPanel />
          </aside>
          {/* Main Content */}
          <section style={{
            flex: "1 1 0",
            minWidth: 0,
            padding: "2.4rem 2.2rem 2.4rem 2.2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "none",
          }}>
            {children}
          </section>
          {/* Right Panel */}
          <aside
            style={{
              width: 260,
              borderLeft: `1px solid ${PALETTE.secondary}22`,
              padding: "1.5rem 0.7rem",
              background: "var(--bg-primary)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
            className="side-panel"
          >
            <GameHistoryPreview />
          </aside>
        </div>
      </main>
      <footer
        style={{
          textAlign: "center",
          background: "var(--bg-primary)",
          color: "var(--text-secondary)",
          padding: "10px 0",
          fontSize: 13,
          borderTop: "1px solid #eee",
        }}
      >
        &copy; 2024 Tic Tac Toe. Built with React.
      </footer>
    </div>
  );
}
const navLinkStyle = {
  color: "#fff",
  fontSize: 16,
  padding: "0.3rem 0.7rem",
  borderRadius: 8,
  textDecoration: "none",
  fontWeight: 500,
};
const logoutBtnStyle = {
  background: "#fff",
  color: "#1976d2",
  border: "none",
  fontWeight: 600,
  borderRadius: "18px",
  padding: "4px 16px",
  fontSize: 13,
  cursor: "pointer",
};

// Left panel: user and stats (could expand if desired)
function UserInfoPanel() {
  const { user } = useAuth();
  return (
    <div>
      <h4 style={{ margin: "0 0 10px", fontSize: 17, color: "#424242" }}>
        Account
      </h4>
      {user
        ? (
          <div style={{ lineHeight: 1.6 }}>
            <b>{user.username}</b>
            <br />
            <span style={{ color: "#aaa", fontSize: 13 }}>Ready to play!</span>
          </div>
        )
        : (
          <div>
            <span style={{ color: "#aaa", fontSize: 15 }}>Not signed in.</span>
          </div>
        )
      }
    </div>
  );
}

// Right panel: game history preview
function GameHistoryPreview() {
  const { token } = useAuth();
  const [history, setHistory] = React.useState([]);

  React.useEffect(() => {
    if (token) {
      import("../api").then(api =>
        api.getGameHistory(token).then(setHistory).catch(() => {})
      );
    }
  }, [token]);

  if (!token || !history?.length) {
    return (
      <div>
        <h4 style={{ margin: "0 0 10px", fontSize: 17, color: "#424242" }}>Recent Games</h4>
        <span style={{ color: "#bbb", fontSize: 15 }}>No games yet.</span>
      </div>
    );
  }
  return (
    <div>
      <h4 style={{ margin: "0 0 10px", fontSize: 17, color: "#424242" }}>Recent Games</h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {history.slice(0, 6).map((g) => (
          <li key={g.game_id} style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }}>
              {g.player_x} vs {g.player_o}
            </span>
            <br />
            <span style={{ color: "#888", fontSize: 13 }}>
              {g.winner
                ? g.winner === "draw"
                  ? "Draw"
                  : `Winner: ${g.winner}`
                : (g.status === "in_progress" ? "In progress" : "")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
