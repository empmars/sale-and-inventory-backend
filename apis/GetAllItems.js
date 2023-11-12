import { db, sql } from '@vercel/postgres'

export async function GetAllItems(req , res) {

    var client = await db.connect()
    try {
    var result = await client.sql`SELECT * FROM items`
    res.json(result.rows)
    } catch (err) {
        res.json('err')
    }

}