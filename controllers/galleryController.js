import GalleryItem from "../models/gallery.js"


export function getGalleryItems(req,res){

    GalleryItem.find().then(
        (items)=>{
            res.json({
                list:items
            })
        }
    )

}

export function saveGalleryItem(req,res){

    const item = new GalleryItem(req.body)

    item.save().then(()=>{
        res.json({
            message:"Gallery Item Added"
        })
    })

}