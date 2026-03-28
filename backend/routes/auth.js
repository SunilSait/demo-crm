const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { full_name, email, mobile_number, password, confirm_password } = req.body;

  // Validation
  if (!full_name || !email || !mobile_number || !password || !confirm_password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ success: false, message: 'Passwords do not match.' });
  }

  try {
    // Check if email already exists
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    const [result] = await db.execute(
      'INSERT INTO users (full_name, email, mobile_number, password) VALUES (?, ?, ?, ?)',
      [full_name, email, mobile_number, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please log in.',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, full_name: user.full_name },
      process.env.JWT_SECRET || 'alphagnito_jwt_secret_key_2024',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        mobile_number: user.mobile_number
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// POST /api/auth/logout
router.post('/logout', authMiddleware, (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, full_name, email, mobile_number, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({ success: true, user: users[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
