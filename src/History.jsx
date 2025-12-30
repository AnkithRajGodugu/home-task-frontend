import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "./api";
import WeeklyStats from "./WeeklyStats";
import WorkChart from "./WorkChart";
import FairnessTrend from "./FairnessTrend";

/* 🔹 FAIRNESS CALCULATOR */
function calculateFairness(history) {
  const count = {};

  history.forEach((item) => {
    Object.values(item.assignments || {}).forEach((persons) => {
      persons.split(" & ").forEach((name) => {
        count[name] = (count[name] || 0) + 1;
      });
    });
  });

  const values = Object.values(count);
  if (values.length < 2) return 0;

  return Math.max(...values) - Math.min(...values);
}

export default function History({ refreshKey }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [fairnessDelta, setFairnessDelta] = useState(null); // ✅ FIX

  useEffect(() => {
    api
      .get("/api/tasks/history")
      .then((res) => {
        const newData = res.data;

        // ✅ Compare only when new assignment is added
        if (data.length > 0 && newData.length > data.length) {
          const prevFairness = calculateFairness(data);
          const newFairness = calculateFairness(newData);

          if (newFairness < prevFairness) {
            setFairnessDelta("improved");
          } else if (newFairness > prevFairness) {
            setFairnessDelta("worsened");
          } else {
            setFairnessDelta(null);
          }
        }

        setData(newData);
      })
      .catch(() => setError("Failed to load history"));
  }, [refreshKey]); // intentionally NOT depending on data

  if (error) {
    return <p style={{ color: "var(--danger)" }}>{error}</p>;
  }

  if (data.length === 0) {
    return <p>No history available</p>;
  }

  // 🔹 GROUP BY DATE
  const grouped = data.reduce((acc, item) => {
    acc[item.date] = acc[item.date] || [];
    acc[item.date].push(item);
    return acc;
  }, {});

  return (
    <div>
      <h2>Assignment History</h2>

      {/* ⚖️ FAIRNESS FEEDBACK */}
      {fairnessDelta && (
        <motion.div
          className="card"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            marginBottom: 16,
            background:
              fairnessDelta === "improved"
                ? "var(--fair-soft)"
                : "var(--danger-soft)",
            color:
              fairnessDelta === "improved"
                ? "var(--fair)"
                : "var(--danger)",
            fontWeight: 600,
          }}
        >
          {fairnessDelta === "improved" && "⚖️ Fairness Improved"}
          {fairnessDelta === "worsened" && "⚠️ Imbalance Increased"}
        </motion.div>
      )}

      {/* 📊 STATS & CHARTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <WeeklyStats history={data} />
        <WorkChart history={data} />
      </div>
      <FairnessTrend history={data} />


      {/* 📅 HISTORY RECORDS */}
      {Object.entries(grouped).map(([date, records]) => (
        <div key={date} style={{ marginBottom: 25 }}>
          <h3>📅 {date}</h3>

          {records.map((item, index) => {
            const isShared =
              item.assignments &&
              new Set(Object.values(item.assignments)).size === 1;

            return (
              <motion.div
                key={item.id}
                className="card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.05,
                }}
                style={{ marginBottom: 12 }}
              >
                <b>Time:</b> {item.time} <br />
                <b>Shift:</b> {item.shift} <br />
                <b>Team:</b> {item.team}{" "}
                {isShared && (
                  <span
                    style={{
                      marginLeft: 8,
                      background: "var(--fair)",
                      color: "#1c1917",
                      padding: "2px 8px",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  >
                    Shared
                  </span>
                )}

                <ul style={{ marginTop: 8 }}>
                  {Object.entries(item.assignments).map(([k, v]) => (
                    <li key={k}>
                      <b>{k}</b> → {v}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
