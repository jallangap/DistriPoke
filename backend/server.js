const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// --- Middleware ---
// Enable CORS for all routes, allowing frontend to connect
app.use(cors());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// --- Database Setup ---
// This will create a file named 'pokedex.db' in the same folder
const db = new sqlite3.Database('./pokedex.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Create the table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS searches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      term TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating table', err.message);
      } else {
        console.log('Search history table is ready.');
      }
    });
  }
});

// --- API Endpoints ---

// 1. Login Endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Check for the hardcoded credentials
  if (username === 'admin' && password === '12345') {
    res.status(200).json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// 2. Search Logging Endpoint
app.post('/api/search', (req, res) => {
  const { term } = req.body;

  if (!term) {
    return res.status(400).json({ success: false, message: 'Search term is required' });
  }

  // Insert the search term into the database
  const sql = `INSERT INTO searches (term) VALUES (?)`;
  db.run(sql, [term], function(err) {
    if (err) {
      console.error('Error inserting search term', err.message);
      return res.status(500).json({ success: false, message: 'Failed to log search' });
    }
    console.log(`Logged search term: ${term}`);
    res.status(201).json({ success: true, message: 'Search logged', id: this.lastID });
  });
});

// 3. Get Search History Endpoint (NEW)
app.get('/api/history', (req, res) => {
  // Get the last 20 search terms, most recent first
  const sql = `SELECT term, timestamp FROM searches ORDER BY timestamp DESC LIMIT 20`;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error querying search history', err.message);
      return res.status(500).json({ success: false, message: 'Failed to retrieve history' });
    }
    res.status(200).json({ success: true, history: rows });
  });
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

