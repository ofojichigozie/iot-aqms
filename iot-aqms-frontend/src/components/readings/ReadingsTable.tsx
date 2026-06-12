import { Reading } from '../../types';
import Badge from '../ui/Badge';

interface ReadingsTableProps {
  readings: Reading[];
  onDelete?: (id: string) => void;
}

export default function ReadingsTable({ readings, onDelete }: ReadingsTableProps) {
  if (readings.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-sm">No readings recorded yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-50 text-green-800 text-left text-xs uppercase tracking-wide">
              <th className="px-4 py-3 font-semibold">Device</th>
              <th className="px-4 py-3 font-semibold">Sensor Value</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Timestamp</th>
              {onDelete && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {readings.map((reading) => (
              <tr key={reading._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{reading.deviceId}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">{reading.sensorValue}</td>
                <td className="px-4 py-3">
                  <Badge status={reading.airQualityStatus} />
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(reading.timestamp).toLocaleString()}
                </td>
                {onDelete && (
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onDelete(reading._id)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <ul className="sm:hidden divide-y divide-gray-50">
        {readings.map((reading) => (
          <li key={reading._id} className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-800">{reading.sensorValue}</span>
                <Badge status={reading.airQualityStatus} />
              </div>
              <p className="text-xs font-mono text-gray-400 truncate">{reading.deviceId}</p>
              <p className="text-xs text-gray-400">
                {new Date(reading.timestamp).toLocaleString()}
              </p>
            </div>
            {onDelete && (
              <button
                onClick={() => onDelete(reading._id)}
                className="text-xs text-red-400 hover:text-red-600 shrink-0 transition-colors"
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
