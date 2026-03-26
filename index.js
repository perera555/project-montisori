import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";

import studentsRouter from "./routers/studentRouter.js";
import teachersRouter from "./routers/teacherRouter.js";
import galleritemsRouter from "./routers/gallaryRouter.js";
import announcementsRouter from "./routers/announcementRouter.js";
import userRouter from "./routers/userRouter.js";
import testimonialRouter from "./routers/testimonialRouter.js"; // ✅ FIXED NAME

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(express.json());

/* ================= CORS ================= */

const allowedOrigins = [
  "http://localhost:5173",
  "https://project-montisori-frontend.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ CORS not allowed: " + origin));
      }
    },
    credentials: true,
  })
);

/* ================= JWT ================= */

app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    console.log("JWT ERROR:", err.message);
  }

  next();
});

/* ================= DATABASE ================= */

const connectionString = process.env.MONGO_URL;

if (!connectionString) {
  console.log("❌ MONGO_URL not found in .env");
  process.exit(1);
}

mongoose
  .connect(connectionString)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.log("❌ MongoDB Error:", error.message));

/* ================= ROUTES ================= */

app.use("/api/users", userRouter);
app.use("/api/students", studentsRouter);
app.use("/api/teachers", teachersRouter);
app.use("/api/gallery", galleritemsRouter);
app.use("/api/announcements", announcementsRouter);
app.use("/api/testimonials", testimonialRouter); // ✅ FIXED

/* ================= TEST ROUTE (DEBUG) ================= */

app.get("/api/testimonials/test", (req, res) => {
  res.send("✅ Testimonials API working");
});

/* ================= ROOT ================= */

app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});