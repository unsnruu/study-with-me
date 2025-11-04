import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const setupDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS weekly_goals (
        user_id VARCHAR(255) NOT NULL,
        guild_id VARCHAR(255) NOT NULL,
        goal TEXT NOT NULL,
        PRIMARY KEY (user_id, guild_id)
      );
    `);
    console.log('Table "weekly_goals" created or already exists.');
  } catch (err) {
    console.error('Error creating table', err);
  } finally {
    client.release();
    pool.end();
  }
};

setupDatabase();
