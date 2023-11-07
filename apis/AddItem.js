import { sql, db } from '@vercel/postgres'

async function AddItem(req , res , headers) {
    var client = db.connect()


    var items = await sql`SELECT * from items`    
    console.log(items)
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