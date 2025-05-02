const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin');
const cpdbRoutes = require('./cpdb');
const { isAuthenticated } = require('../../middleware/auth');

// Apply authentication middleware to all dashboard routes
router.use(isAuthenticated);

// Register dashboard routes
router.use('/admin', adminRoutes);
router.use('/cpdb', cpdbRoutes);

// GET /dashboard/bendahara - Bendahara Dashboard
router.get('/bendahara', (req, res) => {
    res.render('dashboard/bendahara/index', {
        title: 'Dashboard Bendahara - SPMB SMK Jakarta Pusat 1',
        description: 'Dashboard Bendahara SPMB SMK Jakarta Pusat 1',
        user: req.user,
        layout: 'layouts/dashboard'
    });
});

// GET /dashboard/petugas - Petugas Dashboard
router.get('/petugas', (req, res) => {
    res.render('dashboard/petugas/index', {
        title: 'Dashboard Petugas - SPMB SMK Jakarta Pusat 1',
        description: 'Dashboard Petugas SPMB SMK Jakarta Pusat 1',
        user: req.user,
        layout: 'layouts/dashboard'
    });
});

module.exports = router;
