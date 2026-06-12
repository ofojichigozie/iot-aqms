import 'dotenv/config';
import Reading from '../models/reading.model';
import { classifyAirQuality } from '../utils/airQuality';

// Spread 50 readings across the last 7 days
const generateReadings = () => {
  const devices = ['NODEMCU-001', 'NODEMCU-002'];
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  return Array.from({ length: 50 }, (_, i) => {
    // Spread evenly over the last 7 days
    const timestamp = new Date(now - (sevenDaysMs / 50) * (50 - i));

    // Vary sensor values to produce a mix of all statuses
    let sensorValue: number;
    const bucket = i % 4;
    if (bucket === 0)
      sensorValue = Math.floor(Math.random() * 151); // Good:      0-150
    else if (bucket === 1)
      sensorValue = Math.floor(Math.random() * 150) + 151; // Moderate: 151-300
    else if (bucket === 2)
      sensorValue = Math.floor(Math.random() * 200) + 301; // Poor:     301-500
    else sensorValue = Math.floor(Math.random() * 300) + 501; // Dangerous: 501-800

    const deviceId = devices[i % devices.length];
    const airQualityStatus = classifyAirQuality(sensorValue);

    return { deviceId, sensorValue, airQualityStatus, timestamp };
  });
};

export const seedReadings = async (): Promise<void> => {
  const existing = await Reading.countDocuments();
  if (existing > 0) {
    console.log(`Readings already exist (${existing} records) — skipping.`);
    return;
  }

  const readings = generateReadings();
  await Reading.insertMany(readings);
  console.log(`Seeded ${readings.length} readings.`);
};
