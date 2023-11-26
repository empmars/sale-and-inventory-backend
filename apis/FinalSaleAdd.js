import { db, sql } from '@vercel/postgres'

export async function FinalSaleAdd(req, res) {
    try {

        var client = await db.connect()
        var { data, profitArr, total } = req.body
        var date = new Date().toString()
        date = date.slice(0 , 15)

        await data.forEach((cur, i) => {
            try {

                var profit = profitArr[i]
                var totalProfit = profitArr.reduce((acc, cur) => { return acc + cur }, 0)
                client.sql`INSERT INTO sale (name , quantity, price , profit, date) VALUES (
                    ${cur.name},
                    ${cur.reqQuan},
                    ${cur.FinalPrice},
                    ${cur.profit},
                    ${date}
                )`
                if (i === data.length - 1) {

                    client.sql`INSERT INTO sale (date , total_sale , total_profit) VALUES (
                        ${date},
                        ${total},
                        ${totalProfit}
                    )`

                }
            } catch (err) {
                res.json('err')
            }
        })
        res.json('success')
    } catch (err) {
        res.json('err')
    }




}