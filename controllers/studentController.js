import Student from "../models/student.js"


export function getStudents(req,res){

    Student.find().then(
        (students)=>{
            res.json({
                list:students
            })
        }
    ).catch((err)=>{
        res.status(500).json({
            message:"Failed to get students"
        })
    })

}

export function saveStudent(req,res){

    const student = req.body

    const newStudent = new Student(student)

    newStudent.save()
    .then(()=>{
        res.json({
            message:"Student Created Successfully"
        })
    })
    .catch(()=>{
        res.json({
            message:"Student Creation Failed"
        })
    })

}

export function updateStudent(req,res){

    const id = req.body.id

    Student.findByIdAndUpdate(id,req.body)
    .then(()=>{
        res.json({
            message:"Student Updated"
        })
    })
    .catch(()=>{
        res.json({
            message:"Student Update Failed"
        })
    })

}