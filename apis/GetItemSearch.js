import { db, sql } from '@vercel/postgres'

export default async function getItemSearch(req, res) {


    try {
        var client = await db.connect()

        var { name } = req.body;
        var request = '%' + req.body.name + '%'
        var result = await client.sql`SELECT * FROM items WHERE name ILIKE ${request}`
        console.log(result.rows)
        res.json(result.rows)
    } catch (err) {
        res.json('err')
    }


}