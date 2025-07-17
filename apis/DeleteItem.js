import { db, sql } from '@vercel/postgres'

export async function DeleteItem(req, res) {
    try {
        var client = await db.connect()
        var { name } = req.body
        var result = await client.sql`DELETE FROM items WHERE name = ${name}`
        res.json('success')

    } catch (err) {
        res.json('err')
    }

}