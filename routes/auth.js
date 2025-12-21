const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { rateLimit: rateLimitConfig } = require('../middleware/auth');

// Validate JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET not found in environment variables. Using fallback secret.');
  console.warn('Please add JWT_SECRET to your .env file for production use.');
}

// Apply rate limiting to login route
const loginLimiter = rateLimit(rateLimitConfig);

// GET /auth - Render login/register page
router.get('/', (req, res) => {
  res.render('auth/auth', {
    title: 'Login/Register - SPMB SMK Jakarta Pusat 1',
    description: 'Halaman Login dan Registrasi SPMB SMK Jakarta Pusat 1',
    message: req.flash('message'),
    layout: false
  });
});

// POST /auth/register - Handle registration
router.post('/register', async (req, res) => {
  try {
    const {
      nama_lengkap,
      nomor_whatsapp,
      nik,
      nisn,
      asal_smp,
      jenis_kelamin,
      password,
      password_confirm
    } = req.body;

    // Validate required fields
    if (!nama_lengkap || !nomor_whatsapp || !nik || !nisn || !asal_smp || !jenis_kelamin || !password || !password_confirm) {
      req.flash('message', 'Semua field harus diisi lengkap');
      return res.redirect('/auth');
    }

    // Validate WhatsApp number format
    const whatsappRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    if (!whatsappRegex.test(nomor_whatsapp)) {
      req.flash('message', 'Format nomor WhatsApp tidak valid');
      return res.redirect('/auth');
    }

    // Validate NISN format (10 digits)
    const nisnRegex = /^\d{10}$/;
    if (!nisnRegex.test(nisn)) {
      req.flash('message', 'NISN harus 10 digit angka');
      return res.redirect('/auth');
    }

    // Validate password match
    if (password !== password_confirm) {
      req.flash('message', 'Password tidak cocok');
      return res.redirect('/auth');
    }

    // Validate NIK format (16 digits)
    const nikRegex = /^\d{16}$/;
    if (!nikRegex.test(nik)) {
      req.flash('message', 'NIK harus 16 digit angka');
      return res.redirect('/auth');
    }

    // Check if user already exists
    const existingUserWhatsApp = await User.findByWhatsApp(nomor_whatsapp);
    const existingUserNIK = await User.findByNIK(nik);
    if (existingUserWhatsApp) {
      req.flash('message', 'Nomor WhatsApp sudah terdaftar');
      return res.redirect('/auth');
    }
    if (existingUserNIK) {
      req.flash('message', 'NIK sudah terdaftar');
      return res.redirect('/auth');
    }

    // Create new user
    await User.create({
      nama_lengkap,
      nomor_whatsapp,
      nik,
      nisn,
      asal_smp,
      jenis_kelamin,
      password
    });

    req.flash('message', 'Registrasi berhasil! Silakan login untuk melanjutkan');
    res.redirect('/auth');
  } catch (error) {
    console.error(error);
    req.flash('message', 'Terjadi kesalahan saat registrasi. Silakan coba lagi');
    res.redirect('/auth');
  }
});

// POST /auth/login - Handle login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Validate required fields
    if (!identifier || !password) {
      req.flash('message', 'NIK/Nomor WhatsApp dan password harus diisi lengkap');
      return res.redirect('/auth');
    }

    // Find user
    const user = await User.findByNIKOrWhatsApp(identifier);
    if (!user) {
      req.flash('message', 'NIK/Nomor WhatsApp atau password salah');
      return res.redirect('/auth');
    }

    // Validate password
    const isValidPassword = await User.validatePassword(password, user.password);
    if (!isValidPassword) {
      req.flash('message', 'Nomor WhatsApp atau password salah');
      return res.redirect('/auth');
    }

    // Create JWT token
    const jwtSecret = process.env.JWT_SECRET || 'spmb-smkjp1-jwt-fallback-secret-key-change-in-production';
    const token = jwt.sign(
      {
        id: user.id_user,
        roles: user.roles,
        nama: user.nama_lengkap,
      },
      jwtSecret,
      { expiresIn: '1d' }
    );

    // Store token in session
    req.session.token = token;

    // Redirect based on role
    switch (user.roles) {
      case 'Admin':
        res.redirect('/dashboard/admin');
        break;
      case 'Bendahara':
        res.redirect('/dashboard/admin');
        break;
      case 'Petugas':
        res.redirect('/dashboard/admin');
        break;
      case 'CPDB':
        res.redirect('/dashboard/cpdb');
        break;
      default:
        res.redirect('/');
    }
  } catch (error) {
    console.error(error);
    req.flash('message', 'Terjadi kesalahan saat login. Silakan coba lagi');
    res.redirect('/auth');
  }
});

// POST /auth/logout - Handle logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
