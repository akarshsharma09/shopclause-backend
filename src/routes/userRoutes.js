import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import  protect  from "../middlewares/authMiddleware.js";
const router = express.Router();

// ✅ Signup API
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// GET logged-in user data
router.get("/profile", protect, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL || null,
      role: user.role,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT: Update only name
router.put("/profile", protect, async (req, res) => {
  try {
    const user = req.user; // fetched from JWT
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    user.name = name.trim();
    await user.save();

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL || null,
        role: user.role,
      },
      message: "Name updated successfully",
    });
  } catch (err) {
    console.error("Error updating name:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
