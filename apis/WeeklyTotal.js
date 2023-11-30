import { db, sql } from '@vercel/postgres'

export default async function WeeklyTotal(req , res) {
    try {

    var client = await db.connect()
    var weekDates = []
    var dayOfWeek = new Date().getDay()
    for (var i = 0 ; i <= dayOfWeek ; i++ ) {
     var date = new Date()
        date.setDate(date.getDate() - i)
        weekDates.push(date.toISOString().split('T')[0])
    }

    var result = await db.sql`SELECT sum(total_sale) FROM sale where to_date(date , 'YYYY-MM-DD') BETWEEN to_date(${weekDates[dayOfWeek]} , 'YYYY-MM-DD') AND to_date(${weekDates[0]} , 'YYYY-MM-DD')`
    var sum = 0
    // console.log(result)
    // result.rows.forEach((cur , i) => {
    //     if(cur.total_sale !== null) {
    //         sum = sum + Number(cur.total_sale)
    //     }
    // })
    res.json(result.rows[0].sum)
    } catch(err) {
        res.json('err')
    }
}