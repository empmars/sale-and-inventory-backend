import { db, sql } from '@vercel/postgres'

export async function CheckEditItem(req, res) {

    try {
        var client = await db.connect()
        var request = '%' + req.body.name + '%'


        var result = await client.sql`SELECT * FROM items WHERE name ILIKE ${request}`
        res.json(result.rows)

    } catch (err) {
        res.json('err')
    }

}