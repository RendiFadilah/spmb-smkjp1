const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');

// Import route modules
const formulirRoutes = require('./formulir');
const pembayaranRoutes = require('./pembayaran');
const settingsRoutes = require('./settings');

// Register routes
router.use('/formulir', formulirRoutes);
router.use('/pembayaran', pembayaranRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;
