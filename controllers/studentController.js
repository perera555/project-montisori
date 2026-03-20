import Student from "../models/student.js";

// GET ALL
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students); // ✅ returns array
  } catch {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

// GET BY ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Error fetching student" });
  }
};

// CREATE
export const createStudent = async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.json(newStudent);
  } catch {
    res.status(500).json({ message: "Create failed" });
  }
};

// UPDATE
export const updateStudent = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};

// DELETE
export const deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};