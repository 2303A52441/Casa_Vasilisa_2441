import { Client } from "pg";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok:false, error:"Method not allowed" });
  const { name, date, notes } = req.body || {};
  if (!name || !date) return res.status(400).json({ ok:false, error:"Missing name or date" });
  const client = new Client({ connectionString: process.env.POSTGRES_URL, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    await client.query("insert into reservations (name, date, notes) values ($1, $2, $3)", [name, date, notes || null]);
    return res.status(200).json({ ok:true, message:"Reservation saved" });
  } catch (e) { console.error(e); return res.status(500).json({ ok:false, error:"DB error" }); }
  finally { await client.end(); }
}
