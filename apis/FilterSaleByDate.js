import { db, sql } from '@vercel/postgres'

export async function FilterSaleDate(req, res) {
    // var date = new Date().toISOString().split('T')[0]

   
    // res.json(sale.rows[0].sum)
    // console.log(sale.rows)
    
    
    try {
        var client = await db.connect()
        var {fromDate , toDate} = req.body
        console.log(fromDate , toDate)

        var sale = await client.sql`SELECT * FROM sale WHERE date BETWEEN ${fromDate} AND ${toDate}`
        res.json(sale.rows)

    } catch(err) {
        res.json('err')
    }

}