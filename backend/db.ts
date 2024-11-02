import { Client } from 'pg';

export async function connectDb(client: Client) {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');
  } catch (error: any) {
    console.error('Connection error', error.stack);
  }
};

export async function disconnectDb(client: Client) {
  await client.end();
  console.log('Disconnected from PostgreSQL database');
};
