import mongoose from "mongoose"

const gallerySchema = mongoose.Schema({

    year:{
        type:Number,
        required:true
    },

    month:{
        type:String,
        required:true
    },

    images:{
        type:[String],
        required:true
    }

})

const GalleryItem = mongoose.model("GalleryItems", gallerySchema)

export default GalleryItem