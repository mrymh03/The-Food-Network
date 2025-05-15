/*
    FILE: userModel.js [COMPLETED]
    AUTHORL jch-r
    DEPENDENCIES: mongoose
    INITIALIZING: schema
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema

/*
    MODEL: users (consumer, donor, food bank)
    GLOBAL FIELDS: <STRING>       email
                   <STRING>       password
                   <STRING>       role = 'consumer' || 'fb'
                   <STRING ARRAY> subscriptions

    RBAC FIELDS: <derived from role>
        FOOD BANK: <STRING>       title
                   <STRING>       address
                   <STRING>       city 
                   <STRING>       state
                   <STRING>       zip
                   <STRING ARRAY> foodlist
                   <STRING>       desc
*/
const userSchema = new Schema ({
    //BASE USER DATA
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'consumer'
    },
    
    subscriptions: {
        type: [String],
        required: true,
        default: []
    },

    //FOOD BANK EXCLUSIVE
    title: {
        type: String,
        required: () => {return this.role == 'fb'} 
    },
    address: {
        type: String,
        required: () => {return this.role == 'fb'}
    },
    city: {
        type: String,
        required: () => {return this.role == 'fb'}
    },
    state: {
        type: String,
        required: () => {return this.role == 'fb'}
    },
    zip: {
        type: String,
        required: () => {return this.role == 'fb'}
    },
    foodlist: {
        type: [String]
    },
    desc: {
        type: String
    }
}, [])

module.exports = mongoose.model('USER', userSchema)