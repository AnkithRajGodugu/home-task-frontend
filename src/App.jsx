import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Login from "./Login";
import Assignment from "./Assignment";
import History from "./History";
import Navbar from "./Navbar";

export default function App() {
  const [page, setPage] = useState("login");
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [dark, setDark] = useState(
    localStorage.getItem("dark") === "true"
  );

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("dark", dark);

    if (localStorage.getItem("token")) {
      setPage("assignment");
    }
  }, [dark]);

  const logout = () => {
    localStorage.clear();
    setPage("login");
  };

  if (page === "login") {
    return <Login onLogin={() => setPage("assignment")} />;
  }

  return (
    <div>
      <Navbar
        page={page}
        setPage={setPage}
        onLogout={logout}
        dark={dark}
        toggleDark={() => setDark((d) => !d)}
      />

      {/* 🎬 PAGE TRANSITIONS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {page === "assignment" && (
            <Assignment
              onAssigned={() => setRefreshHistory((n) => n + 1)}
            />
          )}

          {page === "history" && (
            <History refreshKey={refreshHistory} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
