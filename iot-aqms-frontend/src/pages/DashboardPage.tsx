import { useStats } from '../hooks/useStats';
import { useLatestReading } from '../hooks/useLatestReading';
import { useReadings } from '../hooks/useReadings';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useStats(30000);
  const { reading: latest, loading: latestLoading } = useLatestReading(15000);
  const { readings } = useReadings(20);

  // Format last 20 readings for the chart (oldest first)
  const chartData = [...readings].reverse().map((r) => ({
    time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: r.sensorValue,
  }));

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Page header */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Live air quality overview · auto-refreshes every 15 s
        </p>
      </div>

      {/* Stats grid */}
      {statsLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border-l-4 border-gray-100 shadow-sm p-4 sm:p-5 h-20 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Total Readings"
            value={stats?.totalReadings ?? '—'}
            icon="📊"
            accent="border-green-400"
          />
          <StatCard
            label="Avg Sensor Value"
            value={stats?.averageSensorValue ?? '—'}
            icon="📈"
            accent="border-blue-400"
          />
          <StatCard
            label="Dangerous"
            value={stats?.dangerousReadingsCount ?? '—'}
            icon="⚠️"
            accent="border-red-400"
          />
          <StatCard
            label="Latest Value"
            value={stats?.latestReading?.sensorValue ?? '—'}
            icon="🌡️"
            accent="border-yellow-400"
          />
        </div>
      )}

      {/* Current reading + chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Current air quality card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center text-center min-h-[180px]">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Current Status</p>
          {latestLoading ? (
            <div className="animate-pulse space-y-2 w-full flex flex-col items-center">
              <div className="h-12 w-24 bg-gray-100 rounded" />
              <div className="h-5 w-20 bg-gray-100 rounded-full" />
            </div>
          ) : latest ? (
            <>
              <div className="text-5xl sm:text-6xl font-bold text-gray-800 mb-2 tabular-nums">
                {latest.sensorValue}
              </div>
              <Badge status={latest.airQualityStatus} />
              <p className="text-xs text-gray-400 mt-3">
                {new Date(latest.timestamp).toLocaleString()}
              </p>
              <p className="text-xs font-mono text-gray-400 mt-0.5">{latest.deviceId}</p>
            </>
          ) : (
            <p className="text-gray-400 text-sm">No data yet</p>
          )}
        </div>

        {/* Trend chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            Sensor Trend (last 20 readings)
          </p>
          {chartData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No data to display</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={35} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #dcfce7' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#16a34a' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
