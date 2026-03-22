import express from "express";
import {
  getGalleryItems,
  saveGalleryItem,
  deleteGalleryImage,
} from "../controllers/galleryController.js";

import { auth } from "../auth.js";
import { adminAuth } from "../adminAuth.js";

const router = express.Router();

// GET ALL
router.get("/", getGalleryItems);

// CREATE
router.post("/", saveGalleryItem);

// DELETE IMAGE (FIXED ROUTE)
router.delete("/:id/image/:index", auth, adminAuth, deleteGalleryImage);

export default router;