import express from "express"
import { getStudents, saveStudent, updateStudent } from "../controllers/studentController.js"


const studentsRouter = express.Router()

studentsRouter.get("/",getStudents)

studentsRouter.post("/",saveStudent)

studentsRouter.put("/",updateStudent)

export default studentsRouter