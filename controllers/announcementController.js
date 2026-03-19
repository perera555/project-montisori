import Announcement from "../models/announcement.js"


export function getAnnouncements(req,res){

    Announcement.find().then(

        (announcements)=>{

            res.json({
                list:announcements
            })

        }

    ).catch((err)=>{

        res.status(500).json({
            message:"Failed to get announcements"
        })

    })

}



export function saveAnnouncement(req,res){

    const announcement = new Announcement(req.body)

    announcement.save()

    .then(()=>{

        res.json({
            message:"Announcement Added Successfully"
        })

    })

    .catch(()=>{

        res.json({
            message:"Announcement Creation Failed"
        })

    })

}



export function updateAnnouncement(req,res){

    const id = req.body.id

    Announcement.findByIdAndUpdate(id,req.body)

    .then(()=>{

        res.json({
            message:"Announcement Updated"
        })

    })

    .catch(()=>{

        res.json({
            message:"Announcement Update Failed"
        })

    })

}



export function deleteAnnouncement(req,res){

    const id = req.params.id

    Announcement.findByIdAndDelete(id)

    .then(()=>{

        res.json({
            message:"Announcement Deleted"
        })

    })

    .catch(()=>{

        res.json({
            message:"Delete Failed"
        })

    })

}