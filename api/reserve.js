// /api/reserve.js
const { Client } = require('pg');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, date, notes } = req.body || {};
  if (!name || !date) {
    return res.status(400).json({ error: 'Missing name or date' });
  }

  const conn = process.env.POSTGRES_URL;
  if (!conn) {
    return res.status(500).json({ error: 'POSTGRES_URL not configured' });
  }

  const client = new Client({
    connectionString: conn,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await client.query(
      `INSERT INTO reservations (name, date, notes) VALUES ($1, $2, $3);`,
      [name, date, notes || null]
    );

    res.status(200).json({ ok: true, message: 'Reservation saved!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error', details: String(err) });
  } finally {
    await client.end();
  }
};
