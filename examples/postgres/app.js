#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const { Pool } = require('pg');

const APP_PORT = process.env.APP_PORT || 3000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;
const DB_USER = process.env.DB_USER || 'appuser';
const DB_NAME = process.env.DB_NAME || 'appdb';

let pool;

// Read secret from file (updated by DSO during rotation)
function readDatabasePassword() {
  try {
    const passwordFile = process.env.DB_PASSWORD_FILE || '/tmp/db_password';
    return fs.readFileSync(passwordFile, 'utf8').trim();
  } catch (error) {
    console.error('Failed to read database password:', error.message);
    return null;
  }
}

// Initialize connection pool
function initializePool() {
  const password = readDatabasePassword();
  if (!password) {
    throw new Error('Database password not found');
  }

  if (pool) {
    pool.end();
  }

  pool = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: password,
    database: DB_NAME,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    initializePool(); // Restart pool on error
  });

  console.log('[APP] Database connection pool initialized');
}

// HTTP server
const server = http.createServer(async (req, res) => {
  // Health check endpoint
  if (req.url === '/health') {
    try {
      const result = await pool.query('SELECT 1');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString(),
      }));
      console.log('[APP] Health check passed');
    } catch (error) {
      console.error('[APP] Health check failed:', error.message);
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'unhealthy',
        error: error.message,
      }));
    }
    return;
  }

  // Status endpoint: Check database connection
  if (req.url === '/status') {
    try {
      const result = await pool.query('SELECT current_user, NOW() as time');
      const row = result.rows[0];
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'connected',
        database_user: row.current_user,
        server_time: row.time,
        timestamp: new Date().toISOString(),
      }));
      console.log(`[APP] Status: Connected as ${row.current_user}`);
    } catch (error) {
      console.error('[APP] Status check failed:', error.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'error',
        error: error.message,
      }));
    }
    return;
  }

  // Test endpoint: Insert a record
  if (req.url === '/test' && req.method === 'POST') {
    try {
      const result = await pool.query(
        'INSERT INTO test_table (created_at) VALUES (NOW()) RETURNING id, created_at'
      );
      const row = result.rows[0];
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        id: row.id,
        created_at: row.created_at,
      }));
      console.log(`[APP] Test record inserted: ${row.id}`);
    } catch (error) {
      console.error('[APP] Test insert failed:', error.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: error.message,
      }));
    }
    return;
  }

  // Root endpoint
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
      <head><title>DSO PostgreSQL Example</title></head>
      <body>
        <h1>DSO PostgreSQL Credential Rotation Example</h1>
        <p>Application is running and connected to PostgreSQL.</p>
        <ul>
          <li><a href="/health">Health Check</a> - Database connectivity test</li>
          <li><a href="/status">Status</a> - Current database user and time</li>
          <li><a href="javascript:fetch('/test', {method:'POST'}).then(r=>r.json()).then(d=>alert(JSON.stringify(d)));">Insert Test Record</a></li>
        </ul>
        <p>When DSO rotates the PostgreSQL password, this app will automatically reconnect with the new credentials without downtime.</p>
      </body>
      </html>
    `);
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

// Initialize on startup
console.log('[APP] Starting application...');
console.log('[APP] Database host:', DB_HOST);
console.log('[APP] Database port:', DB_PORT);
console.log('[APP] Database user:', DB_USER);
console.log('[APP] Database name:', DB_NAME);

try {
  initializePool();
  console.log('[APP] Database connection pool initialized');
} catch (error) {
  console.error('[APP] Failed to initialize connection pool:', error.message);
  process.exit(1);
}

// Start server
server.listen(APP_PORT, () => {
  console.log(`[APP] Server running on http://localhost:${APP_PORT}`);
  console.log('[APP] Ready for database credential rotation');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('[APP] SIGTERM received, closing connections...');
  if (pool) {
    pool.end(() => {
      console.log('[APP] Database connections closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('[APP] Uncaught exception:', error);
  process.exit(1);
});
