import { sql, db } from '@vercel/postgres'

async function AddItem(req , res , headers) {
    var client = db.connect()


    console.log(req.body)
    var items = await client.sql`SELECT * from items`    
    console.log(items.rows[0])
    //   const profitPerc = (profit / 100) * price;
    //   if (expiry.length === 0) {
    //     knex('items')
    //       .insert({
    //         name: name,
    //         quantity: Number(quantity),
    //         price: Number(price),
    //         expiry: null,
    //         profit: Number(profitPerc)
    //       })
    //       .then(result => {
    //         res.json('success')
    //       })
    //       .catch(err => res.json(err.detail))
    //   } else {
    //     knex('items')
    //       .insert({
    //         name: name,
    //         quantity: Number(quantity),
    //         price: Number(price),
    //         expiry: expiry,
    //         profit: Number(profitPerc)
    //       })
    //       .then(result => {
    //         res.json('success')
    //       })
    //       .catch(err => res.json(err.detail))


    //   }


}

export default AddItem