import asyncHandler from "../services/asyncHandler.js";
import User from '../models/user.schema.js'
import CustomError from '../utils/CustomError.js'
import formidable from "formidable";
import uploadImage from '../config/cloudinary.config.js'
import bcrypt from 'bcrypt'
import cookiesOptions from "../utils/CookiesOptions.js";

/***************************************************
 * @Register
 * @route http://localhost:4000/auth/register
 * @method POST
 * @description register user for login
 * @params firstname, lastname, email, password, picturePath, friends, location, occupation
 * @return success message
 ***************************************************/
export const register = asyncHandler(async (req, res) => {
    const form = formidable({
        multiples: true,
        keepExtensions: true 
    })

    form.parse(req, async function (error, fields, files) { 
        try {
            if(error) {
                throw new CustomError(error.message || "Failed to upload a file", 400)
            }

            const user = await User.findOne({ email: fields.email })

            if(user) {
                throw new CustomError("user already exists", 400)
            }

            const result = await uploadImage(files.picturePath.filepath)

            const createUser = await User.create({
                picturePath: result.secure_url,
                viewedProfile: Math.floor(Math.random() * 10000),
                impressions: Math.floor(Math.random() * 10000),
                ...fields
            })

            createUser.password = undefined

            res.status(200).json({
                success: true,
                message: "saved successfully",
                createUser
            })

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || "user was not created"
            })
        }
    })
})

/***************************************************
 * @Login
 * @route http://localhost:4000/auth/login
 * @method POST
 * @description login for registered user
 * @params email, password
 * @return success message
 ***************************************************/
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select("+password")

    if(!user) {
        throw new CustomError("Invalid Credential", 400)
    }

    const isMatch = await user.comparePassword(password)

    if(!isMatch) {
        throw new CustomError("Invalid Credential")
    }

    const token = user.getJwtToken()
    user.password = undefined
    res.cookie("token", token, cookiesOptions)

    res.status(200).json({
        success: true,
        message: "successfully login",
        token
    })
})