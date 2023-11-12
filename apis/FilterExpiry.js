import { db, sql } from '@vercel/postgres'

export async function FilterExpiry (req , res) {

        var client = await db.connect()
              var { from , to } = req.body;

        try {

        var result = await client.sql`SELECT * FROM items WHERE expiry BETWEEN ${from} AND ${to}  ORDER BY expiry ASC`
        res.json(result.rows)
        } catch (err) {
            res.json('err')
        }
}