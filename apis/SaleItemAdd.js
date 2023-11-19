import { db, sql } from '@vercel/postgres'

export async function SaleItemAdd(req, res) {
    try {
        var {name , quantity , discount} = req.body
        
       
        var client = await db.connect()
       


        var result = await client.sql`SELECT * FROM items WHERE name = ${name}`
        console.log(result.rows)
       


    } catch (err) {
        res.json('err')
    }

}