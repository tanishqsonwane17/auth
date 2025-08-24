const express = require('express');
const app = express();
const userModel = require('./models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');   
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());

// REGISTER
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email already exists?
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Password ko hash karna
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      email,
      password: hashedPassword
    });

    // Token generate
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Cookie me token bhejna
    res.cookie('token', token, { httpOnly: true });

    // Response (password hide)
    res.json({
      message: "User registered successfully",
      user: { id: user._id, email: user.email },
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // User find karna
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Password check karna
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email or password incorrect' });
    }

    // Token generate
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Cookie me token bhejna
    res.cookie('token', token, { httpOnly: true });

    // Response (password hide)
    res.json({
      message: "Login successful",
      user: { id: user._id, email: user.email },
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = app;
