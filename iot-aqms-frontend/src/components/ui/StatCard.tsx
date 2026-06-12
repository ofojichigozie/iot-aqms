import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  accent = 'border-green-400',
}: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border-l-4 ${accent} shadow-sm p-4 sm:p-5 flex items-center gap-4`}
    >
      <div className="text-2xl sm:text-3xl shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wide truncate">{label}</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
}
