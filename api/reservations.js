import { Client } from "pg";
export default async function handler(req, res) {
  const client = new Client({ connectionString: process.env.POSTGRES_URL, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    const { rows } = await client.query("select id, name, date, notes, created_at from reservations order by created_at desc limit 100");
    return res.status(200).json({ ok:true, rows });
  } catch (e) { console.error(e); return res.status(500).json({ ok:false, error:"DB error" }); }
  finally { await client.end(); }
}
