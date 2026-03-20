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

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */

// ✅ Parse JSON
app.use(express.json());

// ✅ CORS (frontend connection)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

/* ================= JWT MIDDLEWARE ================= */

app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // ✅ No token → continue
  if (!token) return next();

  try {
    // ✅ FIXED: use env secret
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

mongoose.connect(connectionString)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.log("❌ MongoDB Error:", error.message);
  });

/* ================= ROUTES ================= */

app.use("/api/users", userRouter);
app.use("/api/students", studentsRouter);
app.use("/api/teachers", teachersRouter);
app.use("/api/gallery", galleritemsRouter);
app.use("/api/announcements", announcementsRouter);

/* ================= SERVER ================= */

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});