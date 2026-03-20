import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

import User from "../models/user.js";
import OTP from "../models/otpModel.js";
import getDesignEmail from "../emailDesginer.js";

dotenv.config();

/* ================= CONFIG ================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

/* ================= CREATE USER ================= */
export async function createUser(req, res) {
  try {
    console.log("BODY:", req.body);

    const { email, firstName, lastName, password } = req.body;

    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      firstName,
      lastName,
      password: hashedpassword,
      role: "user",
    });

    res.status(201).json({
      message: "✅ User created",
      user,
    });

  } catch (err) {
    console.error("CREATE ERROR:", err);

    res.status(500).json({
      message: "Error creating user",
      error: err.message,
    });
  }
}

/* ================= LOGIN ================= */
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.isblocked)
      return res.status(403).json({ message: "User blocked" });

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "✅ Login success",
      token,
      user,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/* ================= GOOGLE LOGIN ================= */
export async function googleLogin(req, res) {
  try {
    const { token } = req.body;

    const googleRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { email, given_name, family_name, picture } = googleRes.data;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        firstName: given_name,
        lastName: family_name,
        password: await bcrypt.hash("googleUser", 10),
        isEmailVerified: true,
        image: picture,
      });
    }

    const jwtToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET
    );

    res.json({ token: jwtToken, user });

  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Google login failed" });
  }
}

/* ================= USERS ================= */
export async function getUsers(req, res) {
  const users = await User.find();
  res.json(users);
}

export function getUser(req, res) {
  if (!req.user)
    return res.status(401).json({ message: "Unauthorized" });

  res.json(req.user);
}

/* ================= ADMIN ================= */
export async function getAllUsers(req, res) {
  const users = await User.find();
  res.json(users);
}

export async function blockOrUnblockUser(req, res) {
  await User.updateOne(
    { email: req.params.email },
    { isblocked: req.body.isblocked }
  );

  res.json({ message: "Updated" });
}

/* ================= OTP ================= */
export async function sentOTP(req, res) {
  try {
    const email = req.body.email;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.findOneAndUpdate(
      { email },
      { otp },
      { upsert: true }
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Code",
      html: getDesignEmail({ otp }),
    });

    res.json({ message: "OTP sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/* ================= RESET PASSWORD ================= */
export async function changePasswordViaOTP(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    const record = await OTP.findOne({ email });

    if (!record || record.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    const hashedpassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { email },
      { password: hashedpassword }
    );

    await OTP.deleteOne({ email });

    res.json({ message: "Password updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/* ================= PROFILE ================= */
export async function updateuserData(req, res) {
  await User.updateOne(
    { email: req.user.email },
    req.body
  );

  res.json({ message: "Profile updated" });
}

export async function updatePassword(req, res) {
  const hashed = await bcrypt.hash(req.body.password, 10);

  await User.updateOne(
    { email: req.user.email },
    { password: hashed }
  );

  res.json({ message: "Password updated" });
}