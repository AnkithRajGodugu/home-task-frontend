import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function WeeklyStats({ history }) {
  const today = new Date();

  // 🔹 Filter last 7 days
  const last7Days = history.filter(item => {
    const d = new Date(item.date);
    const diff = (today - d) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  });

  const count = {};

  last7Days.forEach(item => {
    Object.values(item.assignments || {}).forEach(persons => {
      persons.split(" & ").forEach(name => {
        count[name] = (count[name] || 0) + 1;
      });
    });
  });

  const data = Object.entries(count).map(([name, value]) => ({
    name,
    work: value,
  }));

  if (data.length === 0) return null;

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <h3>📅 Weekly Work Stats</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="work" fill="#52c41a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
