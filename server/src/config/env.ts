import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT || 3000,
  
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  DB_USER: process.env.DB_USER || 'watchtower',
  DB_PASSWORD: process.env.DB_PASSWORD || 'watchtower_password',
  DB_NAME: process.env.DB_NAME || 'watchtower_db',
  
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),

  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
};
