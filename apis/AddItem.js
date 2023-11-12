import { db, sql } from '@vercel/postgres'

async function AddItem(req, res, headers) {
    var client = await db.connect()

    var { name, price, profit, quantity, expiry } = req.body

    profit = profit >= 0 ? Number(profit) : 0
    const profitPerc = (profit / 100) * price;
    quantity = quantity >= 0 ? Number(quantity) : 0
    price = price >= 0 ? Number(price) : 0

    console.log(profitPerc)
   if (expiry.length === 0) {

        try {

            await client.sql`INSERT INTO items (name , quantity , price , profit , expiry) VALUES (${name} , ${quantity} , ${price} , ${profitPerc} , ${null})`
            res.json('success')


        } catch (err) {
           console.log(err)
           res.json(err)
        }

    } else {

        try {

            await client.sql`INSERT INTO items (name , quantity , price , profit , expiry) VALUES (${name} , ${quantity} , ${price} , ${profitPerc} , ${expiry})`
            res.json('success')


        } catch (err) {
            res.json(err)
        }

    }


}

export default AddItem