import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;

app.use(cors());
app.use(express.json());

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

// --- DATABASE SETUP ---
const dbFile = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database.');
});

// Initialize table
db.run(`
  CREATE TABLE IF NOT EXISTS high_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// --- API ENDPOINTS ---

// GET: Fetch top 10 high scores
app.get('/api/scores', (req, res) => {
  db.all('SELECT name, score FROM high_scores ORDER BY score DESC LIMIT 10', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST: Add a new high score
app.post('/api/scores', (req, res) => {
  const { name, score } = req.body;
  if (!name || score === undefined) {
    return res.status(400).json({ error: 'Name and score are required' });
  }

  // Basic anti-cheat/limit: only save if score > 0
  if (score <= 0) return res.json({ success: true, message: 'Score too low' });

  const stmt = db.prepare('INSERT INTO high_scores (name, score) VALUES (?, ?)');
  stmt.run(name, score, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
  stmt.finalize();
});

// Catch-all: serve index.html for Client Side Routing (CSR)
// We use a middleware at the end to catch everything not handled by static or API
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
