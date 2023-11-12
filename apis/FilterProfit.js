import { db, sql } from '@vercel/postgres'

export async function FilterPofit(req , res) {

    var client = await db.connect()
    try {
    var result = await client.sql`SELECT * FROM items WHERE profit < ${req.body.profit}`
    res.json(result.rows)
    } catch (err) {
        res.json('err')
    }

}