import express from "express";
import {
  getGalleryItems,
  saveGalleryItem,
  deleteGalleryImage,
} from "../controllers/galleryController.js";
import { auth } from "../auth.js";
import { adminAuth } from "../adminAuth.js";

const router = express.Router();

router.get("/", getGalleryItems);
router.post("/", saveGalleryItem);
router.delete("/image", auth, adminAuth, deleteGalleryImage);

export default router;