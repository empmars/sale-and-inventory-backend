const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json());

app.use(cors())

const knex = require('knex')({
  client: 'pg',
  version: '7.2',
  connection: {
    port : 5432,
    user : 'postgres',
    password : 'yoloswag11223',
    database : 'sale-and-inventory-db'
  }
});

// CORS FUNCTION





app.get('/', function (req, res) {
  console.log('request recieved')
  res.json('Hello World')
})


app.post('/add-item', function (req, res) {
          const { name , quantity , price , expiry , profit } = req.body;

          console.log(req.body)

          for (let par in req.body) {
              if(req.body[par].length === 0 && par !== 'expiry') {
                req.body[par] = '0'
              }
          }

          const profitPerc= (profit/100) * price;
          if(expiry.length === 0) {
                    knex('items')
                    .insert({
                      name: name,
                      quantity : Number(quantity),
                      price: Number(price),
                      expiry: null,
                      profit: Number(profitPerc)
                    })
                    .then(result=>{
                        res.json('success')
                    })
                    .catch(err=>res.json(err.detail))
              } else {
                knex('items')
                .insert({
                  name: name,
                  quantity : Number(quantity),
                  price: Number(price),
                  expiry: expiry,
                  profit: Number(profitPerc)
                })
                .then(result=>{
                    res.json('success')
                })
                .catch(err=>res.json(err.detail))


              }
})

app.post('/list-search-edit', function(req,res) {

  var { name } = req.body;
  name = name.toLowerCase()

    knex('items')
    .select('*')
    .whereRaw(`LOWER(name) LIKE ?`, [`%${name}%`])
    .then(result => {

        res.json(result)


    })

})

app.post('/fetch-items-edit', function(req,res){

      const { name } = req.body

      knex('items')
      .select('*')
      .where({name: name})
      .then(result=>{

            res.json(result)

      })

})

app.post('/save-edited-item' , function(req,res) {

    var { quantity , profit , price , expiry } = req.body;




    for (let par in req.body) {

        if(req.body[par].length === 0 && par !== 'expiry') {
          req.body[par] = '0'
        }
    }

    if(expiry.length === 0) {

      knex('items')
      .update({
          quantity: Number(quantity),
          profit: Number(profit),
          price: Number(price),
          expiry: null
        })
      .then(result=>{
        res.json('Success')
    })
  .catch(()=>{res.json('Error')})
  }
    else {

      knex('items')
      .update({
          quantity: Number(quantity),
          profit: Number(profit),
          price: Number(price),
          expiry: expiry
        })
      .then(result=>{
        res.json('Success')
    })
      .catch(()=>{res.json('Error')})
    }

})

app.put('/del-item', function(req,res) {
  console.log(req.body)

      knex('items')
      .where({name: req.body.name})
      .del()
      .then(result=>{
        res.json('success')
      })
      .catch(err=>res.json(err.detail))

})

app.post('/sale-item-search', function(req,res) {
    var { name } = req.body
    name = name.toString().toLowerCase();
    knex('items')
    .select('name')
    .then(result=>{

      const matched = result.filter((item)=>{
        return (item.name.toLowerCase().includes(name))
      })

      res.json(matched)
    })
})

app.post('/sale-item-add', function(req,res) {
            var { name , quantity , discount , price } = req.body

            knex('items')
            .where({name: name})
            .select('price' , 'quantity' , 'profit')
            .then(result1=>{
                 var singlePrice = result1[0].price;

                 if(discount !== '') {

                  discount = Number(discount)
                  var discAmnt = Math.round((discount/100) * singlePrice);
                  var totalDiscAmnt = discAmnt * quantity

                  // SUM

                  var finalSinglePrice = singlePrice - discAmnt;
                  var sum = Math.round(finalSinglePrice * quantity)

                  // PROFIT

                  var rmngProfit = result1[0].profit - discAmnt



                 } else {
                  var sum = Math.round(singlePrice * quantity)
                  var discAmnt = 0;
                  var rmngProfit = result1[0].profit
                 }

                 const response = {
                    name: name,
                    quantity: quantity,
                    singlePrice: singlePrice,
                    discount: discAmnt,
                    profit: rmngProfit,
                    sum: sum

                 }

                 res.json(response)



            })
          .catch(err=>console.log(err))



    // knex('sale')
    // .insert({
    //   name: name,
    //   quantity: quantity,
    //   date: new Date()
    // })
    // .returning('*')
    // .then(result=>{
    //   console.log(result)
    // })

})

app.post('/final-sale-add', function(req,res) {

        var { arr , total } = req.body

        arr.forEach((saleData , i)=>{


          knex.transaction(function(trx) {


            return trx('items')
                  .select('*')
                  .where({name: saleData[0]})
                  .then(result1=>{

                          var totalProfit = (Number(saleData[1]) * Number(result1[0].profit) - Number(saleData[2]))

                          return trx('sale')
                          .insert({
                              items: JSON.stringify(saleData[0]),
                              quantity: saleData[1],
                              discount: saleData[2],
                              profit: totalProfit,
                              sum: saleData[3],
                              date: new Date(),
                              total: 0

                          })
                        .then(result1=> {
                            if( i === arr.length -1 ) {
                                return trx('sale')
                                .insert({
                                total: total,
                                date: new Date()
                                })
                                .then(result2=>{
                                    console.log(1)
                                })

                              }

                        })
                        .then(result3=>{

                        var newQuan = Number(result1[0].quantity) - Number(saleData[1])
                          return trx('items')
                           .where({name: saleData[0]})
                           .update({quantity : newQuan})
                           .then(result4=>{
                             if(i === arr.length - 1) {
                               res.json('Success')
                             }
                           })

                       })

                        newQuan = 0


                   })
                   .catch(err=>res.json(err.detail + 'Issue while fetching from items db.'))


                   })





      })
})

app.post('/fetch-all-items' , function(req,res) {

          knex('items')
          .select('*')
          .orderBy('id' , 'asc')
          .then(result=>{
            console.log(result)
              res.json(result)
          })


})

app.post('/filter-items-expiry' , function(req,res) {

      var { from , to } = req.body;
      knex('items')
      .select('*')
      .whereBetween('expiry', [from , to])
      .orderBy('expiry' , 'asc')
      .then(result=>{
        res.json(result)
      })

       // var filteredItems = []
       //
       //  state.forEach((check , i)=>{
       //
       //             var year =  Object.keys(check)[0]
       //
       //              if(year === 'after') {
       //
       //
       //                  knex('items')
       //                  .select('*')
       //                  .where('expiry' , '>', '31-12-2024')
       //                  .orderBy('id' , 'asc')
       //                  .then(result => {
       //
       //                 // filteredItems =  JSON.stringify(filteredItems) + JSON.stringify(result)
       //                  filteredItems =  filteredItems.concat(result)
       //
       //                  if( i === state.length - 1 ) {
       //
       //                   res.json(filteredItems)
       //                  }
       //
       //               })
       //
       //              }
       //
       //              else {
       //                   var sameYear = '31-12-202' + year[4]
       //                    var prevYear = '31-12-202' + (Number(year[4]) - 1)
       //                    knex('items')
       //                    .select('*')
       //                    .where('expiry' , '<=', sameYear)
       //                    .andWhere('expiry' , '>', prevYear)
       //                    .orderBy('id' , 'asc')
       //                    .then(result=>{
       //                      filteredItems =  filteredItems.concat(result)
       //
       //                      console.log(filteredItems)
       //                      if( i === state.length - 1 ) {
       //
       //                       res.json(filteredItems)
       //                      }
       //
       //
       //                    })
       //              }
       //
       //
       //            })

})

app.post('/fetch-filter-quan' , function(req,res) {
        var { quan } = req.body

          knex('items')
          .select('*')
          .where('quantity' , '<' , quan )
          .orderBy('id' , 'asc')
          .then(result=>{
            res.json(result)
          })

})

app.post('/fetch-filter-price' , function(req,res) {
        var { price } = req.body
        console.log(req.body)

          knex('items')
          .select('*')
          .where('price' , '<' ,  price )
          .then(result=>{
            res.json(result)
          })

})

app.post('/fetch-filter-profit' , function(req,res) {
        var { profit } = req.body


          knex('items')
          .select('*')
          .where('profit' , '<' ,  profit )
          .orderBy('id' , 'asc')
          .then(result=>{
            res.json(result)
          })

})


app.post('/monthly-total' , function(req,res) {

      var date  = req.body.date

      var date = date.substring(4, 16)
      var part1 = date.slice(0,3)
      var part2 = date.slice(7,11)
      var monthStart = part1 + ' 01 ' + part2

      knex('sale')
      .select('sum')
      .whereBetween(  'date'  , [monthStart , date])
      .then(result=>{

          var sum = 0
        result.forEach((object)=>{

            sum = sum + Number(object.sum)

        })



        res.json(Math.round(sum))
      })


    })

app.post('/weekly-total' , function(req,res) {

    var { date } = req.body
    var weekDay = new Date(date).getDay()
    var toSub = weekDay-1
    var weekStartDate = new Date(date).getDate() - toSub


    var date = date.substring(4, 16)
    var part1 = date.slice(0,3)
    var part2 = date.slice(7,11)
    var weekStart = part1 + ` ${weekStartDate} ` + part2

    knex('sale')
    .select('sum')
    .whereBetween(  'date'  , [weekStart , date])
    .then(result=>{

        var sum = 0
      result.forEach((object)=>{

          sum = sum + Number(object.sum)

      })

      res.json(Math.round(sum))
    })


})

app.post('/daily-total' , function(req , res) {

      var { date } = req.body;

      var date = date.substring(4, 16)

      knex('sale')
      .select('sum')
      .where( 'date' , date)
      .then(result=>{

          var sum = 0
        result.forEach((object)=>{

            sum = sum + Number(object.sum)

        })

        res.json(Math.round(sum))
      })

})

app.post('/monthly-profit' , function(req,res) {

      var date  = req.body.date

      var date = date.substring(4, 16)
      var part1 = date.slice(0,3)
      var part2 = date.slice(7,11)
      var monthStart = part1 + ' 01 ' + part2

      knex('sale')
      .select('profit')
      .whereBetween(  'date'  , [monthStart , date])
      .then(result=>{

          var profit = 0
        result.forEach((object)=>{

            profit = profit + Number(object.profit)

        })

        res.json(Math.round(profit))
      })


    })

app.post('/weekly-profit' , function(req,res) {

        var { date } = req.body
        var weekDay = new Date(date).getDay()
        var toSub = weekDay - 1
        var weekStartDate = new Date(date).getDate() - toSub

        var date = date.substring(4, 16)
        var part1 = date.slice(0,3)
        var part2 = date.slice(7,11)
        var weekStart = part1 + ` ${weekStartDate} ` + part2


        knex('sale')
        .select('profit')
        .whereBetween(  'date'  , [weekStart , date])
        .then(result=>{

            var profit = 0
          result.forEach((object)=>{

              profit = profit + Number(object.profit)

          })

          res.json(Math.round(profit))
        })

    })

app.post('/daily-profit' , function(req , res) {

          var { date } = req.body;

          var date = date.substring(4, 16)

          knex('sale')
          .select('profit')
          .where( 'date' , date)
          .then(result=>{

              var profit = 0
            result.forEach((object)=>{

                profit = profit + Number(object.profit)

            })

            res.json(Math.round(profit))
          })

})


app.post('/filter-sale-date' , function(req , res) {

      var { fromDate , toDate } = req.body.dates;

      fromDate = new Date(fromDate)
      toDate = new Date(toDate)


        knex('sale')
        .select('*')
        .whereBetween('date', [fromDate , toDate])
        .orderBy('id' , 'asc')
        .then(result=>{
          res.json(result)
        })
      // if( date === 'before' ) {
      //
      //     knex('sale')
      //     .select('*')
      //     .where('date' , '<' , value)
      //     .orderBy('id' , 'asc')
      //     .then(result=>{
      //
      //
      //       res.json(result)
      //     })
      //
      // } else if( date === 'same' ) {
      //
      //     knex('sale')
      //     .select('*')
      //     .where({date: value})
      //     .orderBy('id' , 'asc')
      //     .then(result=>{
      //
      //
      //       res.json(result)
      //     })
      //
      // } if( date === 'after' ) {
      //
      //     knex('sale')
      //     .select('*')
      //     .where('date' , '>' , value)
      //     .orderBy('id' , 'asc')
      //     .then(result=>{
      //       res.json(result)
      //     })
      //
      // }



})

app.post('/filter-sale-item' , function(req , res) {

      var { item , from , to } = req.body

      var item = JSON.stringify(item)
      var from = JSON.stringify(from)
      var to = JSON.stringify(to)



      knex('sale')
      .select('*')
      .whereBetween('date', [from , to])
      .andWhere({items: item})
      .orderBy('id' , 'asc')
      .then(result=>{
        res.json(result)
      })



        //
        // console.log(value)
        //
        //
        //   if( date === 'before-item' ) {
        //
        //       knex('sale')
        //       .select('*')
        //       .where('date' , '<' , value)
        //       .andWhere({items: item})
        //       .orderBy('id' , 'asc')
        //       .then(result => {
        //         res.json(result)
        //       })
        //
        //   } else if (date === 'same-item') {
        //
        //       knex('sale')
        //       .select('*')
        //       .where({date: value})
        //       .andWhere({items: item})
        //       .orderBy('id' , 'asc')
        //       .then( result => {
        //         res.json(result)
        //       })
        //
        //   } else if( date === 'after-item' ) {
        //
        //       knex('sale')
        //       .select('*')
        //       .where('date' , '>' , value)
        //       .andWhere({items: item})
        //       .orderBy('id' , 'asc')
        //       .then(result=>{
        //         res.json(result)
        //       })
        //
        //   }
})

const port = process.env.PORT || 3001
app.listen(port , () => {res.json(`Listening to port ${port}`)})
