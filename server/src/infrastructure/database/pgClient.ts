import { Pool } from 'pg';
import { env } from '../../config/env';

export const pgPool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  max: 20, // Max number of connections in pool
  idleTimeoutMillis: 30000,
});

pgPool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

export const checkDbConnection = async () => {
  try {
    const client = await pgPool.connect();
    console.log('✅ Connected to PostgreSQL');
    client.release();
  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL:', err);
  }
};
