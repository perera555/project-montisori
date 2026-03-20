import express from "express";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} from "../controllers/studentController.js";

const router = express.Router();

// ROUTES
router.get("/", getStudents);
router.get("/:id", getStudentById); // 🔥 IMPORTANT
router.post("/", createStudent);
router.put("/:id", updateStudent); // 🔥 FIXED
router.delete("/:id", deleteStudent);

export default router;