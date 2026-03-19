import mongoose from "mongoose"

const announcementSchema = mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    message:{
        type:String,
        required:true
    },

    date:{
        type:Date,
        default:Date.now
    },

    createdBy:{
        type:String,
        default:"Admin"
    }

})

const Announcement = mongoose.model("Announcements",announcementSchema)

export default Announcement