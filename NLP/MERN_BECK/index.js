const express = require('express') //server
const mongoose = require('mongoose') //connecting with mongoDB
const cors = require('cors') //cross origin resourse sharing
require('dotenv').config() //it reades from .env file and setup in the process.env with variable MONGODB_URL

const app = express()
app.use(express.json()) //json body parser
app.use(cors())

//Start the server

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`The Server has started on port ${PORT}`)
})

mongoose.connect(process.env.MONGODB_URL,
    {useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true},
    (err)=>{
        if(err)
        {
            throw err
        }
        else{
            console.log('Connection Established')
        }
    }) //connect to data base

//Set up routes
app.use('/users',require('./routes/userRouter'))