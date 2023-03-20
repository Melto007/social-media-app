import asyncHandler from '../services/asyncHandler.js'
import CustomError from '../utils/CustomError.js'
import config from '../config/index.js'
import jwt from 'jsonwebtoken'
import User from '../models/user.schema.js'

export const isLoggedIn = asyncHandler(async (req, _res, next) => {
    let token

    if(req.cookies.token || req.headers.Authorization && req.headers.Authorization.startsWith(`Bearer`)) {
        token = req.cookies.token || req.headers.Authorization.split(" ")[1]
    }

    if(!token) {
        throw new CustomError("Unauthorized user", 400)
    }

    try {
        const decodeJwtToken = jwt.verify(token, config.JWT_SECRET)
        req.user = await User.findById(decodeJwtToken._id, "email")
        next()
    } catch (error) {
        throw new CustomError(error.message, 400)
    }
})