import { db, sql } from '@vercel/postgres'

export async function FinalSaleAdd(req, res) {
    try {

        var client = await db.connect()
        var { data, profitArr, total } = req.body
        var date = new Date().toISOString()
        date = date.split('T')[0]


        Promise.all(

        await data.map(async (cur, i) => {
            

                var profit = profitArr[i]
                console.log(profit)
                var totalProfit = profitArr.reduce((acc, cur) => { return acc + cur }, 0)
                await client.sql`INSERT INTO sale (name , quantity, price , profit, discount, date) VALUES (
                    ${cur.name},
                    ${cur.reqQuan},
                    ${cur.FinalPrice},
                    ${profit},
                    ${cur.discount},
                    ${date}
                )`

                await client.sql`UPDATE items SET quantity = quantity - ${cur.reqQuan} where name = ${cur.name}`
                console.log(cur.name)
                var quanRem = await client.sql`SELECT quantity FROM items WHERE name = ${cur.name}` 
                console.log(quanRem)
                if(quanRem.rows[0].quantity < 1) {
                    await client.sql`DELETE FROM items WHERE name = ${cur.name}`
                }
                if (i === data.length - 1) {

                    await client.sql`INSERT INTO sale (date , total_sale , total_profit) VALUES (
                        ${date},
                        ${total},
                        ${totalProfit}
                    )`

                }
            
        })
        
            )
      
        res.json('success')
    } catch (err) {
        res.json('err')
    }




}