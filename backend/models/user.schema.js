import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config/index.js'

const userSchema = mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            min: 2,
            max: 50
        },
        lastname: {
            type: String,
            required: true,
            min: 2,
            max: 50
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 50
        },
        password: {
            type: String,
            required: true,
            min: 8,
            max: 50,
            select: false
        },
        picturePath: {
            type: String,
            default: ""
        },
        friends: {
            type: Array,
            default: []
        },
        location: String,
        occupation: String,
        viewedProfile: Number,
        impressions: Number
    }, 
    {
        timestamps: true
    }
)

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods = {
    comparePassword: async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password)
    },

    getJwtToken: function() {
        return jwt.sign(
            {
                _id: this._id,
                email: this.email
            },
            config.JWT_SECRET,
            {
                expiresIn: config.JWT_EXPIRY
            }
        )
    },
}

export default mongoose.model("User", userSchema)