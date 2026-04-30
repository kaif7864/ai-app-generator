import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { pool, initDB, createDynamicTable } from './db.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase Admin (for verification)
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

app.use(cors());
app.use(express.json());

// ============================================
// SUPABASE AUTH MIDDLEWARE
// ============================================
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) throw error;
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid Supabase Session" });
  }
};

// AI Mock Data Generator
app.post('/api/system/fill-mock-data', authenticateToken, async (req: any, res) => {
  const { database } = req.body;
  const userId = req.user.id;
  
  if (!database?.tables || !Array.isArray(database.tables)) {
    return res.status(400).json({ error: "No tables found." });
  }

  try {
    for (const table of database.tables) {
      const recordsCount = 5;
      for (let i = 0; i < recordsCount; i++) {
        const data: any = {};
        table.fields.forEach((f: any) => {
          if (f.type === 'number') {
            data[f.name] = Math.floor(Math.random() * 1000) + 1;
          } else {
            const mocks: any = {
              name: ['Product A', 'Product B', 'Product C'],
              title: ['Task 1', 'Task 2', 'Task 3'],
              status: ['Active', 'Pending', 'Closed'],
              customer: ['Customer X', 'Customer Y', 'Customer Z']
            };
            const list = mocks[f.name.toLowerCase()] || ['Demo Data'];
            data[f.name] = list[i % list.length];
          }
        });

        const columns = ['user_id', ...Object.keys(data)];
        const values = [userId, ...Object.values(data)];
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        await pool.query(`INSERT INTO "${table.name}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${placeholders})`, values);
      }
    }
    res.json({ message: "AI Populated with Supabase IDs" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/system/generate', authenticateToken, async (req, res) => {
  const { database } = req.body;
  try {
    if (database?.tables) {
      for (const table of database.tables) {
        await createDynamicTable(table.name, table.fields);
      }
    }
    res.json({ message: "Infrastructure Ready" });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// Generic CRUD
app.post('/api/data/:table', authenticateToken, async (req: any, res) => {
  const { table } = req.params;
  const data = req.body;
  const userId = req.user.id;
  try {
    const columns = ['user_id', ...Object.keys(data)];
    const values = [userId, ...Object.values(data)];
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO "${table}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${placeholders}) RETURNING *`;
    const result = await pool.query(query, values);
    res.status(201).json({ record: result.rows[0] });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.get('/api/data/:table', authenticateToken, async (req: any, res) => {
  const { table } = req.params;
  const userId = req.user.id;
  try {
    const result = await pool.query(`SELECT * FROM "${table}" WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);
    res.json({ records: result.rows });
  } catch (err: any) { res.json({ records: [] }); }
});

initDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 AI Engine with Supabase Auth Live on ${PORT}`));
});
