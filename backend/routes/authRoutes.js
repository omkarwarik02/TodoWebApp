const express = require("express");
const bcrypt  = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("JWT_SECRET not defined in .env!");
}

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User Exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save User
    const user = new User({ email, password: hashedPassword });
    await user.save();
  

    // Create Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send response
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Register error:', err); //  logs exact error
    res.status(500).json({ msg: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req,res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });

  } catch (err) {
    console.error('Login error:', err); //  logs exact error
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
