import { useReadings } from '../hooks/useReadings';
import ReadingsTable from '../components/readings/ReadingsTable';

export default function ReadingsPage() {
  const { readings, loading, error, refetch, remove } = useReadings(100);

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Readings</h1>
          <p className="text-sm text-gray-500">
            {loading ? 'Loading…' : `${readings.length} records · latest first`}
          </p>
        </div>
        <button
          onClick={() => void refetch()}
          disabled={loading}
          className="shrink-0 text-sm text-green-600 hover:text-green-800 disabled:text-gray-400 font-medium transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && <ReadingsTable readings={readings} onDelete={remove} />}
    </div>
  );
}
