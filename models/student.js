import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    parentName: { type: String, required: true },
    contact: { type: String, required: true },
    image: { type: String, default: "" }
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;