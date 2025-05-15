/*
    FILE: users.js [COMPLETED]
    AUTHOR: jch-r
    DEPENDENCIES: bcrypt, jsonwebtoken, express, userModel
    INITIALIZING: express router, user, bcrypt, jwt
*/
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const express = require('express')
const router = express.Router()
const ApifyClient = require('apify-client')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

/*
    STATUS: [FUNCTIONAL]

    DESCRIPTION:
    Controller for verifying that provided login information
    matches a user currently in the database.  Creates JWT
    for that user.
*/
router.post('/login', async (request, response) => {
    const { email, password, role } = request.body
    try {
        //Verify all fields have been filled
        if (!email || !password || !role) {
            return response.status(400).json('All fields must be filled')
        }

        //Verify the email of the user is in the database
        const user = await User.findOne({ email })
        if (!user) {
            return response.status(400).json('Incorrect email')
        }

        if (role != user.role) {
            return response.status(400).json('Incorrect role')
        }

        //Verify the password provided matches the user with that emai'
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return response.status(400).json('Incorrect password')
        }

        //Create JWT
        const token = createToken(user._id)
        return response.status(200).json({ email, role, token })

    } catch(error) {
        return response.status(400).json({error: error.message})
    }
})

/*
    STATUS: [FUNCTIONAL]

    DESCRIPTION:
    Controller for creating a new user in the database based
    on provided information, which applies RBAC functionality
    later on. Creates JWT for that user.
*/
router.post('/register', async (request, response) => {
    const { email, password, role, title, address, city, state, zip } = request.body
    try {
        //Verify all fields have been filled
        if (!email || !password || !role) {
            return response.status(400).json('All fields must be filled')
        }

        //Verify food bank users provide an address
        if (role == 'fb' && (!title || !address || !city || !state || !zip)) {
            return response.status(400).json('Food Banks must provide a location and title')
        }

        //Verify the email has not been used in an account
        const inDatabase = await User.findOne({ email })
        if (inDatabase) {
            return response.status(400).json('Email already in the database')
        }

        //Salt and hash the password to be stored in secure manner
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        //Generate user for database
        const user = await User.create({email, password: hash, role, 
            title, address, city, state, zip })

        //Create JWT
        const token = createToken(user._id)
        return response.status(200).json({ email, role, token })

    } catch(error) {
        return response.status(400).json({error: error.message})
    }
})

router.get('/temp', async (request, response) => {
    const location = request.query['searchTerm'];
    const type = request.query['type'];
    
    try {
        const client = new ApifyClient.ApifyClient({
            token: 'apify_api_bmgzxYrjtVjfgsEwQaa7SMtdKH5fvu4ywXL2',
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
        console.log(error)
        response.status(400).json('Unable to search')
    }
})

module.exports = router