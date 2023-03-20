import cloudinary from 'cloudinary'
import config from './index.js'

const uploadImage = async (files) => {
    cloudinary.config({
        cloud_name: config.CLOUD_NAME,
        api_key: config.CLOUD_KEY,
        api_secret: config.CLOUD_SECRET
    })

    const result = await cloudinary.v2.uploader.upload(files, {
        folder: 'images'
    })

    return result
}

export default uploadImage