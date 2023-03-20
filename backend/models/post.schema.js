import mongoose from 'mongoose'

const postSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        picturePath: String,
        likes: {
            type: Map,
            of: Boolean
        },
        comments: {
            types: Array,
            default: []
        }
    }, 
    {
        timestamps: true
    }
)
export default mongoose.model("Post", postSchema)