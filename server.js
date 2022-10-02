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


app.listen(3001)