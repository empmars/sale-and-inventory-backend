import { db, sql } from '@vercel/postgres'

export async function MonthlyProfit(req, res) {
    try {

    var client = await db.connect()
    var date = new Date().toISOString().split('T')[0]
    var firstDate = date.slice(0,8) + '01'
    var result = await client.sql`SELECT sum(total_profit) FROM sale WHERE date BETWEEN ${firstDate} AND ${date}`
    res.json(result.rows[0].sum)
    } catch(err) {
        console.log(err)
    }

}