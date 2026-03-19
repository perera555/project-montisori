import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

import studentsRouter from "./routers/studentRouter.js"
import teachersRouter from "./routers/teacherRouter.js"
import galleritemsRouter from "./routers/gallaryRouter.js"
import announcementsRouter from "./routers/announcementRouter.js"

dotenv.config() // ✅ VERY IMPORTANT

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {

    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (token != null) {

        jwt.verify(token, "secret", (err, decoded) => {

            if (decoded != null) {

                req.user = decoded
                console.log(decoded)
                next()

            } else {
                next()
            }

        })

    } else {
        next()
    }

})

// ✅ Now this will work
const connectionString = process.env.MONGO_URL

console.log("Mongo URL:", connectionString) // debug

mongoose.connect(connectionString)
.then(() => {
    console.log("Connect to the Database")
})
.catch((error) => {
    console.log(error)
    console.log("Connection Failed")
})

app.use("/api/students", studentsRouter)
app.use("/api/teachers", teachersRouter)
app.use("/api/gallery", galleritemsRouter)
app.use("/api/announcements", announcementsRouter)

app.listen(5000, () => {
    console.log("Server Running on Port 5000")
})