import { db, sql } from '@vercel/postgres'

async function AddItem(req, res, headers) {
    var client = await db.connect()

    var { name, price, profit, quantity, expiry } = req.body

    const profitPerc = (profit / 100) * price;
    quantity = Number(quantity)
    console.log(req.body)
   if (expiry.length === 0) {

        try {

            await client.sql`INSERT INTO items (name , quantity , price , profit , expiry) VALUES (${name} , ${quantity} , ${price} , ${profitPerc} , ${null})`
            res.json('success')


        } catch (err) {
            res.json(err.detail)
        }

    } else {

        try {

            await client.sql`INSERT INTO items (name , quantity , price , profit , expiry) VALUES (${name} , ${quantity} , ${price} , ${profitPerc} , ${expiry})`
            res.json('success')


        } catch (err) {
            res.json(err.detail)
        }

    }


}

export default AddItem