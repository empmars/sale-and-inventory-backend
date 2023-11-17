import { db, sql } from '@vercel/postgres'

export async function GetAllItems(req , res) {

    try {
    var client = await db.connect()
    var result = await client.sql`SELECT * FROM items`
    res.json(result.rows)
    } catch (err) {
        res.json('err')
    }

}