import Reading, { IReading } from '../models/reading.model';
import { classifyAirQuality } from '../utils/airQuality';
import { AppError } from '../middleware/error.middleware';

interface CreateReadingInput {
  deviceId: string;
  sensorValue: number;
}

export const createReading = async (input: CreateReadingInput): Promise<IReading> => {
  const airQualityStatus = classifyAirQuality(input.sensorValue);

  const reading = await Reading.create({
    deviceId: input.deviceId,
    sensorValue: input.sensorValue,
    airQualityStatus,
    timestamp: new Date(),
  });

  return reading;
};

export const getAllReadings = async (limit = 100) => {
  return Reading.find().sort({ timestamp: -1 }).limit(limit).lean();
};

export const getLatestReading = async () => {
  const reading = await Reading.findOne().sort({ timestamp: -1 }).lean();
  if (!reading) throw new AppError('No readings found', 404);
  return reading;
};

export const getReadingStats = async () => {
  const [total, latest, aggResult] = await Promise.all([
    Reading.countDocuments(),
    Reading.findOne().sort({ timestamp: -1 }).lean(),
    Reading.aggregate([
      {
        $group: {
          _id: null,
          avgSensorValue: { $avg: '$sensorValue' },
          dangerousCount: {
            $sum: { $cond: [{ $eq: ['$airQualityStatus', 'Dangerous'] }, 1, 0] },
          },
        },
      },
    ]),
  ]);

  const stats = aggResult[0] ?? { avgSensorValue: 0, dangerousCount: 0 };

  return {
    totalReadings: total,
    latestReading: latest,
    averageSensorValue: parseFloat((stats.avgSensorValue as number).toFixed(2)),
    dangerousReadingsCount: stats.dangerousCount as number,
  };
};

export const deleteReading = async (id: string): Promise<void> => {
  const result = await Reading.findByIdAndDelete(id);
  if (!result) throw new AppError('Reading not found', 404);
};
