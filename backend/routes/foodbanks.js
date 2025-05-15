
/*
    FILE: foodbanks.js [COMPLETE]
    AUTHOR: jch-r
    DEPENDENCIES: mongoose, express, userModel
    INITIALIZING: express router, user
*/
const requireAuth = require('../middleware/requireAuth')
const mongoose = require('mongoose')
const User = require('../models/userModel')
const Order = require('../models/orderModel');
const express = require('express')
const pluralize = require('pluralize')
const router = express.Router()
const ApifyClient = require('apify-client')
router.use(requireAuth)

/*
    STATUS: [FUNCTIONAL]
    AUTH: [CONSUMERS]
    DESCRIPTION:
    Controller for querying specific food banks from the database
    based on some search term.  Designed for search bar component

    FORMAT: /searchFood?searchTerm=<term>
*/
router.get('/searchFood', async (request, response) => {
    try {
        //Split by comma or space
        const searchTerms = request.query['searchTerm']
            .split(/[ ,]+/)
            .map(term => term.trim())
            .filter(term => term.length > 0) 

        //Ensure everything is lowercase and singular
        for (var i = 0; i < searchTerms.length; i++) 
            {searchTerms[i] = new RegExp(pluralize.singular(searchTerms[i].toLowerCase()), "i")}

        const banks = await User.find({
            foodlist: { $in: searchTerms }
        }, 'title foodlist desc address city state')
        .sort({ foodlist: -1 })
        .limit(10)

        //Order by how many elements match in each:
        const temp = new Map()
        var count = 0

        //Not optimized, but does achieve what we need:
        for (var i = 0; i < banks.length; i++) { 
            //For every bank found with an element
            for (var j = 0; j < searchTerms.length; j++) { 
                //For every term in the search
                for (var k = 0; k < banks[i].foodlist.length; k++) { 
                    //For every item in the bank's list
                    const check = new RegExp(pluralize.singular(banks[i].foodlist[k].toLowerCase()), "i")
                    if (check.toString() == searchTerms[j].toString()) {
                        count = count + 1
                    }
                }
            }

            
            temp.set(i, count)
            count = 0
        }

        //Sort everything
        const final = []
        const sorted = [...temp].sort((a, b) => b[1] - a[1])
        sorted.forEach((value, key) => {
            final.push(banks[value[0]])
        })
        response.status(200).json(final)
    } catch (error) {
        response.status(400).json('Unable to search')
    }
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [CONSUMERS]
    DESCRIPTION:
    Controller for querying specific food banks from the database
    based on some search term.  Designed for search bar component

    FORMAT: /searchTitle?searchTerm=<term>
*/
router.get('/searchTitle', async (request, response) => {
    try {
        //Split by comma or space
        const searchTerms = request.query['searchTerm']
            .split(/[ ,]+/)
            .map(term => term.trim())
            .filter(term => term.length > 0) 
        
        //Ensure everything is lowercase and singular
        for (var i = 0; i < searchTerms.length; i++) 
            {searchTerms[i] = new RegExp(pluralize.singular(searchTerms[i].toLowerCase()), "i")}

        const banks = await User.find({
            title: { $in: searchTerms }
        }, 'title foodlist desc address city state')
        .sort({ title: -1 })
        .limit(10)

        response.status(200).json(banks)

    } catch (error) {
        response.status(400).json('Unable to search')
    }
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [CONSUMERS]
    DESCRIPTION:
    Controller for querying specific food banks from the database
    based on some search term.  Designed for search bar component

    FORMAT: /searchLocation?searchTerm=<term>
*/
router.get('/searchLocation', async (request, response) => {
    try {
        //Split by comma or space
        const searchAddress = request.query['searchAddress']
            .split(/[ ,]+/)
            .map(term => term.trim())
            .filter(term => term.length > 0) 

        const searchCity = request.query['searchCity']
            .split(/[ ,]+/)
            .map(term => term.trim())
            .filter(term => term.length > 0) 

        const searchState = request.query['searchState']
            .split(/[ ,]+/)
            .map(term => term.trim())
            .filter(term => term.length > 0) 


        //Ensure everything is lowercase and singular
        for (var i = 0; i < searchAddress.length; i++) 
            {searchAddress[i] = new RegExp(searchAddress[i].toLowerCase(), "i")}
        for (var i = 0; i < searchCity.length; i++) 
            {searchCity[i] = new RegExp(searchCity[i].toLowerCase(), "i")}
        for (var i = 0; i < searchState.length; i++) 
            {searchState[i] = new RegExp(searchState[i].toLowerCase(), "i")}


        const search = []

        if (searchAddress.length != 0) {search.push({address:{$in :searchAddress}})}
        if (searchCity.length != 0) {search.push({city:{$in :searchCity}})}
        if (searchState.length != 0) {search.push({state:{$in :searchState}})}
        if (search.length == 0) {throw mongoose.Error}

        const banks = await User.find({
            $or: search
        }, 'title foodlist desc address city state')
        .sort({ foodlist: -1 })
        .limit(10)

        //Order by how many elements match in each:
        const temp = new Map()
        var count = 0

        //Not optimized, but does achieve what we need:
        for (var i = 0; i < banks.length; i++) { 
            const tempAddress = banks[i].address.toString()
            const curCity = new RegExp(banks[i].city.toLowerCase(), "i")
            const curState = new RegExp(banks[i].state.toLowerCase(), "i")

            console.log(tempAddress.toString())
            const curAddress = tempAddress.split(" ")

            for (var j = 0; j < curAddress.length; j++) 
                {curAddress[j] = new RegExp(curAddress[j].toLowerCase(), "i")}
            console.log(curAddress)

            if (curAddress.toString() == searchAddress.toString()) {count += 1}
            if (curCity.toString() == searchCity.toString()) {count += 1}
            if (curState.toString() == searchState.toString()) {count += 1}
            
            temp.set(i, count)
            count = 0
        }

        console.log(temp)

        //Sort everything
        const final = []
        const sorted = [...temp].sort((a, b) => b[1] - a[1])
        sorted.forEach((value, key) => {
            final.push(banks[value[0]])
        })

        response.status(200).json(final)

    } catch (error) {
        response.status(400).json('Unable to search')
    }
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [CONSUMERS]
    DESCRIPTION:
    Controller for subscribing to a given food bank.
*/
router.patch('/subscribe/:id', async (request, response) => {
    const uID = request.user._id
    const { id: bankID } = request.params

    if (!mongoose.Types.ObjectId.isValid(bankID)) {
        return response.status(404).json({error: 'Food Bank does not exist'})
    }

    const checkSubscription = await User.find({_id: uID, subscriptions: {$in: bankID}})
    console.log(checkSubscription.length == 0)
    if (checkSubscription.length != 0) {
        return response.status(400).json({error: 'Already subscribed'})
    }

    const profile = await User.findOneAndUpdate({_id: uID}, {
        $push: { subscriptions: bankID }
    })

    await User.findOneAndUpdate({_id: bankID}, {
        $push: { subscriptions: uID }
    })

    response.status(200).json(profile)
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [CONSUMERS]
    DESCRIPTION:
    Controller for unsubscribing to a given food bank.
*/
router.patch('/unsubscribe/:id', async (request, response) => {
    const uID = request.user._id
    const { id: bankID } = request.params

    if (!mongoose.Types.ObjectId.isValid(bankID)) {
        return response.status(404).json({error: 'Food Bank does not exist'})
    }

    const profile = await User.findOneAndUpdate({_id: uID}, {
        $pull: { subscriptions: bankID }
    })

    await User.findOneAndUpdate({_id: bankID}, {
        $pull: { subscriptions: uID }
    })

    response.status(200).json(profile)
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [CONSUMERS]
    DESCRIPTION:
    Controller for querying for food banks that a user has
    subscribed to.
*/
router.get('/subscribed', async (request, response) => {
    const uID = request.user._id
    try {
        const sublist = await User.find({  _id: uID }, 'subscriptions').limit(1)
        const subs = sublist.at(0).subscriptions
        const banks = await User.find({  _id: {$in: subs} })
        console.log(banks)
        response.status(200).json(banks)

    } catch (error) {
        response.status(400).json('Unable to search')
    }
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [FOOD BANKS]
    DESCRIPTION:
    Controller for querying and updating specific food bank
    in the database.  Currently basic and requires all fields
    be updated.
*/
router.patch('/profile/', async (request, response) => {
    const uID = request.user._id
    const { title, address, city, state, zip, foodlist, desc } = request.body
    const preplist = foodlist.replace(/\s/g, "").split(",")
    for (var i = 0; i < preplist.length; i++) 
        {preplist[i] = pluralize.singular(preplist[i].toLowerCase())}

    console.log(preplist)
    if (!mongoose.Types.ObjectId.isValid(uID)) {
        return response.status(404).json({error: 'Profile does not exist'})
    }
    const profile = await User.findOneAndUpdate({_id: uID}, {
        title: title,
        address: address,
        city: city,
        state: state,
        zip: zip,
        foodlist: preplist,
        desc: desc
    })
    response.status(200).json(profile)
})

router.get('/temp', async (request, response) => {
    const location = request.query['searchTerm'];
    const type = request.query['type'];
    
    try {
        const client = new ApifyClient.ApifyClient({
            token: 'apify_api_EDbfpKCgNUvfcAYS49H6OULxCTD9h12y41Ge',
        });

        console.log("Apify client set:")
        
        // Prepare Actor input
        const input = {
            "searchStringsArray": [
                type,
            ],
            "locationQuery": "Arizona, USA",
            "maxCrawledPlacesPerSearch": 5,
            "language": "en",
            "countryCode": ""
        };

        
        // Run the Actor and wait for it to finish
        const run = await client.actor("compass/google-maps-extractor").call(input);
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        response.status(200).json(items)
    } catch (error) {
        response.status(400).json('Unable to search')
    }
})

module.exports = router