const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors());
app.use(express.json());

const knex = require('knex')({
  client: 'pg',
  version: '7.2',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password : 'yoloswag11223',
    database : 'sale-and-inventory-db'
  }
});


app.get('/', function (req, res) {
  console.log('request recieved')
  res.json('Hello World')
})

app.post('/add-item', function (req, res) {
  console.log(req.body)
          const { name , quantity , price , expiry , profit } = req.body;

          const valuesOfReq = Object.values(req.body);

          const checkIfEmpty = (value) =>{
              return(value !== '')
          }

          const test = valuesOfReq.every(checkIfEmpty)

           if(test) {

                    const profitPerc= (profit/100) * price;
                    const roundOffprofitPerc = Math.round(profitPerc)
                    knex('items')
                    .insert({
                      name: name,
                      quantity : quantity,
                      price: price,
                      expiry: expiry,
                      profit: roundOffprofitPerc
                    })
                    .then(result=>{
                        res.json('success')
                    })
                    .catch(err=>res.json(err.detail))
          }
          else (
              res.json('Please fill all fields.')
          )

})

app.post('/table', function(req,res) {

    knex('items')
    .select('*')
    .where({name: req.body.name})
    .then(result=>{
      console.log(result.length)
    if (result.length === 0) {
        res.json('Item does not exist.')
    }
    else {
        res.json(result[0])
    }

    })
    .catch(err=>res.json(err.detail))

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
                            console.log(i)
                            if( i === arr.length -1 ) {
                                return trx('sale')
                                .insert({
                                total: total
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
                           .then(result4=>console.log('updated'))

                       })

                        newQuan = 0


                   })
                   .catch(err=>res.json(err.detail + 'Issue while fetching from items db.'))


                   })





      })
        // .catch(err=>console.log(err.detail + 'Transaction Failed.'))










      //   knex.transaction(function(trx) {

      //           for(var i = 0 ; i < arr.length ; i++ ) {
      //                var a = i
      //                 console.log(a)
      //                 knex('items')
      //                 .select('*')
      //                 .where({name : arr[i][0]})
      //                 .then(result=>{
      //                     var first = Number(result[0].profit)
      //                     console.log(a)
      //                   var second = Number(arr[a][1])
      //                     var totalProfit = first * second
      //                     return trx('sale')
      //                     .insert({
      //                       items: arr[a][0],
      //                       quantity: arr[a][1],
      //                       profit: totalProfit,
      //                       discount: arr[a][2],
      //                       sum: arr[a][3],
      //                       date: new Date()
      //                     })
      //                     .then( result2=> {
      //                      console.log('ok')

      //                     })
      //                 })
      //                     .then(trx.commit)
      //                     .then(trx.rollback)


      //           }

      // })
      //   .catch(err=>console.log(err.detail))
          //  knex('sale')
          //  .insert({
          //   sum: total
          //   })
          // .then(result=>{
          //    console.log('ok2')
          //   })




    //

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

app.post('/fetch-all-items-filter' , function(req,res) {

      var { state } = req.body;
      console.log(state)

       var filteredItems = []

        state.forEach((check , i)=>{

                   var year =  Object.keys(check)[0]

                    if(year === 'after') {


                        knex('items')
                        .select('*')
                        .where('expiry' , '>', '31-12-2024')
                        .orderBy('id' , 'asc')
                        .then(result => {

                       // filteredItems =  JSON.stringify(filteredItems) + JSON.stringify(result)
                        filteredItems =  filteredItems.concat(result)

                        if( i === state.length - 1 ) {

                         res.json(filteredItems)
                        }

                     })

                    }

                    else {
                         var sameYear = '31-12-202' + year[4]
                          var prevYear = '31-12-202' + (Number(year[4]) - 1)
                          knex('items')
                          .select('*')
                          .where('expiry' , '<=', sameYear)
                          .andWhere('expiry' , '>', prevYear)
                          .orderBy('id' , 'asc')
                          .then(result=>{
                            filteredItems =  filteredItems.concat(result)

                            console.log(filteredItems)
                            if( i === state.length - 1 ) {

                             res.json(filteredItems)
                            }


                          })
                    }


                  })

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
        console.log(req.body)

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
          console.log(result)
          var sum = 0
        result.forEach((object)=>{

            sum = sum + Number(object.sum)

        })

        res.json(sum)
      })


    })

app.post('/weekly-total' , function(req,res) {

    var { date } = req.body
    var weekDay = new Date(date).getDay()
    var toSub = weekDay-1
    var weekStartDate = new Date(date).getDate() - toSub
    console.log(weekStartDate)

    var date = date.substring(4, 16)
    var part1 = date.slice(0,3)
    var part2 = date.slice(7,11)
    var weekStart = part1 + ` ${weekStartDate} ` + part2

    knex('sale')
    .select('sum')
    .whereBetween(  'date'  , [weekStart , date])
    .then(result=>{
        console.log(result)
        var sum = 0
      result.forEach((object)=>{

          sum = sum + Number(object.sum)

      })

      res.json(sum)
    })


})

app.post('/daily-total' , function(req , res) {

      var { date } = req.body;

      var date = date.substring(4, 16)

      knex('sale')
      .select('sum')
      .where( 'date' , date)
      .then(result=>{
          console.log(result)
          var sum = 0
        result.forEach((object)=>{

            sum = sum + Number(object.sum)

        })

        res.json(sum)
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
          console.log(result)
          var profit = 0
        result.forEach((object)=>{

            profit = profit + Number(object.profit)

        })

        console.log(result)

        res.json(profit)
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
            console.log(result)
            var profit = 0
          result.forEach((object)=>{

              profit = profit + Number(object.profit)

          })

          res.json(profit)
        })

    })

app.post('/daily-profit' , function(req , res) {

          var { date } = req.body;

          var date = date.substring(4, 16)

          knex('sale')
          .select('profit')
          .where( 'date' , date)
          .then(result=>{
              console.log(result)
              var profit = 0
            result.forEach((object)=>{

                profit = profit + Number(object.profit)

            })

            res.json(profit)
          })

})

app.listen(3001)
