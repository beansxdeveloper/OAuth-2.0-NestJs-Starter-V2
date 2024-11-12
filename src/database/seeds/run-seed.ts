import { createConnection } from 'typeorm';
import { createInitialData } from './initial-data';

async function runSeed() {
  const connection = await createConnection();
  try {
    await createInitialData(connection);
    console.log('Seed data created successfully!');
  } catch (error) {
    console.error('Error creating seed data:', error);
  } finally {
    await connection.close();
  }
}

runSeed();