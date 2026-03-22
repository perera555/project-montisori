import GalleryItem from "../models/gallery.js";

/* ================= GET ================= */
export async function getGalleryItems(req, res) {
  try {
    const items = await GalleryItem.find();
    res.json({ list: items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/* ================= SAVE ================= */
export async function saveGalleryItem(req, res) {
  try {
    const { year, month, activityImages, conversationImages } = req.body;

    if (!year || !month) {
      return res.status(400).json({ error: "Year and month required" });
    }

    // ✅ UPDATED (supports title + description + old format)
    const formatImages = (imgs = []) =>
      imgs.map((img) => {
        if (typeof img === "string") {
          return {
            url: img,
            title: "",
            description: "",
            createdAt: new Date(),
          };
        }

        return {
          url: img.url,
          title: img.title || "",
          description: img.description || "",
          createdAt: img.createdAt || new Date(),
        };
      });

    let gallery = await GalleryItem.findOne({ year, month });

    if (gallery) {
      gallery.activityImages = formatImages(activityImages);
      gallery.conversationImages = formatImages(conversationImages);
    } else {
      gallery = new GalleryItem({
        year,
        month,
        activityImages: formatImages(activityImages),
        conversationImages: formatImages(conversationImages),
      });
    }

    await gallery.save();

    res.json({ message: "Saved successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: "Save failed ❌" });
  }
}

/* ================= DELETE ================= */
export async function deleteGalleryImage(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin only 🚫" });
    }

    const { year, month, image, type } = req.body;

    if (!year || !month || !image || !type) {
      return res.status(400).json({ error: "Missing data" });
    }

    const gallery = await GalleryItem.findOne({ year, month });

    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    if (type === "activity") {
      gallery.activityImages = gallery.activityImages.filter(
        (img) => img.url !== image
      );
    } else {
      gallery.conversationImages = gallery.conversationImages.filter(
        (img) => img.url !== image
      );
    }

    await gallery.save();

    res.json({ message: "Image deleted successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed ❌" });
  }
}