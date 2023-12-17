import { db, sql } from '@vercel/postgres'
import pkg from 'lodash'
const { isNull} = pkg

export async function FilterSaleDate(req, res) {
    // var date = new Date().toISOString().split('T')[0]


    // res.json(sale.rows[0].sum)
    try {
    


        var client = await db.connect()
        var { fromDate, toDate } = req.body
        console.log(fromDate, toDate)

        var sale = await client.sql`SELECT * FROM sale WHERE date BETWEEN ${fromDate} AND ${toDate}`
        var totSale = sale.rows.reduce((acc, cur) => {
            if (!isNull(cur.price)) {
                acc = acc + Number(cur.price)
            }
            return acc
        }, 0)
        var totProf = sale.rows.reduce((acc, cur) => {
            if (!isNull(cur.profit)) {
                acc = acc + Number(cur.profit)
            }
            return acc
        }, 0)
        totSale = Math.round(totSale)
        totProf = Math.round(totProf)
        res.json([sale.rows , totSale , totProf])

    } catch (err) {
        res.json('err')
    }

}