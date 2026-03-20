import express from "express"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import cors from "cors"

import studentsRouter from "./routers/studentRouter.js"
import teachersRouter from "./routers/teacherRouter.js"
import galleritemsRouter from "./routers/gallaryRouter.js"
import announcementsRouter from "./routers/announcementRouter.js"
import userRouter from "./routers/userRouter.js"

dotenv.config()

const app = express()

// ✅ Middleware
app.use(express.json())

// ✅ FIX: Enable CORS (VERY IMPORTANT)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

// ✅ JWT middleware
app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")

  if (token) {
    jwt.verify(token, "secret", (err, decoded) => {
      if (decoded) {
        req.user = decoded
      }
      next()
    })
  } else {
    next()
  }
})

// ✅ MongoDB connection
const connectionString = process.env.MONGO_URL

console.log("Mongo URL:", connectionString)

mongoose.connect(connectionString)
  .then(() => {
    console.log("Connected to the Database")
  })
  .catch((error) => {
    console.log(error)
    console.log("Connection Failed")
  })

// ✅ Routes
app.use("/api/users", userRouter);
app.use("/api/students", studentsRouter)
app.use("/api/teachers", teachersRouter)
app.use("/api/gallery", galleritemsRouter)
app.use("/api/announcements", announcementsRouter)

// ✅ Start server
app.listen(5000, () => {
  console.log("Server Running on Port 5000")
})