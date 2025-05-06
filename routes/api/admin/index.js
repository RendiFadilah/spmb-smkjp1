const express = require('express');
const router = express.Router();
const petugasRoutes = require('./petugas');
const cpdbAwalRoutes = require('./cpdb-awal');
const cpdbTetapRoutes = require('./cpdb-tetap');
const kodePembayaranRoutes = require('./kode-pembayaran');
const formulirRoutes = require('./formulir');
const pembayaranRoutes = require('./pembayaran');
const rewardsRoutes = require('./rewards');
const seragamRoutes = require('./seragam');
const biayaRoutes = require('./biaya');
const settingsRoutes = require('./settings');
const jurusanRoutes = require('./jurusan');
const periodeRoutes = require('./periode');
const diskonRoutes = require('./diskon');
const { isAuthenticated, isAdmin } = require('../../../middleware/auth');

// Apply auth middlewares to all routes
router.use(isAuthenticated);
router.use(isAdmin);

// Register routes
router.use('/petugas', petugasRoutes);
router.use('/cpdb-awal', cpdbAwalRoutes);
router.use('/cpdb-tetap', cpdbTetapRoutes);
router.use('/kode-pembayaran', kodePembayaranRoutes);
router.use('/formulir', formulirRoutes);
router.use('/pembayaran', pembayaranRoutes);
router.use('/rewards', rewardsRoutes);
router.use('/seragam', seragamRoutes);
router.use('/biaya', biayaRoutes);
router.use('/settings', settingsRoutes);
router.use('/jurusan', jurusanRoutes);
router.use('/periode', periodeRoutes);
router.use('/diskon', diskonRoutes);

module.exports = router;
