import { Client } from 'pg';

// PostgreSQL connection string
const connectionString = 'postgresql://postgres:mysecretpassword@172.17.0.2:5432/postgres';

// Create a new client
const client = new Client({
  connectionString,
});

async function connectAndQuery() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Example query
    const res = await client.query('SELECT NOW()');
    console.log('Server time:', res.rows[0]);

  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await client.end();
    console.log('Connection closed');
  }
}

connectAndQuery();