import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import User from '../models/user.schema.js'

/***************************************************
 * @getUser
 * @route http://localhost:4000/user/getUser/:id
 * @method GET
 * @description get single user detail
 * @params -
 * @return return user with success message
 ***************************************************/
export const getUser = asyncHandler(async (req, res) => {
    const user = req.user

    const { id } = req.params

    if(!user) {
        throw new CustomError("Unauthorized User", 400)
    }

    const users = await User.findById(id)

    res.status(400).json({
        success: true,
        message: "success",
        users
    })
})

/***************************************************
 * @getUserFriends
 * @route http://localhost:4000/user/getuser/:id/:friends
 * @method GET
 * @description get single user detail
 * @params -
 * @return return user with success message
 ***************************************************/
export const getUserFriends = asyncHandler(async (req, res) => {
    const user = req.user
    const { id } = req.params

    if(!user) {
        throw new CustomError("Unauthorized User", 400)
    }

    const users = await User.findById(id)

    const friends = await Promise.all(
        users.friends.map((id) => User.findById(id))
    )

    const formatted = friends.map(({ _id, firstname, lastname, picturePath, friends, location, occupation }) => {
        return { _id, firstname, lastname, picturePath, friends, location, occupation }
    })  

    res.status(400).json({
        success: true,
        message: "success",
        formatted
    })
})

/***************************************************
 * @addRemoveFriend
 * @route http://localhost:4000/user/:friendId
 * @method PATCH
 * @description add and remove friend
 * @params -
 * @return success message
 ***************************************************/
export const addRemoveFriend = asyncHandler(async (req, res) => {
    const user = req.user

    if(!user) {
        throw new CustomError("Unauthorized User", 400)
    }

    res.status(400).json({
        success: true,
        message: "success",
        user
    })
})