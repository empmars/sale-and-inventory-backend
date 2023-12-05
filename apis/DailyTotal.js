import { db, sql } from '@vercel/postgres'

export async function DailyTotal(req, res) {
    try {

    var client = await db.connect()
    var date = new Date().toISOString().split('T')[0]

    var sale = await client.sql`SELECT sum(total_sale) FROM sale WHERE date = ${date}`
   
    res.json(sale.rows[0].sum)
    console.log(sale.rows)
    } catch(err) {
        res.json('err')
    }

}