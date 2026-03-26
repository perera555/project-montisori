import Testimonial from "../models/testimonial.js";

/* CREATE */
export async function createTestimonial(req, res) {
  try {
    const { name, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newTestimonial = await Testimonial.create({ name, message });

    res.json(newTestimonial);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

/* GET ALL */
export async function getTestimonials(req, res) {
  try {
    const data = await Testimonial.find().sort({ createdAt: -1 });
    res.json(data);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

/* DELETE */
export async function deleteTestimonial(req, res) {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}