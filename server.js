import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust this for production security
    methods: ["GET", "POST"]
  }
});

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

// --- SOCKET.IO HANDLING ---
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

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

  if (score <= 0) return res.json({ success: true, message: 'Score too low' });

  const stmt = db.prepare('INSERT INTO high_scores (name, score) VALUES (?, ?)');
  stmt.run(name, score, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    // BROADCAST UPDATE TO ALL CLIENTS
    io.emit('scoreUpdated');
    
    res.json({ success: true, id: this.lastID });
  });
  stmt.finalize();
});

// Catch-all: serve index.html for CSR
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server using httpServer instead of app.listen
httpServer.listen(PORT, () => {
  console.log(`Real-time server is running on port ${PORT}`);
});
