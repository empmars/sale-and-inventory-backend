import { db, sql } from '@vercel/postgres'

export async function SaleItemAdd(req, res) {
    try {
        var {name ,  reqQuan , reqDisc} = req.body
       
        var client = await db.connect()


        var result = await client.sql`SELECT * FROM items WHERE name = ${name}`
        console.log(result.rows)
        var {price , profit} = result.rows[0]
    console.log(price)
        reqQuan = Number(reqQuan)
        reqDisc = Number(reqDisc)
        price = Number(price)
        profit = Number(profit) * reqQuan
        var PriceBeforeDisc = reqQuan * price
        var amountToSubtract = (reqDisc/100) * PriceBeforeDisc

        profit = profit - amountToSubtract


        var FinalPrice = PriceBeforeDisc -  amountToSubtract
        var result = {
            name: name ,
            reqQuan: reqQuan ,
            discount: amountToSubtract ,
            FinalPrice: FinalPrice  
            }
        
        
        res.json([result , profit])
       


    } catch (err) {
        res.json('err')
    }

}