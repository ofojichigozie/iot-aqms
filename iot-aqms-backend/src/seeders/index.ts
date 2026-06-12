import 'dotenv/config';
import * as readline from 'readline';
import mongoose from 'mongoose';
import { seedAdmin } from './adminSeeder';
import { seedReadings } from './readingsSeeder';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const ask = (question: string): Promise<string> =>
  new Promise((resolve) => rl.question(question, resolve));

const menu = `
┌─────────────────────────────────┐
│       AQMS Database Seeder      │
├─────────────────────────────────┤
│  1  Seed admin account          │
│  2  Seed sample readings (50)   │
│  3  Seed everything             │
│  0  Exit                        │
└─────────────────────────────────┘
`;

const run = async () => {
  console.log(menu);
  const choice = (await ask('Select an option: ')).trim();

  if (choice === '0') {
    console.log('Exiting.');
    rl.close();
    return;
  }

  const seedAdminFlag = choice === '1' || choice === '3';
  const seedReadingsFlag = choice === '2' || choice === '3';

  if (!seedAdminFlag && !seedReadingsFlag) {
    console.log('Invalid option. Exiting.');
    rl.close();
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('\nConnected to MongoDB\n');

    if (seedAdminFlag) await seedAdmin();
    if (seedReadingsFlag) await seedReadings();

    console.log('\nDone!');
  } catch (err) {
    console.error('Seeder error:', err);
    process.exit(1);
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
};

run();
