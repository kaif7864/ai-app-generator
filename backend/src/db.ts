import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const initDB = async () => {
  try {
    // No longer need local users table as we use Supabase Auth
    console.log("✅ Database Engine Synced with Supabase Auth.");
  } catch (err) {
    console.error("DB Init failed:", err);
  }
};

export const createDynamicTable = async (tableName: string, fields: any[]) => {
  if (!fields || !Array.isArray(fields) || fields.length === 0) return;

  try {
    const columns = fields.map(f => {
      const type = f.type === 'number' ? 'NUMERIC' : 'TEXT';
      return `"${f.name}" ${type}`;
    }).join(', ');

    // Use TEXT for user_id to store Supabase UUIDs
    const query = `CREATE TABLE IF NOT EXISTS "${tableName}" (
      id SERIAL PRIMARY KEY,
      user_id TEXT, 
      ${columns},
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;
    
    await pool.query(query);
    console.log(`✅ Table Ready: ${tableName}`);
  } catch (err: any) {
    console.error(`❌ Table Creation Failed (${tableName}):`, err.message);
    throw new Error(`Failed to create table "${tableName}": ${err.message}`);
  }
};
