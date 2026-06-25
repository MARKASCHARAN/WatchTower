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

export const initializeDatabase = async () => {
  try {
    const client = await pgPool.connect();
    
    // Create necessary tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS incidents (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        state VARCHAR(50) NOT NULL,
        context JSONB,
        ai_analysis TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Connected to PostgreSQL and schema initialized');
    client.release();
  } catch (err) {
    console.error('Failed to connect to PostgreSQL:', err);
  }
};
