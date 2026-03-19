import Teacher from "../models/teachers.js"


export function getTeachers(req,res){

    Teacher.find().then(
        (teachers)=>{
            res.json({
                list:teachers
            })
        }
    )

}

export function saveTeacher(req,res){

    const teacher = new Teacher(req.body)

    teacher.save().then(()=>{
        res.json({
            message:"Teacher Added Successfully"
        })
    })

}