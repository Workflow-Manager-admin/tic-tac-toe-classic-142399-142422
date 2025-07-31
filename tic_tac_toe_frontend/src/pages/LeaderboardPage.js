import React, { useEffect, useState } from "react";
import { useAuth } from "../authContext";
import * as api from "../api";

const PALETTE = {
  accent: "#ffeb3b",
  primary: "#1976d2",
};

export default function LeaderboardPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    api.getLeaderboard(token)
      .then(setUsers)
      .catch(e => setError(e.message));
  }, [token]);

  return (
    <div>
      <h2>Leaderboard</h2>
      {error && <div style={{ color: "#d32f2f" }}>{error}</div>}
      <table style={{
        width: "100%",
        minWidth: 340,
        marginTop: 18,
        borderCollapse: "separate",
        borderSpacing: 0,
        background: "#fff",
        borderRadius: 13,
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(20,40,50,0.05)"
      }}>
        <thead>
          <tr style={{ background: "#f5f9ff" }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Wins</th>
            <th style={thStyle}>Games</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, ix) =>
            <tr key={u.username} style={{ background: ix < 3 ? PALETTE.accent + "44" : "#fff" }}>
              <td style={tdStyle}>{ix + 1}</td>
              <td style={tdStyle}>{u.username}</td>
              <td style={tdStyle}>{u.wins}</td>
              <td style={tdStyle}>{u.games_played}</td>
            </tr>
          )}
          {!users.length && <tr><td colSpan={4} style={tdStyle}>No data.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
const thStyle = {
  padding: "7px 18px", fontWeight: 700, textAlign: "left", color: "#1976d2", fontSize: 16,
};
const tdStyle = {
  padding: "7px 18px", fontWeight: 500, fontSize: 15, color: "#424242"
};
