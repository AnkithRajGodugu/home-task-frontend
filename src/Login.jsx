import { useState } from "react";
import { loginUser } from "./api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ username, password });

      localStorage.setItem("token", res.data.token);
      setMsg("Login successful");

      // 🔥 THIS SWITCHES PAGE
      onLogin();
    } catch {
      setMsg("Login failed");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
      <p>{msg}</p>
    </form>
  );
}
