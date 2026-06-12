import { AirQualityStatus } from '../../types';

const config: Record<AirQualityStatus, { bg: string; text: string; dot: string }> = {
  Good: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  Moderate: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  Poor: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  Dangerous: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

interface BadgeProps {
  status: AirQualityStatus;
}

export default function Badge({ status }: BadgeProps) {
  const { bg, text, dot } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}
