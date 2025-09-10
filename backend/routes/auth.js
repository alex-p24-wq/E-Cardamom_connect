import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import nodemailer from "nodemailer";
import EmailOTP from "../models/EmailOTP.js";

const router = express.Router();

// Email transporter
const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : nodemailer.createTransport({ jsonTransport: true }); // dev fallback: logs emails to console

// Validation middleware
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .matches(/^[A-Za-z0-9_.-]+$/).withMessage('Username can contain letters, numbers, dot, dash, underscore only'),
  body('email')
    .isEmail().withMessage('Enter a valid email')
    .normalizeEmail(),
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\+?[1-9]\d{9,14}$/).withMessage('Enter a valid phone number (e.g., +12345678901)'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number')
    .matches(/[^A-Za-z0-9]/).withMessage('Password must contain a special character'),
  body('role')
    .isIn(['customer', 'farmer', 'agricare', 'hub', 'admin']).withMessage('Invalid role')
];

// Register endpoint (requires verified email)
router.post('/register', registerValidation, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, phone, password, role, profileData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }

    // Enforce email verification: must have a valid unexpired OTP entry already verified
    // We will consider verified if there is NO pending OTP for this email.
    const pendingOtp = await EmailOTP.findOne({ email: email.toLowerCase() });
    if (pendingOtp) {
      return res.status(400).json({ message: 'Please verify your email via OTP before registering' });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      phone,
      password, // Will be hashed by the pre-save middleware
      role,
      profileData
    });

    // Save user to database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Generate email OTP
router.post('/send-email-otp', [
  body('email').isEmail().withMessage('Enter a valid email').normalizeEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;
  try {
    // Rate limit: remove existing OTP for this email
    await EmailOTP.deleteMany({ email: email.toLowerCase() });

    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
    const bcrypt = await import('bcrypt');
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(otp, salt);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await EmailOTP.create({ email: email.toLowerCase(), otpHash, expiresAt });

    const mailOpts = {
      from: process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@example.com',
      to: email,
      subject: 'Your Cardo verification code',
      text: `Your verification code is ${otp}. It expires in 5 minutes.`,
      html: `<p>Your verification code is <b>${otp}</b>. It expires in 5 minutes.</p>`
    };

    const info = await transporter.sendMail(mailOpts);
    // Dev fallback logs info or JSON transport result

    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify email OTP
router.post('/verify-email-otp', [
  body('email').isEmail().withMessage('Enter a valid email').normalizeEmail(),
  body('otp').isLength({ min: 4, max: 8 }).withMessage('Invalid OTP')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, otp } = req.body;
  try {
    const record = await EmailOTP.findOne({ email: email.toLowerCase() });
    if (!record) return res.status(400).json({ message: 'OTP not found or already used' });
    if (new Date() > record.expiresAt) {
      await EmailOTP.deleteOne({ _id: record._id });
      return res.status(400).json({ message: 'OTP expired' });
    }

    const bcrypt = await import('bcrypt');
    const isMatch = await bcrypt.compare(otp, record.otpHash);
    if (!isMatch) {
      // increment attempts and optionally block after N tries
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // success — remove the OTP so registration is allowed
    await EmailOTP.deleteOne({ _id: record._id });
    return res.json({ message: 'Email verified' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

// Login endpoint
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;