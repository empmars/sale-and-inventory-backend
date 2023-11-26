import { db, sql } from '@vercel/postgres'

export async function DailyTotal(req , res) {
    var client = await db.connect()
    var {date} = req.body
    date = date.slice(0,15)
     var sale = await client.sql`SELECT total_sale FROM sale WHERE date = ${date}`
    console.log(sale.rows)
}