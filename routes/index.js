const express = require('express');
const router = express.Router();
const apiRoutes = require('./api');
const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');
const { isAuthenticated } = require('../middleware/auth');

// API Routes
router.use('/api', apiRoutes);

// Auth Routes
router.use('/auth', authRoutes);

// Dashboard Routes
router.use('/dashboard', dashboardRoutes);

// GET / - Homepage
router.get('/', (req, res) => {
    // If user is authenticated, redirect to their dashboard
    if (req.user) {
        switch (req.user.roles) {
            case 'Admin':
                return res.redirect('/dashboard/admin');
            case 'Bendahara':
                return res.redirect('/dashboard/admin');
            case 'Petugas':
                return res.redirect('/dashboard/admin');
            case 'CPDB':
                return res.redirect('/dashboard/cpdb');
            default:
                return res.redirect('/auth');
        }
    }

    // If not authenticated, show homepage
    res.render('index', {
        title: 'SPMB SDIT Salsabila 3 Banguntapan',
        description: 'Sistem Penerimaan Murid Baru SDIT Salsabila 3 Banguntapan',
        layout: 'layouts/main'
    });
});

// Catch-all route for handling 404s
router.use((req, res) => {
    res.status(404).render('error', {
        title: '404 Not Found - SPMB SDIT Salsabila 3 Banguntapan',
        message: 'Halaman Tidak Ditemukan',
        error: {
            status: 404,
            stack: 'Halaman yang Anda cari tidak ditemukan.'
        },
        layout: false
    });
});

module.exports = router;
