import { Pool } from 'pg';

// Set up a connection pool (use your actual connection string)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = pool;
