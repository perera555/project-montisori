import mongoose from "mongoose"

const teacherSchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    experience:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    }

})

const Teacher = mongoose.model("Teachers", teacherSchema)

export default Teacher