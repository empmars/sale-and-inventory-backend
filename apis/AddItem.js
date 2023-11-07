
function AddItem(req , res , headers) {
    

    headers(res)
    console.log(req.body)


    //   for (let par in req.body) {
    //     if (req.body[par].length === 0 && par !== 'expiry') {
    //       req.body[par] = '0'
    //     }
    //   }

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