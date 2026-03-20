import Teacher from "../models/teachers.js";

// GET ALL
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json({ list: teachers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ONE
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
export const saveTeacher = async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.json({ message: "Teacher Added Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateTeacher = async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({
      message: "Teacher Updated Successfully",
      teacher: updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: "Teacher Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};