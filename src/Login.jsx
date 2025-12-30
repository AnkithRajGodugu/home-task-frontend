import { useState } from "react";
import { loginUser } from "./api";


function TeamWorkAnimation() {
  return (
    <svg width="260" height="260" viewBox="0 0 260 260" fill="none">
      {/* Central task */}
      <circle cx="130" cy="130" r="26" fill="#86C49A">
        <animate
          attributeName="r"
          values="24;28;24"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {[
        [130, 30, "1.8s"],
        [220, 80, "2s"],
        [220, 180, "1.7s"],
        [130, 230, "2.1s"],
        [40, 180, "1.9s"],
        [40, 80, "2.2s"],
      ].map(([x, y, dur], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="10" fill="#A3BFFA">
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="0 -6"
              dur={dur}
              repeatCount="indefinite"
              direction="alternate"
            />
          </circle>

          <rect
            x={x - 8}
            y={y + 12}
            width="16"
            height="24"
            rx="8"
            fill="#C4B5FD"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="0 -6"
              dur={dur}
              repeatCount="indefinite"
              direction="alternate"
            />
          </rect>

          <line
            x1={x}
            y1={y + 36}
            x2={130}
            y2={130}
            stroke="#E2E8F0"
            strokeWidth="1"
          />
        </g>
      ))}
    </svg>
  );
}

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await loginUser({ username, password });
      localStorage.setItem("token", res.data.token);
      setMsg("Login successful");
      onLogin();
    } catch {
      setMsg("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: 16,
      }}
    >
      <div
        className="card"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          maxWidth: 760,
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* 🔐 LEFT — LOGIN FORM */}
        <form
          onSubmit={submit}
          style={{
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <h2 style={{ marginBottom: 6 }}>🔐 Login</h2>
          <p style={{ fontSize: 14, opacity: 0.8 }}>
            Welcome back. Please sign in.
          </p>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <div style={{ position: "relative" }}>
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    style={{
      paddingRight: 8,   // 👈 smaller than before
    }}
  />

  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: 5,
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      fontSize: 20,       // 👈 slightly smaller
      opacity: 1.2,
    }}
  >
              {showPassword ? "🤐" : "😌"}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {msg && (
            <p
              style={{
                textAlign: "center",
                color: msg.includes("successful")
                  ? "var(--success)"
                  : "var(--danger)",
              }}
            >
              {msg}
            </p>
          )}
        </form>

        {/* 🎨 RIGHT — TEAMWORK ANIMATION */}
        <div
          className="login-illustration"
          style={{
            background: "linear-gradient(135deg, #eef7f1, #f7fafc)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TeamWorkAnimation />
        </div>
      </div>

      {/* 📱 MOBILE */}
      <style>
        {`
          @media (max-width: 768px) {
            .login-illustration {
              display: none;
            }
            .card {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}
