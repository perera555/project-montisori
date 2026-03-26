import express from "express";
import { createTestimonial, deleteTestimonial, getTestimonials } from "../controllers/testimonialController.js";


const router = express.Router();

// PUBLIC
router.get("/", getTestimonials);
router.post("/", createTestimonial);

// ADMIN DELETE
router.delete("/:id", deleteTestimonial);

export default router;