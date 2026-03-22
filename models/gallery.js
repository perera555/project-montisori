import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: String,

  // ✅ NEW FIELDS (added only)
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const gallerySchema = new mongoose.Schema({
  year: { type: Number, required: true },
  month: { type: String, required: true },

  activityImages: {
    type: [imageSchema],
    default: [],
  },

  conversationImages: {
    type: [imageSchema],
    default: [],
  },
});

const GalleryItem = mongoose.model("GalleryItems", gallerySchema);
export default GalleryItem;