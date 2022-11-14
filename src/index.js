const express = require('express')
const bodyparser = require ('body-parser')
const route = require('./router/router')
const app = express();
const mongoose = require('mongoose')

app.use(bodyparser.json())


mongoose.connect("mongodb+srv://PoojaFunctionUp:PA44yjApvizLJGOY@cluster0.newxzkv.mongodb.net/Pooja1508-Db?retryWrites=true&w=majority",{
    useNewUrlParser:true
 })
 
 .then(()=>console.log("mongoose is connected"))
 .catch(err=> console.log(err))

 app.use('/', route);

app.listen(process.env.port||3000, function(){
    console.log("express app running on port "+(process.env.port||3000))
})
