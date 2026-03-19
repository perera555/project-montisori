import express from "express"
import { deleteAnnouncement, getAnnouncements, saveAnnouncement, updateAnnouncement } from "../controllers/announcementController.js"



const announcementsRouter = express.Router()

announcementsRouter.get("/",getAnnouncements)

announcementsRouter.post("/",saveAnnouncement)

announcementsRouter.put("/",updateAnnouncement)

announcementsRouter.delete("/:id",deleteAnnouncement)

export default announcementsRouter