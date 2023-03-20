import express from 'express'
import { register, login } from '../controllers/auth.controller.js'
import { getUser, getUserFriends, addRemoveFriend } from '../controllers/user.controller.js'
import { getFeedPosts, getUserPosts, likePost, createPost } from '../controllers/post.controller.js'
import { isLoggedIn } from '../middleware/auth.middleware.js'
const router = express.Router()

router.post('/auth/register', register)
router.post('/auth/login', login)

router.get('/user/getuser/:id', isLoggedIn, getUser)
router.get('/user/getuser/:id/:friends', isLoggedIn, getUserFriends)
router.patch('/user/:friendId', isLoggedIn, addRemoveFriend)

router.post('/post/create', isLoggedIn, createPost)
router.get('/post', isLoggedIn, getFeedPosts)
router.get('/post/:userId/posts', isLoggedIn, getUserPosts)
router.patch('/post/:id/like', isLoggedIn, likePost)

export default router