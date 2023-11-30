import { db, sql } from '@vercel/postgres'

export async function DailyTotal(req, res) {
    try {

    var client = await db.connect()
    var date = new Date().toISOString().split('T')[0]

    var sale = await client.sql`SELECT total_sale FROM sale WHERE date = ${date}`
    var sum = 0
    sale.rows.forEach((cur, i) => {
        if (cur.total_sale !== null) {
            sum = sum + Number(cur.total_sale)
        }
    })
    console.log(sum)
    res.json(sum)
    } catch(err) {
        res.json('err')
    }

}