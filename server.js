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

      knex.transaction(function(trx) {
            var { name , quantity , discount , price } = req.body

            knex('items')
            .where({name: name})
            .select('price')
            .then(result1=>{
                 var singlePrice = result1[0].price;
                 price = singlePrice * quantity
            
                 knex('sale')
                  .insert({
                    name: name,
                    quantity: quantity,
                    price: price,
                    discount: discount,
                    date: new Date()

                  })
                  .returning('*')
                  .then(result2=>{
                    res.json(result2)
                  })

            })
            .then(trx.commit)
            .catch(trx.rollback);

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





app.listen(3001)