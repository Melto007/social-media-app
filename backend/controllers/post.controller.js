import Post from '../models/post.schema.js'
import asyncHandler from '../services/asyncHandler.js'
import CustomError from '../utils/CustomError.js'
import formidable from 'formidable'
import uploadImage from '../config/cloudinary.config.js'

/***************************************************
 * @creatPost
 * @route http://localhost:4000/post/create
 * @method POST
 * @description create post
 * @params - 
 * @return success message
 ***************************************************/
export const createPost = asyncHandler(async (req, res) => {
    const form = formidable({
        multiples: false,
        keepExtensions: true 
    })

    form.parse(req, async function(error, fields, files) {
        try {
            if(error) {
                throw new CustomError("Post not created", 400)
            }

            const user = req.user

            if(!user) {
                throw new CustomError('Unauthorized User', 400)
            }

            const uploadPostImg = await uploadImage(files.picturePath.filepath)
    
            const createPost = await Post.create({
                ...fields,
                userId: user._id,
                picturePath: uploadPostImg.secure_url,
                likes: {},
                comments: {}
            })

            await createPost.save()

            const posts = await Post.find().populate('userId')

            res.status(200).json({
                success: true,
                message: "Post created",
                posts
            })
            
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || "post was not created"
            })
        }
    })
})

/***************************************************
 * @getFeedPosts
 * @route http://localhost:4000/post
 * @method GET
 * @description get all the post
 * @params -
 * @return success message
 ***************************************************/
export const getFeedPosts = asyncHandler(async (req, res) => {
    const user = req.user

    if(!user) {
        throw new CustomError("Unauthorized User", 400)
    }

    const post = await Post.find()

    res.status(200).json({
        success: true,
        post
    })
})

/***************************************************
 * @getUserPosts
 * @route http://localhost:4000/post/:userId/posts
 * @method POST
 * @description particular user post
 * @params 
 * @return success message
 ***************************************************/
export const getUserPosts = asyncHandler(async (req, res) => {
    const user = req.user
    const postId = req.params

    if(!user) {
        throw new CustomError("Unauthorized User", 400)
    }

    const post = await Post.find({ postId })

    res.status(200).json({
        success: true,
        post
    })
})

/***************************************************
 * @likePost
 * @route http://localhost:4000/post/:id/like
 * @method POST
 * @description like the post
 * @params user id
 * @return success message
 ***************************************************/
export const likePost = asyncHandler(async (req, res) => {
    const user = req.user

    if(!user) {
        throw new CustomError("Unauthorized User", 400)
    }

    const { userId } = req.body
    const post = await Post.findById(userId)
    const isLiked = post.likes.get(userId)

    if(isLiked) {
        post.likes.delete(userId)
        // post.likes = undefined
    } else {
        post.likes.set(userId, true)
        // post.likes = true
    }

    const updatePost = await Post.findByIdAndUpdate(
        id,
        { likes: post.likes},
        { new: true}
    )

    res.status(200).json({
        success: true,
        updatePost
    })
})