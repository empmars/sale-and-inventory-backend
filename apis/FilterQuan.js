import { db, sql } from '@vercel/postgres'

export async function FilterQuan(req , res) {

    try {
    var client = await db.connect()
    var result = await client.sql`SELECT * FROM items WHERE quantity < ${req.body.quan}`
    res.json(result.rows)
    } catch (err) {
        res.json('err')
    }

}