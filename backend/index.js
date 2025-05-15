/*
    FILE: index.js [COMPLETED]
    AUTHOR: jch-r
    DEPENDENCIES: dotenv, mongoose, express
    INITIALIZING: express router, routes, connection
*/
require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')

//Initialize express application:
const foodNetwork = express()
foodNetwork.use(express.json())

//Initialize routes:
const orderRoutes = require('./routes/orders')
const userRoutes = require('./routes/users')
const bankRoutes = require('./routes/foodbanks')

//Link routes:
foodNetwork.use('/backend/order', orderRoutes)
foodNetwork.use('/backend/auth', userRoutes)
foodNetwork.use('/backend/bank', bankRoutes)

//Connect to database:
mongoose.connect(process.env.MONGODB_URI)
    .then(() => foodNetwork.listen(process.env.PORT), () => {
        console.log('connected to', process.env.PORT)
      })
    .catch((error) => console.log(error))