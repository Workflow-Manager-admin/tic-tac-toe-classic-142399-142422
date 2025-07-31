import React, { useState } from "react";
import { useAuth } from "../authContext";
import * as api from "../api";

const PALETTE = {
  accent: "#ffeb3b",
  primary: "#1976d2",
};

function emptyBoard() {
  return [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
}

// PUBLIC_INTERFACE
export default function GamePage() {
  const { user, token } = useAuth();
  const [phase, setPhase] = useState("READY"); // READY | MATCHING | PLAYING | FINISHED
  const [error, setError] = useState("");
  const [opponent, setOpponent] = useState("");
  const [game, setGame] = useState(null);
  const [movePending, setMovePending] = useState(false);

  // Matchmaking UI
  if (!user) {
    return (
      <div style={{ margin: "2em auto", textAlign: "center" }}>
        <h3>Please sign in to play.</h3>
        <a href="#/login" style={{ color: "#1976d2" }}>Sign In</a>
      </div>
    );
  }

  async function handleVSPlayer(e) {
    e.preventDefault();
    setError(""); setPhase("MATCHING"); setGame(null);
    try {
      const res = await api.startGameVSPlayer(token, opponent);
      setGame({ ...res, id: res.id || res.game_id });
      setPhase("PLAYING");
    } catch (err) {
      setError(err.message || "Error finding opponent.");
      setPhase("READY");
    }
  }
  async function handleVSAI() {
    setError(""); setPhase("MATCHING"); setGame(null);
    try {
      const res = await api.startGameVSAI(token);
      setGame({ ...res, id: res.id || res.game_id });
      setPhase("PLAYING");
    } catch (err) {
      setError(err.message || "Failed to start game");
      setPhase("READY");
    }
  }

  async function handleMove(i, j) {
    if (!game || !game.board) return;
    if (movePending || game.status !== "in_progress" || game.board[i][j]) return;
    setMovePending(true);
    try {
      const updated = await api.makeMove(token, game.id, i, j);
      setGame({ ...game, ...updated });
    } catch (err) {
      setError("Move rejected: " + (err.message || "Unknown error"));
    }
    setMovePending(false);
  }

  function handleRematch() {
    setGame(null); setPhase("READY"); setOpponent("");
    setError("");
  }

  // UI PHASES
  if (phase === "READY" || phase === "MATCHING") {
    return (
      <div style={{ width: "100%", maxWidth: 430 }}>
        <h2 style={{ marginBottom: 28, textAlign: "center" }}>Start a new game</h2>
        <div style={{ marginBottom: 24, background: "#fafafa", border: "1px solid #eee", borderRadius: 10, padding: 18 }}>
          <form onSubmit={handleVSPlayer} style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <input
              style={{
                ...inputStyle,
                border: `1.5px solid ${PALETTE.primary}80`,
                width: 140,
              }}
              placeholder="Opponent username"
              value={opponent}
              onChange={e => setOpponent(e.target.value)}
              required
              disabled={phase === "MATCHING"}
            />
            <button
              type="submit"
              style={{
                ...inputStyle,
                background: PALETTE.primary,
                color: "#fff",
                border: "none",
                fontWeight: 700,
              }}
              disabled={phase === "MATCHING"}
            >
              Play vs User
            </button>
          </form>
          <hr style={{ margin: "18px 0" }} />
          <button
            style={{
              ...inputStyle,
              background: PALETTE.accent,
              color: "#000",
              fontWeight: 700,
              width: "100%",
              border: "none",
              marginBottom: 4,
            }}
            onClick={handleVSAI}
            disabled={phase === "MATCHING"}
          >
            Play vs AI
          </button>
        </div>
        {error && (
          <div style={{ color: "#d32f2f", fontSize: 15, marginBottom: 10 }}>
            {error}
          </div>
        )}
        {phase === "MATCHING" &&
          <div>
            Looking for opponent...
            <span className="App-logo" style={{ fontSize: 18, verticalAlign: "middle", marginLeft: 10, animation: "App-logo-spin 2s linear infinite" }}>⏳</span>
          </div>
        }
      </div>
    );
  }

  // Play board
  if (phase === "PLAYING" && game) {
    return (
      <div style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2 style={{ textAlign: "center" }}>Tic Tac Toe</h2>
        <Board
          board={game.board}
          moves={game.moves}
          onMove={handleMove}
          status={game.status}
          winner={game.winner}
          user={user}
          movePending={movePending}
        />
        {game.status === "finished" && (
          <div style={{ marginTop: 18 }}>
            <p style={{ fontSize: 18 }}>
              {game.winner === "draw" ? "It's a draw!" :
                (game.winner === user.username ? "You win! 🎉" :
                  `Winner: ${game.winner}`)}
            </p>
            <button
              style={{
                ...inputStyle,
                background: "#1976d2",
                color: "#fff",
                marginTop: 8,
                fontWeight: 700,
              }}
              onClick={handleRematch}
            >
              Rematch
            </button>
          </div>
        )}
        <button
          style={{
            ...inputStyle,
            background: "#fafafa",
            color: "#1976d2",
            marginTop: 10,
            fontWeight: 500,
            border: "1px solid #1976d2",
          }}
          onClick={handleRematch}
        >
          Back to Match
        </button>
      </div>
    );
  }
  return <div>Loading...</div>;
}

// PUBLIC_INTERFACE
export function Board({ board, onMove, status, winner, user, movePending }) {
  const [hoverCell, setHoverCell] = useState([-1, -1]);
  let nextMark = calcNextMark(board);
  return (
    <div
      style={{
        display: "inline-grid",
        gridTemplateColumns: "repeat(3, 72px)",
        gridTemplateRows: "repeat(3, 72px)",
        border: `2.5px solid ${PALETTE.primary}`,
        borderRadius: 16,
        margin: "16px auto 8px auto",
        background: "#fff",
      }}
    >
      {board.map((row, i) =>
        row.map((cell, j) => (
          <div
            key={i + "_" + j}
            style={{
              width: 72,
              height: 72,
              border: "1.2px solid #b1c3df",
              fontSize: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              cursor: cell || status !== "in_progress" || movePending ? "default" : "pointer",
              background:
                cell ? "#fff" :
                  status !== "in_progress" ? "#f8f8f8" :
                    (hoverCell[0] === i && hoverCell[1] === j) ? "#ffeb3b33" : "#fafbff",
              transition: "background 0.12s",
              userSelect: "none",
            }}
            onClick={() => {
              if (!cell && status === "in_progress" && !movePending) onMove(i, j);
            }}
            onMouseOver={() => setHoverCell([i, j])}
            onMouseOut={() => setHoverCell([-1, -1])}
          >
            {cell}
          </div>
        ))
      )}
    </div>
  );
}
function calcNextMark(board) {
  // 'X' goes first; count X's and O's
  let countX = 0, countO = 0;
  for (let r = 0; r < board.length; r++)
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] === "X") countX++;
      else if (board[r][c] === "O") countO++;
    }
  return countX > countO ? "O" : "X";
}

const inputStyle = {
  padding: "10px 15px",
  fontSize: 16,
  borderRadius: 8,
  border: "1px solid #bbb",
  outline: "none",
  margin: "0 .5em",
};
