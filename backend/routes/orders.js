/*
    FILE: orders.js [COMPLETE]
    AUTHOR: jch-r
    DEPENDENCIES: mongoose, express, orderModel
    INITIALIZING: express router, order
*/
const requireAuth = require('../middleware/requireAuth')
const Order = require('../models/orderModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
router.use(requireAuth)

/*
    STATUS: [FUNCTIONAL]
    AUTH: [CONSUMERS]
    DESCRIPTION:
    Controller for querying for orders from food banks 
    that a user has subscribed to.
*/
router.get('/subscribed', async (request, response) => {
    const uID = request.user._id

    try {
        const sublist = await User.find({  _id: uID }, 'subscriptions').limit(1)
        const subs = sublist.at(0).subscriptions
        const orders = await Order.find({bank_id: {$in: subs}}).sort({ date: -1 })
        console.log(orders)
        response.status(200).json(orders)

    } catch (error) {
        response.status(400).json('Unable to search')
    }
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [FOOD BANKS]
    DESCRIPTION:
    Controller for getting all orders attributed to the
    current (food bank) user that are not marked as complete.
*/
router.get('/current', async (request, response) => {
    const uID = request.user._id
    
    //Query for all orders that have not been completed
    try {
        const orders = await Order.find({
            bank_id: uID,
            completed: false
        }, 'date content').sort({ date: -1 })
        response.status(200).json(orders)

    } catch (error) {
        response.status(400).json('Failed to query.')
    }
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [FOOD BANKS]
    DESCRIPTION:
    Controller for getting all orders attributed to the
    current (food bank) user that are marked as complete.
*/
router.get('/previous', async (request, response) => {
    const uID = request.user._id

    //Query for all orders that have been completed
    try {
        const orders = await Order.find({
            bank_id: uID,
            completed: true
        }).sort({ date: -1 })
        response.status(200).json(orders)

    } catch (error) {
        response.status(400).json('Failed to query.')
    }
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [FOOD BANKS]
    DESCRIPTION:
    Controller for creating a new order in the database.
*/
router.post('/create', async (request, response) => {
    const uID = request.user._id
    const {date, content, completed} = request.body

    //Verify all fields have been checked
    if (!date || !content) {
        return response.status(400).json('Fill all fields.')
    }

    //Attempt to create a new order entry in the DB
    try {
        var bank = await User.find({_id: uID}, 'title').limit(1)
    
        try {
            const order = await Order.create({bank_id: uID, date, content, completed, bank_name: bank.at(0).title})
            response.status(200).json(order)
        } catch (error) {
            response.status(400).json('Failed to create')
        }
    } catch(error) {
        response.status(400).json('Failed to create')
    }
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [FOOD BANKS]
    DESCRIPTION:
    Controller for pulling all emails of users subscribed to a bank and sending them
    an email with the contents of an order.
*/
router.get('/getemails', async (request, response) => {
    const uID = request.user._id
    const content = request.query['searchTerm']

    //Create a transport node
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // use SSL
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        }
      });

    //Query for all emails that are subscribed to this bank
    try {
        const curBank = await User.find({  _id: uID }).limit(1)
        console.log(curBank)
        console.log(curBank.at(0).subscriptions)
        console.log(curBank.at(0).email)
        const subs = curBank.at(0).subscriptions
        const subscribers = await User.find({_id: {$in: subs}}, 'email')
        const emails = []
        for (var i = 0; i < subscribers.length; i++) {
            const mailOptions = {
                from: 'The Food Network',
                to: subscribers.at(i).email,
                subject: 'The Food Network: New Order Placed!',
                text: 'Hello!\nOne of your subscribed food providers has added an order with' + 
                ' the following:\n' + content + '\nBe sure to take a look!\nIf you want to reach out to this bank, you' + 
                ' can do so through the following: ' + curBank.at(0).email +'\n\nHave a wonderful day!'
              };

              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log('Error:', error);
                } else {
                  console.log('Email sent: ', info.response);
                }
              });
        }
        response.status(200).json(emails)

    } catch (error) {
        response.status(400).json('Failed to query.')
    }
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [FOOD BANKS]
    DESCRIPTION:
    Controller for editing an order already present
    in the database.
*/
router.patch('/update/:id', async (request, response) => {
    const uID = request.user_id
    const { id } = request.params
    const { completed } = request.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({error: 'Order does not exist'})
    }

    //Create a transport node
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // use SSL
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        }
      }); 
      
    const order = await Order.findOneAndUpdate({_id: id},{$set: {completed: completed}})

    //Query for all emails that are subscribed to this bank
    try {
        const curBank = await User.find({  _id: order.bank_id }).limit(1)
        console.log(curBank)
        console.log(curBank.at(0).email)
        const subs = curBank.at(0).subscriptions
        const subscribers = await User.find({_id: {$in: subs}}, 'email')
        for (var i = 0; i < subscribers.length; i++) {
            const mailOptions = {
                from: 'The Food Network',
                to: subscribers.at(i).email,
                subject: 'The Food Network: Order Updated!',
                text: 'Hello!\nOne of your subscribed food providers has marked an order with' + 
                ' the following:\n' + order.date + " : " + order.content + ' as delivered!' + 
                '\nBe sure to take a look!\nIf you want to reach out to this bank, you' + 
                ' can do so through the following: ' + curBank.at(0).email +'\n\nHave a wonderful day!'
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log('Error:', error);
                } else {
                    console.log('Email sent: ', info.response);
                }
            });
        }
    } catch(error) {}

    response.status(200).json(order)
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [FOOD BANKS]
    DESCRIPTION:
    Controller for manually deleting an order from
    the database.
*/
router.delete('/delete/:id', async (request, response) => {
    const { id } = request.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({error: 'Order does not exist'})
    }

    const order = await Order.findOneAndDelete({_id: id})
    response.status(200).json(order)
})

module.exports = router