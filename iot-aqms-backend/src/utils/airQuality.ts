import { AirQualityStatus } from '../models/reading.model';

/**
 * Classifies a raw MQ135 sensor value into an air quality status.
 *
 * Thresholds:
 *   0   – 150  => Good
 *   151 – 300  => Moderate
 *   301 – 500  => Poor
 *   > 500      => Dangerous
 */
export const classifyAirQuality = (value: number): AirQualityStatus => {
  if (value <= 150) return 'Good';
  if (value <= 300) return 'Moderate';
  if (value <= 500) return 'Poor';
  return 'Dangerous';
};
