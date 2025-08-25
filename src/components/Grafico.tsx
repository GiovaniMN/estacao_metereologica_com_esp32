import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
  { time: "10:00", temp: 24 },
  { time: "10:10", temp: 25 },
  { time: "10:20", temp: 26 },
  { time: "10:30", temp: 27 },
];

export default function TemperatureChart() {
  return (
    <div className="glass-card p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Temperatura em Tempo Real</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis unit="°C" />
          <Tooltip />
          <Line type="monotone" dataKey="temp" stroke="#ff7300" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}