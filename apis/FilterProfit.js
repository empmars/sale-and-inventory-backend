import { db, sql } from '@vercel/postgres'

export async function FilterPofit(req , res) {

    try {
    var client = await db.connect()
    var result = await client.sql`SELECT * FROM items WHERE profit < ${req.body.profit}`
    res.json(result.rows)
    } catch (err) {
        res.json('err')
    }

}