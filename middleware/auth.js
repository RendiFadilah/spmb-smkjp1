const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Rate limiting configuration
exports.rateLimit = {
  windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000, // Convert minutes to milliseconds
  max: process.env.RATE_LIMIT_MAX, // Limit each IP to X requests per windowMs
  message: 'Terlalu banyak percobaan login, silakan coba lagi nanti',
  standardHeaders: true,
  legacyHeaders: false
};

// Middleware to check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.session.token;

    if (!token) {
      if (req.xhr || req.path.startsWith('/api/')) {
        return res.status(401).json({ message: 'Silakan login terlebih dahulu' });
      }
      req.flash('message', 'Silakan login terlebih dahulu');
      return res.redirect('/auth');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      if (req.xhr || req.path.startsWith('/api/')) {
        return res.status(401).json({ message: 'User tidak ditemukan' });
      }
      req.session.destroy();
      req.flash('message', 'User tidak ditemukan');
      return res.redirect('/auth');
    }

    // Add user info to request object
    req.user = {
      id: user.id_user,
      nama: user.nama_lengkap,
      roles: user.roles,
      nomor_whatsapp: user.nomor_whatsapp,
      nisn: user.nisn,
      nik: user.nik, // Add NIK from user data
      asal_smp: user.asal_smp,
      jenis_kelamin: user.jenis_kelamin,
      status_wawancara: user.status_wawancara,
      tanggal_daftar: user.tanggal_daftar
    };

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    if (req.xhr || req.path.startsWith('/api/')) {
      return res.status(401).json({ message: 'Sesi anda telah berakhir, silakan login kembali' });
    }
    req.session.destroy();
    req.flash('message', 'Sesi anda telah berakhir, silakan login kembali');
    res.redirect('/auth');
  }
};

// Middleware to check user role
exports.checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      if (req.xhr || req.path.startsWith('/api/')) {
        return res.status(401).json({ message: 'Silakan login terlebih dahulu' });
      }
      req.flash('message', 'Silakan login terlebih dahulu');
      return res.redirect('/auth');
    }

    if (!allowedRoles.includes(req.user.roles)) {
      if (req.xhr || req.path.startsWith('/api/')) {
        return res.status(403).json({ message: 'Anda tidak memiliki akses ke halaman ini' });
      }
      return res.render('error', {
        title: 'Akses Ditolak - SPMB SMK Jakarta Pusat 1',
        message: 'Akses Ditolak',
        error: {
          status: 403,
          stack: 'Anda tidak memiliki akses ke halaman ini'
        },
        layout: false
      });
    }

    next();
  };
};

// Middleware to prevent authenticated users from accessing auth pages
exports.isNotAuthenticated = (req, res, next) => {
  if (req.session.token) {
    return res.redirect('/');
  }
  next();
};

// Middleware to add user data to all views
exports.addUserData = (req, res, next) => {
  res.locals.user = req.user || null;
  next();
};

// Middleware to check if user is admin, petugas, or bendahara
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Silakan login terlebih dahulu' });
  }

  if (req.user.roles !== 'Admin' && req.user.roles !== 'Petugas' && req.user.roles !== 'Bendahara') {
    return res.status(403).json({ message: 'Anda tidak memiliki akses ke halaman ini' });
  }

  next();
};

// Middleware to handle expired sessions
exports.handleExpiredSession = (err, req, res, next) => {
  if (err.name === 'TokenExpiredError') {
    req.session.destroy();
    if (req.xhr || req.path.startsWith('/api/')) {
      return res.status(401).json({ message: 'Sesi anda telah berakhir, silakan login kembali' });
    }
    req.flash('message', 'Sesi anda telah berakhir, silakan login kembali');
    return res.redirect('/auth');
  }
  next(err);
};
