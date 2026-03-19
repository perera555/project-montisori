import mongoose from "mongoose"

const studentSchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    age:{
        type:Number,
        required:true
    },

    parentName:{
        type:String,
        required:true
    },

    contact:{
        type:String,
        required:true
    }

})

const Student = mongoose.model("Students", studentSchema)

export default Student