import express from "express"
import { getGalleryItems, saveGalleryItem } from "../controllers/galleryController.js"


const galleritemsRouter = express.Router()

galleritemsRouter.get("/",getGalleryItems)

galleritemsRouter.post("/",saveGalleryItem)

export default galleritemsRouter