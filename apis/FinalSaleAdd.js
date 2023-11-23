import { db, sql } from '@vercel/postgres'

export async function FinalSaleAdd(req , res) {
    try{

    var client = await db.connect()
    var {data , profitArr , total} = req.body
    res.json('success')
    } catch(err) {
        res.json('err')
    } 




}