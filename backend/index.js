import app from './app.js'
import mongoose from 'mongoose'
import config from './config/index.js'

(async () => {
    try {
        await mongoose.connect(config.DB_URL)
        console.log("DB is connected")

        app.on('error', (error) => {
            console.log("ERROR", error)
            throw error
        })

        const onListening = () => {
            console.log(`APP LISTENING ON PORT ${config.PORT}`)
        }

        app.listen('4000', onListening)

    } catch (error) {
        console.log("ERROR", error)
        throw error
    }
})()