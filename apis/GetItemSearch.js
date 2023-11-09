import { db, sql } from '@vercel/postgres'

export default async function getItemSearch(req, res, headers) {

    headers(res)
    var client = await db.connect()

    var { name } = req.body;
    name = name.toLowerCase()

    var result = await client.sql`SELECT * FROM items WHERE LOWER(name) = ${name}`
    res.json(result.rows)

}