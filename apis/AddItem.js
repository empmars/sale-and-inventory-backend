import { db, sql } from '@vercel/postgres'

async function AddItem(req, res, headers) {
    var client = await db.connect()

    var { name, price, profit, quantity, expiry } = res

    const profitPerc = (profit / 100) * price;
    quantity = Number(quantity)
    console.log(name, price, profit, quantity, expiry)
//    if (expiry.length === 0) {

//         try {

//             await client.sql`INSERT INTO items (name , quantity , price , profit , expiry) VALUES (${name} , ${quantity} , ${price} , ${profit} , ${null})`
//             res.json('success')


//         } catch (err) {
//             res.json(err.detail)
//         }




//         //     knex('items')
//         //       .insert({
//         //         name: name,
//         //         quantity: Number(quantity),
//         //         price: Number(price),
//         //         expiry: null,


//         //         profit: Number(profitPerc)
//         //       })
//         //       .then(result => {
//         //         res.json('success')
//         //       })
//         //       .catch(err => res.json(err.detail))
//     } else {

//         try {

//             await client.sql`INSERT INTO items (name , quantity , price , profit , expiry) VALUES (${name} , ${quantity} , ${price} , ${profit} , ${expiry})`
//             res.json('success')


//         } catch (err) {
//             res.json(err.detail)
//         }







//         //     knex('items')
//         //       .insert({
//         //         name: name,
//         //         quantity: Number(quantity),
//         //         price: Number(price),
//         //         expiry: expiry,
//         //         profit: Number(profitPerc)
//         //       })
//         //       .then(result => {
//         //         res.json('success')
//         //       })
//         //       .catch(err => res.json(err.detail))


//     }


}

export default AddItem