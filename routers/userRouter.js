import express from "express";

import {
  createUser,
  loginUser,
  googleLogin,
  getUsers,
  getUser,
  getAllUsers,
  blockOrUnblockUser,
  sentOTP,
  changePasswordViaOTP,
  updateuserData,
  updatePassword
} from "../controllers/userController.js";

const userRouter = express.Router();

/* ================= AUTH ================= */
userRouter.post("/", createUser);              // POST /api/users
userRouter.post("/register", createUser);      // optional
userRouter.post("/login", loginUser);
userRouter.post("/google-login", googleLogin);

/* ================= USER ================= */
userRouter.get("/", getUsers);
userRouter.get("/me", getUser);
userRouter.get("/all", getAllUsers);

/* ================= OTP ================= */
userRouter.post("/otp", sentOTP);
userRouter.post("/reset-password", changePasswordViaOTP);

/* ================= PROFILE ================= */
userRouter.put("/update", updateuserData);
userRouter.put("/password", updatePassword);

/* ================= ADMIN ================= */
userRouter.put("/block/:email", blockOrUnblockUser);

export default userRouter;