import express from 'express'
import { register, login } from '../controllers/auth.controller.js'
import { getUser, getUserFriends, addRemoveFriend } from '../controllers/user.controller.js'
import { isLoggedIn } from '../middleware/auth.middleware.js'
const router = express.Router()

router.post('/auth/register', register)
router.post('/auth/login', login)

router.get('/user/getuser/:id', isLoggedIn, getUser)
router.get('/user/getuser/:id/:friends', isLoggedIn, getUserFriends)
router.patch('/user/:friendId', isLoggedIn, addRemoveFriend)

export default router