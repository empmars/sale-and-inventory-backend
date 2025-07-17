import express from 'express'
import cors from 'cors'
import { sql, db } from '@vercel/postgres'
import dotenv from 'dotenv'
import AddItem from './apis/AddItem.js'
import getItemSearch from './apis/GetItemSearch.js'
import { FilterExpiry } from './apis/FilterExpiry.js'
import { FilterQuan } from './apis/FilterQuan.js'
import { FilterPrice } from './apis/FilterPrice.js'
import { FilterPofit } from './apis/FilterProfit.js'
import { GetAllItems } from './apis/GetAllItems.js'
import { CheckEditItem } from './apis/CheckEditItem.js'
import { EditItem } from './apis/EditItem.js'
import { SaleItemAdd } from './apis/SaleItemAdd.js'
import {FinalSaleAdd} from './apis/FinalSaleAdd.js'
import { DailyTotal } from './apis/DailyTotal.js'
import WeeklyTotal from './apis/WeeklyTotal.js'
import { MonthlyTotal } from './apis/MonthlyTotal.js'
import { MonthlyProfit } from './apis/MonthlyProfit.js'
import WeeklyProfit from './apis/WeeklyProfit.js'
import { DailyProfit } from './apis/DailyProfit.js'
import { FilterSaleDate } from './apis/FilterSaleByDate.js'
import { FilterTwoFinal } from './apis/FilterTwoFinal.js'
import { CheckItemStatistics } from './apis/CheckItemStatistics.js'
import { DeleteItem } from './apis/DeleteItem.js'

var corsOptions = {
  origin: 'https://sale-an-inventory-front.vercel.app',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express()
app.use(express.json());
app.use(cors(corsOptions))
dotenv.config()



app.get('/as', function (req, res) {

      res.json({ mes: "asas" })
})

app.post('/add-item', function (req, res) {

      AddItem(req, res)

})


app.post('/list-search-edit', function (req, res) {
     console.log('asas')
      getItemSearch(req, res)
})

app.post('/filter-items-expiry' , function(req,res) {

      FilterExpiry(req , res)


})

app.post('/fetch-filter-quan' , function(req,res) {
      

        FilterQuan(req , res)

})

app.post('/fetch-filter-price' , function(req,res) {
     

        FilterPrice(req , res)

})

app.post('/fetch-filter-profit' , function(req,res) {
     

        FilterPofit(req , res)

})

app.post('/fetch-all-items' , function(req,res) {

      GetAllItems(req , res)

})

app.post('/check-item-edit' , function(req, res) {
      CheckEditItem(req , res)
})

app.post('/edit-item' , function(req, res) {
      EditItem(req , res)
})

app.post('/sale-item-add' , function(req, res) {
      SaleItemAdd(req , res)
})

app.post('/final-sale-add' , function(req , res) {
      FinalSaleAdd(req , res)
})

app.post('/daily-total' , function(req , res) {
      DailyTotal(req , res)
})


app.post('/weekly-total' , function(req , res) {
      WeeklyTotal(req , res)
})

app.post('/monthly-total' , function(req , res) {
      MonthlyTotal(req , res)
})

app.post('/daily-profit' , function(req , res) {
      DailyProfit(req , res)
})

app.post('/weekly-profit' , function(req , res) {
      WeeklyProfit(req , res)
})

app.post('/monthly-profit' , function(req , res) {
      MonthlyProfit(req , res)
})

app.post('/check-item-statistics' , function(req , res) {
      CheckItemStatistics(req , res)
})

app.post('/filter-sale-date' , function(req,res) {
      FilterSaleDate(req,res)
})


app.post('/filter-two-final' , function(req,res) {
      FilterTwoFinal(req,res)
})

app.post('/del-item' , function(req,res) {
      DeleteItem(req,res)
})

app.listen(3001)
