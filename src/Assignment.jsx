import { useState } from "react";
import { assignTasks } from "./api";
import { motion, LayoutGroup } from "framer-motion";

const PEOPLE = [
  "Akash",
  "Varun",
  "Ankith",
  "Jaswanth",
  "Abbas",
  "Naveen",
];

export default function Assignment({ onAssigned }) {
  const [availability, setAvailability] = useState(
    Object.fromEntries(PEOPLE.map((p) => [p, false]))
  );
  const [shift, setShift] = useState("Morning");
  const [team, setTeam] = useState("A");

  const [result, setResult] = useState(null);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ success pulse trigger
  const [pulseKey, setPulseKey] = useState(0);

  const toggle = (name) => {
    setAvailability((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const submit = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await assignTasks(availability, shift, team);

      setResult(res.data);
      setLatest(res.data);

      setPulseKey((k) => k + 1); // 🔥 success pulse
      onAssigned();
    } catch {
      setError("Failed to assign tasks");
    } finally {
      setLoading(false);
    }
  };

  const isShared =
    result &&
    result.assignments &&
    new Set(Object.values(result.assignments)).size === 1;

  return (
    <div>
      {/* 🕒 Latest Assignment */}
      {latest && (
        <div className="card" style={{ marginBottom: 20 }}>
          <b>🕒 Latest Assignment</b>
          <br />
          {latest.date} {latest.time} | {latest.shift} | Team {latest.team}
        </div>
      )}

      <h2>Task Assignment</h2>

      {/* 🟦 DASHBOARD LAYOUT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "360px 1fr", // 👈 compact left, wide right
          gap: 20,
          marginBottom: 24,
          alignItems: "start",
        }}
      >
        {/* 🟦 SHIFT & TEAM (COMPACT) */}
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ marginBottom: 12 }}>Shift & Team</h3>

          <LayoutGroup>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <ToggleGroup
                label="Shift"
                value={shift}
                options={["Morning", "Night"]}
                onChange={setShift}
              />

              <ToggleGroup
                label="Team"
                value={team}
                options={["A", "B"]}
                onChange={setTeam}
              />
            </div>
          </LayoutGroup>
        </div>

        {/* 🟩 AVAILABILITY (3 PER ROW) */}
        <div className="card">
          <h3>Availability</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)", // ✅ EXACTLY 3 PER ROW
              gap: 12,
            }}
          >
            {PEOPLE.map((name) => {
              const isAvailable = availability[name];

              return (
                <motion.div
                  key={name}
                  className={`availability-card ${
                    isAvailable ? "active" : ""
                  }`}
                  onClick={() => toggle(name)}
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{
                    cursor: "pointer",
                    padding: "12px 10px",
                    textAlign: "center",
                    minHeight: 72,
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 600 }}>
                    {name}
                  </div>

                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 12,
                      color: isAvailable
                        ? "var(--fair)"
                        : "var(--muted-text)",
                    }}
                  >
                    {isAvailable ? "Available" : "Not Available"}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🟢 ACTION */}
      <button onClick={submit} disabled={loading}>
        {loading ? "Assigning..." : "Assign Tasks"}
      </button>

      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

      {/* 📋 RESULT — SUCCESS PULSE */}
      {result && result.assignments && (
        <motion.div
          key={pulseKey}
          className="card"
          style={{ marginTop: 20 }}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h3>
            Result{" "}
            {isShared && (
              <span
                style={{
                  marginLeft: 10,
                  background: "var(--fair)",
                  color: "#1c1917",
                  padding: "2px 8px",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              >
                Shared Work
              </span>
            )}
          </h3>

          {Object.entries(result.assignments).map(([role, person]) => {
            const icons = {
              COOKING: "🍳",
              CUTTING: "🔪",
              DISHES: "🧼",
              FOOD: "🛵",
              STATUS: "ℹ️",
            };

            return (
              <div key={role} style={{ marginBottom: 6 }}>
                <b>
                  {icons[role]} {role}
                </b>{" "}
                → {person}
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

/* 🔹 TOGGLE COMPONENT */
function ToggleGroup({ label, options, value, onChange }) {
  return (
    <div>
      <label style={{ fontWeight: 600 }}>{label}</label>

      <div
        style={{
          display: "flex",
          background: "var(--accent-soft)",
          borderRadius: 999,
          padding: 4,
          marginTop: 6,
          position: "relative",
        }}
      >
        {options.map((opt) => (
          <div
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              position: "relative",
              padding: "6px 16px",
              cursor: "pointer",
              fontWeight: 600,
              color: value === opt ? "var(--accent)" : "var(--text)",
            }}
          >
            {value === opt && (
              <motion.div
                layoutId={`${label}-underline`}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "var(--card-bg)",
                  borderRadius: 999,
                  zIndex: -1,
                  boxShadow: "var(--shadow-soft)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            )}
            {opt}
          </div>
        ))}
      </div>
    </div>
  );
}
  