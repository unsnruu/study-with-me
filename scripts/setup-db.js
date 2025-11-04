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

    await client.query(`
      CREATE TABLE IF NOT EXISTS daily_goals (
        user_id VARCHAR(255) NOT NULL,
        guild_id VARCHAR(255) NOT NULL,
        goal1 TEXT NOT NULL,
        goal2 TEXT,
        goal3 TEXT,
        mood VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE,
        PRIMARY KEY (user_id, guild_id, created_at)
      );
    `);
    console.log('Table "daily_goals" created or already exists.');

  } catch (err) {
    console.error('Error creating/dropping table', err);
  } finally {
    client.release();
    pool.end();
  }
};

setupDatabase();
