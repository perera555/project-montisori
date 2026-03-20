import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

import User from "../models/user.js";
import OTP from "../models/otpModel.js";
import getDesignEmail from "../emailDesginer.js";

dotenv.config();

/* ================= EMAIL CONFIG ================= */

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

    // ❌ REMOVE PASSWORD FROM RESPONSE
    user.password = undefined;

    res.status(201).json({
      message: "User created",
      user,
    });

  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/* ================= LOGIN ================= */
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.isblocked) {
      return res.status(403).json({ message: "User blocked" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ❌ REMOVE PASSWORD
    user.password = undefined;

    res.json({
      message: "Login success",
      token,
      user,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
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
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.password = undefined;

    res.json({ token: jwtToken, user });

  } catch (err) {
    console.error("GOOGLE LOGIN ERROR:", err);
    res.status(401).json({ message: "Google login failed" });
  }
}

/* ================= USERS ================= */
export async function getUsers(req, res) {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

export function getUser(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.json(req.user);
}

/* ================= ADMIN ================= */
export async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function blockOrUnblockUser(req, res) {
  try {
    await User.updateOne(
      { email: req.params.email },
      { isblocked: req.body.isblocked }
    );

    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

/* ================= OTP ================= */
export async function sentOTP(req, res) {
  try {
    const { email } = req.body;

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
    console.error("OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/* ================= RESET PASSWORD ================= */
export async function changePasswordViaOTP(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    const record = await OTP.findOne({ email });

    if (!record || record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedpassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { email },
      { password: hashedpassword }
    );

    await OTP.deleteOne({ email });

    res.json({ message: "Password updated" });

  } catch (err) {
    console.error("RESET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/* ================= PROFILE ================= */
export async function updateuserData(req, res) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    await User.updateOne(
      { email: req.user.email },
      req.body
    );

    res.json({ message: "Profile updated" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function updatePassword(req, res) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const hashed = await bcrypt.hash(req.body.password, 10);

    await User.updateOne(
      { email: req.user.email },
      { password: hashed }
    );

    res.json({ message: "Password updated" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}