const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// --- Database Connection Configuration ---
// DATABASE_URL is set by Render (production) or Docker Compose (local development)
const databaseUrl = process.env.DATABASE_URL || 'postgres://user:password@db:5432/pokedexdb';

// Configuration for the PostgreSQL client Pool
const pool = new Pool({
  connectionString: databaseUrl,
  // CRITICAL FIX for connection errors:
  // 1. Production (Render) uses SSL, so we set 'rejectUnauthorized: false'.
  // 2. Local Docker setup does NOT use SSL, so we set 'ssl: false'.
  ssl: databaseUrl.includes('render.com') ? { 
    rejectUnauthorized: false 
  } : false
});

// Function to initialize the search history table
async function initializeDb() {
  try {
    const client = await pool.connect();
    
    // Create the search history table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS searches (
        id SERIAL PRIMARY KEY,
        term TEXT NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    client.release();
    console.log('PostgreSQL: Database connection successful.');
    console.log('PostgreSQL: Search history table is ready.');
  } catch (err) {
    console.error('PostgreSQL: Error initializing database table. Exiting.', err.message);
    // Exit if database connection/setup fails critically
    process.exit(1); 
  }
}

// Initialize the database connection and table
initializeDb();

// --- Middleware ---
app.use(cors());
app.use(express.json());

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
app.post('/api/search', async (req, res) => {
  const { term } = req.body;

  if (!term) {
    return res.status(400).json({ success: false, message: 'Search term is required' });
  }

  try {
    // Insert the search term into the database
    const sql = `INSERT INTO searches (term) VALUES ($1) RETURNING id`;
    const result = await pool.query(sql, [term]);
    
    console.log(`PostgreSQL: Logged search term: ${term}`);
    res.status(201).json({ success: true, message: 'Search logged', id: result.rows[0].id });
  } catch (err) {
    console.error('PostgreSQL: Error inserting search term.', err.message);
    return res.status(500).json({ success: false, message: 'Failed to log search' });
  }
});

// 3. Get Search History Endpoint
app.get('/api/history', async (req, res) => {
  try {
    // Get the last 20 search terms, most recent first
    const sql = `SELECT term, timestamp FROM searches ORDER BY timestamp DESC LIMIT 20`;
    const result = await pool.query(sql);

    res.status(200).json({ success: true, history: result.rows });
  } catch (err) {
    console.error('PostgreSQL: Error querying search history.', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve history' });
  }
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});