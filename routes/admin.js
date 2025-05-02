const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');

// Apply admin middleware to all routes
router.use(isAdmin);

// GET /admin/dashboard - Admin Dashboard
router.get('/dashboard', (req, res) => {
    res.render('dashboard/admin/index', {
        title: 'Dashboard Admin - SPMB SMK Jakarta Pusat 1',
        description: 'Dashboard Admin SPMB SMK Jakarta Pusat 1',
        user: req.user,
        layout: 'layouts/dashboard'
    });
});

// GET /admin/petugas - Petugas Management
router.get('/petugas', (req, res) => {
    res.render('dashboard/admin/petugas/index', {
        title: 'Manajemen Petugas - SPMB SMK Jakarta Pusat 1',
        description: 'Manajemen Petugas SPMB SMK Jakarta Pusat 1',
        user: req.user,
        layout: 'layouts/dashboard'
    });
});

module.exports = router;
