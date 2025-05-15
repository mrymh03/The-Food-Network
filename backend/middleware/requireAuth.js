/*
    FILE: requireAuth.js
    AUTHOR: jch-r
*/
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (request, response, next) => {
    const { authorization } = request.headers
    if (!authorization) {
        return response.status(400).json({error: 'Not authorized.'})
    }

    const token = authorization.split(' ')[1]
    try {
        const { _id } = jwt.verify(token, process.env.SECRET)
        request.user = await User.findOne({ _id }).select('_id')
        next()
    } catch (error) {
        return response.status(400).json({error: 'Not authorized to complete action.'})
    }
}

module.exports = requireAuth