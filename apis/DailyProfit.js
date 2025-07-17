import { db, sql } from '@vercel/postgres'

export async function DailyProfit(req, res) {
    try {

    var client = await db.connect()
    var date = new Date().toISOString().split('T')[0]

    var sale = await client.sql`SELECT sum(total_profit) FROM sale WHERE date = ${date}`
   
    res.json(sale.rows[0].sum)
    } catch(err) {
        res.json('err')
    }

}