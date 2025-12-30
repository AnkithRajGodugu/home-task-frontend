import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function calculateDailyFairness(dayRecords) {
  const count = {};

  dayRecords.forEach(item => {
    Object.values(item.assignments || {}).forEach(persons => {
      persons.split(" & ").forEach(name => {
        count[name] = (count[name] || 0) + 1;
      });
    });
  });

  const values = Object.values(count);
  if (values.length < 2) return 0;

  return Math.max(...values) - Math.min(...values);
}

export default function FairnessTrend({ history }) {
  // group by date
  const byDate = history.reduce((acc, item) => {
    acc[item.date] = acc[item.date] || [];
    acc[item.date].push(item);
    return acc;
  }, {});

  const data = Object.entries(byDate)
    .slice(-7) // last 7 days
    .map(([date, records]) => ({
      date,
      fairness: calculateDailyFairness(records),
    }));

  if (data.length < 2) return null;

  return (
    <div className="card">
      <h3>📈 Fairness Trend (Last 7 Days)</h3>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="fairness"
            stroke="var(--fair)"
            strokeWidth={3}
            dot={{ r: 4 }}
            isAnimationActive
            animationDuration={700}
          />
        </LineChart>
      </ResponsiveContainer>

      <p style={{ fontSize: 13, color: "var(--muted-text)", marginTop: 6 }}>
        Lower values indicate better task balance.
      </p>
    </div>
  );
}
