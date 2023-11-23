import { db, sql } from '@vercel/postgres'


export async function EditItem(req, res) {

    try {
        var client = await db.connect()
        var request = req.body


        for (var key in request) {
            if (request.hasOwnProperty(key) && request[key].length === 0 || request[key] == 0) {
                request[key] = 0
            }
        }

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