import { Schema, model, Document } from 'mongoose';

export type AirQualityStatus = 'Good' | 'Moderate' | 'Poor' | 'Dangerous';

export interface IReading extends Document {
  deviceId: string;
  sensorValue: number;
  airQualityStatus: AirQualityStatus;
  timestamp: Date;
  createdAt: Date;
}

const readingSchema = new Schema<IReading>(
  {
    deviceId: {
      type: String,
      required: true,
      trim: true,
    },
    sensorValue: {
      type: Number,
      required: true,
      min: 0,
    },
    airQualityStatus: {
      type: String,
      enum: ['Good', 'Moderate', 'Poor', 'Dangerous'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for efficient latest/stats queries
readingSchema.index({ timestamp: -1 });
readingSchema.index({ deviceId: 1, timestamp: -1 });

const Reading = model<IReading>('Reading', readingSchema);

export default Reading;
