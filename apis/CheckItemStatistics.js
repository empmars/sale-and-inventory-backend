import { db, sql } from '@vercel/postgres'

export async function CheckItemStatistics(req, res) {
    try {
        if(req.body.name.length === 0) {
            res.json([])
        } else {
        var client = await db.connect()
        var request = '%' + req.body.name + '%'


        var result = await client.sql`SELECT name FROM sale WHERE name ILIKE ${request}`
        var unique = result.rows.reduce((acc , cur)=>{
            if(!acc.includes(cur.name)){
                acc.push(cur.name)
            }
            return acc
        } , []) 
        res.json(unique)
        }


    } catch (err) {
        res.json('err')
    }

}