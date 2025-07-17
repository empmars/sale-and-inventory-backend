import { db, sql } from '@vercel/postgres'

export async function FilterPrice(req, res) {
    try {

        var client = await db.connect()
        var result = await client.sql`SELECT * FROM items WHERE price < ${req.body.price}`
        res.json(result.rows)
    } catch (err) {
        res.json('err')
    }

}