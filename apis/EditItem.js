import { db, sql } from '@vercel/postgres'



export async function EditItem(req, res) {

    try {
        var client = await db.connect()
        var request = req.body
      

        for (var key in request) {
            if(key === 'expiry' && request[key].length === 0) {
                request[key] = null
            } else if (request[key].length === 0  ) {
                request[key] = 0
            }
            // if (key !== 'expiry' && isEmpty(request[key]) || request[key] == 0 ) {
            //     console.log(key)
            //     request[key] = 0
            // } else if (key === 'expiry' && isEmpty(request[key]) ) {
            //     request[key] = null
            // }
        }
        console.log(req.body)
        var { name, quantity, price, profit, expiry } = request

        if (profit > 0 && price > 0) {

            profit = (Number(profit) / 100) * price;
        }

        await client.sql`UPDATE items SET 
            quantity = ${quantity},
            price = ${price},
            profit = ${profit},
            expiry = ${expiry}
            WHERE name = ${name}
            `
        res.json('success')
    } catch (err) {
        res.json('err')
    }




}