const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin');
const cpdbFormulirRoutes = require('./cpdb/formulir');
const cpdbBerkasRoutes = require('./cpdb/berkas');
const cpdbDataAyahRoutes = require('./cpdb/data-ayah');
const cpdbDataIbuRoutes = require('./cpdb/data-ibu');
const cpdbDataWaliRoutes = require('./cpdb/data-wali');
const cpdbDataPeriodikRoutes = require('./cpdb/data-periodik');
const cpdbRegistrasiPesertaDidikRoutes = require('./cpdb/registrasi-peserta-didik');
const PembayaranCPDBRoutes = require('./cpdb/pembayaran');
const cpdbSettingsRoutes = require('./cpdb/settings');
const { isAuthenticated } = require('../../middleware/auth');

// Apply authentication middleware to all API routes
router.use(isAuthenticated);

// Register API routes
router.use('/admin', adminRoutes);
router.use('/cpdb/formulir', cpdbFormulirRoutes);
router.use('/cpdb/berkas', cpdbBerkasRoutes);
router.use('/cpdb/formulir/data-ayah', cpdbDataAyahRoutes);
router.use('/cpdb/formulir/data-ibu', cpdbDataIbuRoutes);
router.use('/cpdb/formulir/data-wali', cpdbDataWaliRoutes);
router.use('/cpdb/formulir/data-periodik', cpdbDataPeriodikRoutes);
router.use('/cpdb/pembayaran', PembayaranCPDBRoutes);
router.use('/cpdb/formulir/registrasi-peserta-didik', cpdbRegistrasiPesertaDidikRoutes);
router.use('/cpdb/settings', cpdbSettingsRoutes);

module.exports = router;
