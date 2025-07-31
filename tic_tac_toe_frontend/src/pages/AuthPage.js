import React, { useState } from "react";
import { useAuth } from "../authContext";

export default function AuthPage() {
  const [mode, setMode] = useState(
    window.location.hash === "#/register" ? "register" : "login"
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, register, user } = useAuth();

  React.useEffect(() => {
    if (user) window.location.hash = "#/";
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const username = e.target.username.value.trim();
    const password = e.target.password.value;
    try {
      if (mode === "login") {
        await login(username, password);
        window.location.hash = "#/";
      } else {
        await register(username, password);
        window.location.hash = "#/";
      }
    } catch (err) {
      setError(
        err?.message ||
        (err?.errors && Object.values(err.errors).join(" ")) ||
        "Authentication failed."
      );
    }
    setSubmitting(false);
  };

  return (
    <div style={{ maxWidth: 360, margin: "0 auto", width: "100%" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        {mode === "login" ? "Sign In" : "Register"}
      </h2>
      <form
        style={{
          display: "flex", flexDirection: "column", gap: 18,
          border: "1px solid #eee", borderRadius: 10, background: "#fff",
          padding: "28px"
        }}
        onSubmit={handleSubmit}
        autoComplete="on"
      >
        <input
          name="username"
          type="text"
          placeholder="Username"
          autoFocus
          required
          disabled={submitting}
          style={inputStyle}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          autoComplete="on"
          minLength={3}
          disabled={submitting}
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            ...inputStyle,
            background: "#1976d2",
            color: "#fff",
            fontWeight: 700,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting
            ? (mode === "login" ? "Signing In..." : "Registering...")
            : (mode === "login" ? "Sign In" : "Register")}
        </button>
        {error && (
          <div style={{ color: "#d32f2f", fontSize: 15, marginTop: -6 }}>
            {error}
          </div>
        )}
      </form>
      <p style={{ textAlign: "center", marginTop: 22, color: "#424242" }}>
        {mode === "login"
          ? <>
              New here?{" "}
              <a href="#/register" style={linkStyle} onClick={() => setMode("register")}>
                Register
              </a>
            </>
          : <>
              Already have an account?{" "}
              <a href="#/login" style={linkStyle} onClick={() => setMode("login")}>
                Sign In
              </a>
            </>
        }
      </p>
    </div>
  );
}
const inputStyle = {
  padding: "10px 15px",
  fontSize: 16,
  borderRadius: 6,
  border: "1px solid #bbb",
  outline: "none",
};
const linkStyle = {
  color: "#1976d2",
  fontWeight: 600,
  cursor: "pointer",
  textDecoration: "underline",
};
