import express from "express";
import {
  getTeachers,
  saveTeacher,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";

const router = express.Router();

router.get("/", getTeachers);
router.get("/:id", getTeacherById);
router.post("/", saveTeacher);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);

export default router;