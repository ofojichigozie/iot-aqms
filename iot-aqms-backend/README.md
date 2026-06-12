# AQMS Backend

REST API backend for the IoT Air Quality Monitoring System. Built with Node.js, Express, TypeScript, and MongoDB.

---

## Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)

---

## Setup

### 1. Install dependencies

```bash
cd iot-aqms-backend
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and set your `MONGODB_URI` and a strong `JWT_SECRET`.

### 3. Seed the admin account

```bash
npm run seed
```

This creates:
- **Email:** admin@aqms.com  
- **Password:** admin123

### 4. Start the development server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
npm start
```

---

## API Reference

### Auth

| Method | Endpoint         | Auth | Description        |
|--------|-----------------|------|--------------------|
| POST   | /api/auth/login | No   | Admin login        |

**Login body:**
```json
{
  "email": "admin@aqms.com",
  "password": "admin123"
}
```

**Response:**
```json
{ "token": "<JWT>" }
```

---

### IoT Device

| Method | Endpoint      | Auth | Description              |
|--------|--------------|------|--------------------------|
| POST   | /api/readings | No   | Submit a sensor reading  |

**Body:**
```json
{
  "deviceId": "NODEMCU-001",
  "sensorValue": 320
}
```

---

### Admin (requires `Authorization: Bearer <token>`)

| Method | Endpoint               | Description                |
|--------|------------------------|----------------------------|
| GET    | /api/readings          | All readings (latest first) |
| GET    | /api/readings/latest   | Most recent reading        |
| GET    | /api/readings/stats    | Aggregate statistics       |
| DELETE | /api/readings/:id      | Delete a reading by ID     |

**Stats response:**
```json
{
  "totalReadings": 500,
  "latestReading": { ... },
  "averageSensorValue": 212.45,
  "dangerousReadingsCount": 12
}
```

---

## Air Quality Classification

| Sensor Value | Status    |
|-------------|-----------|
| 0 – 150     | Good      |
| 151 – 300   | Moderate  |
| 301 – 500   | Poor      |
| > 500       | Dangerous |

---

## Project Structure

```
src/
├── config/         # Database connection
├── controllers/    # Route handler functions
├── middleware/     # Auth, error, validation middleware
├── models/         # Mongoose schemas
├── routes/         # Express routers
├── services/       # Business logic
├── utils/          # Air quality classifier
├── seeders/        # Admin seeder script
├── app.ts          # Express app setup
└── server.ts       # Entry point
```
