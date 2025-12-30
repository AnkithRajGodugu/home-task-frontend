import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function WorkChart({ history }) {
  const count = {};

  history.forEach((item) => {
    Object.values(item.assignments || {}).forEach((persons) => {
      persons.split(" & ").forEach((name) => {
        count[name] = (count[name] || 0) + 1;
      });
    });
  });

  const data = Object.entries(count).map(([name, value]) => ({
    name,
    work: value,
  }));

  if (data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.work));
  const overworked = data.filter((d) => d.work === max).map((d) => d.name);

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <h3>📊 Work Distribution</h3>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--text)", fontSize: 12 }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "var(--muted-text)", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              boxShadow: "var(--shadow-soft)",
              color: "var(--text)",
            }}
          />

          <Bar
            dataKey="work"
            isAnimationActive
            animationDuration={700}
            animationEasing="ease-out"
            radius={[8, 8, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.work === max
                    ? "var(--danger)" // ⚠️ overworked
                    : "var(--fair)"   // ✅ balanced
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* ⚠️ Overworked notice */}
      {overworked.length > 0 && (
        <p
          style={{
            marginTop: 10,
            fontSize: 14,
            color: "var(--muted-text)",
          }}
        >
          ⚠️ <b>Overworked:</b> {overworked.join(", ")}
        </p>
      )}
    </div>
  );
}
