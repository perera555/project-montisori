import GalleryItem from "../models/gallery.js";


// ================= GET ALL =================
export async function getGalleryItems(req, res) {
  try {
    const galleries = await GalleryItem.find().sort({ createdAt: -1 });

    res.json(galleries); // ✅ return array (fix .map error)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching gallery" });
  }
}

// ================= SAVE =================
export async function saveGalleryItem(req, res) {
  try {
    const { year, month, activityImages, conversationImages } = req.body;

    const gallery = new GalleryItem({
      year,
      month,
      activityImages,
      conversationImages,
    });

    await gallery.save();

    res.json(gallery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving gallery" });
  }
}

// ================= DELETE IMAGE =================
export async function deleteGalleryImage(req, res) {
  try {
    const { id, index } = req.params;

    const gallery = await GalleryItem.findById(id);

    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    // remove image
    gallery.activityImages.splice(index, 1);

    await gallery.save();

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
}