import express from "express"
import { getTeachers, saveTeacher } from "../controllers/teacherController.js"

const teachersRouter = express.Router()

teachersRouter.get("/",getTeachers)

teachersRouter.post("/",saveTeacher)

export default teachersRouter