export default function Navbar({
  page,
  setPage,
  onLogout,
  dark,
  toggleDark,
}) {
  return (
    <div
      className="card"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <b style={{ fontSize: 16 }}>🏠 Room Tasks</b>

      <div style={{ display: "flex", gap: 8 }}>
        <NavBtn
          active={page === "assignment"}
          onClick={() => setPage("assignment")}
        >
          Assign
        </NavBtn>

        <NavBtn
          active={page === "history"}
          onClick={() => setPage("history")}
        >
          History
        </NavBtn>

        <NavBtn onClick={toggleDark}>
          {dark ? "☀️ Light" : "🌙 Dark"}
        </NavBtn>

        <NavBtn danger onClick={onLogout}>
          Logout
        </NavBtn>
      </div>
    </div>
  );
}

function NavBtn({ children, onClick, active, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: danger
          ? "var(--danger)"
          : active
          ? "var(--accent-soft)"
          : "transparent",

        color: danger
          ? "#3b2f2f"
          : active
          ? "var(--accent)"
          : "var(--text)",

        border: "1px solid var(--border)",
        padding: "6px 12px",
        borderRadius: 8,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
