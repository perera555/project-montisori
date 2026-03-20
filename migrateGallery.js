import mongoose from "mongoose";
import GalleryItem from "./models/gallery.js";


async function migrate() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/your-db");

    const items = await GalleryItem.find();

    for (let item of items) {
      item.activityImages = item.activityImages.map((img) =>
        typeof img === "string"
          ? { url: img, createdAt: new Date() }
          : img
      );

      item.conversationImages = item.conversationImages.map((img) =>
        typeof img === "string"
          ? { url: img, createdAt: new Date() }
          : img
      );

      await item.save();
    }

    console.log("✅ Migration done!");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

migrate();