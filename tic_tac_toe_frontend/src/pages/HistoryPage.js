import React, { useEffect, useState } from "react";
import { useAuth } from "../authContext";
import * as api from "../api";

export default function HistoryPage() {
  const { token, user } = useAuth();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    api.getGameHistory(token).then(setHistory).catch(e => setError(e.message));
  }, [token]);

  if (!user) {
    return (
      <div style={{ margin: "2em auto", textAlign: "center" }}>
        <h3>Please sign in to view game history.</h3>
        <a href="#/login" style={{ color: "#1976d2" }}>Sign In</a>
      </div>
    );
  }

  return (
    <div>
      <h2>Game History</h2>
      {error && <div style={{ color: "#d32f2f" }}>{error}</div>}
      {!history.length && (
        <span style={{ color: "#888" }}>No games played yet.</span>
      )}
      <ul style={{ padding: 0, listStyle: "none", marginTop: 24 }}>
        {history.map((g, ix) =>
          <li key={g.game_id}
            style={{
              border: "1px solid #ececec",
              borderRadius: 10,
              background: "#fff",
              marginBottom: 15,
              padding: 12,
              lineHeight: 1.7,
              boxShadow: "0 2px 10px rgba(20,40,50,0.05)"
            }}
          >
            <b>{g.player_x} vs {g.player_o}</b>
            {" | "} {g.winner ?
              (g.winner === "draw" ? "Draw" : `Winner: ${g.winner}`) :
              (g.status === "in_progress" ? "In progress" : "")
            }
            <br />
            <span style={{ color: "#666", fontSize: "90%" }}>
              {formatDate(g.started_at)}{" "}
              {g.finished_at && "→ " + formatDate(g.finished_at)}
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}
function formatDate(str) {
  if (!str) return "";
  const d = new Date(str);
  if (isNaN(d)) return str;
  return d.toLocaleString();
}
