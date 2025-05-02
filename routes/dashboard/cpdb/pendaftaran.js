const express = require('express');
const router = express.Router();
const MasterBiayaJurusan = require('../../../models/MasterBiayaJurusan');
const PembayaranPendaftaran = require('../../../models/PembayaranPendaftaran');
const DetailPembayaranPendaftaran = require('../../../models/DetailPembayaranPendaftaran');
const { isAuthenticated } = require('../../../middleware/auth');
const db = require('../../../config/database');
const RegistrasiPesertaDidik = require('../../../models/RegistrasiPesertaDidik');
const DataPribadi = require('../../../models/DataPribadi');
const DataAyah = require('../../../models/DataAyah');
const DataIbu = require('../../../models/DataIbu');
const DataWali = require('../../../models/DataWali');
const DataPeriodik = require('../../../models/DataPeriodik');
const Berkas = require('../../../models/Berkas');

const validSteps = ['beli-formulir', 'isi-formulir', 'upload-berkas', 'preview-formulir'];
const validSections = [
    'data-pribadi',
    'data-ayah',
    'data-ibu',
    'data-wali',
    'data-periodik',
    'registrasi-peserta-didik',
    'upload-berkas'
];

// Main registration page - redirects to beli-formulir
router.get('/', isAuthenticated, async (req, res) => {
    try {
        // Check if user has a form
        const [formulir] = await db.execute(
            'SELECT * FROM formulir WHERE id_user = ? LIMIT 1',
            [req.user.id]
        );

        // Add formulir data to user object
        const user = {
            ...req.user,
            formulir: formulir[0] || null
        };

        // Get berkas data
        let berkasData = null;
        if (user.formulir) {
            berkasData = await Berkas.findByFormulirId(user.formulir.id_formulir);
        }

        res.render('dashboard/cpdb/pendaftaran', {
            title: 'Pendaftaran - SPMB SMK Jakarta Pusat 1',
            description: 'Pendaftaran CPDB SPMB SMK Jakarta Pusat 1',
            user: user,
            layout: 'layouts/dashboard-cpdb',
            currentPath: '/dashboard/cpdb/pendaftaran',
            currentStep: 'beli-formulir',
            activeTab: 'beli-formulir',
            berkasData: berkasData
        });
    } catch (error) {
        console.error('Error fetching user formulir:', error);
        res.status(500).send('Server error');
    }
});

// Preview formulir route - Must be before /:step route to avoid conflict
router.get('/preview-formulir', isAuthenticated, async (req, res) => {
    try {
        // Check if user has a verified form and complete data
        const [formulir] = await db.execute(
            'SELECT f.*, k.status as kode_status FROM formulir f ' +
            'LEFT JOIN kode_pembayaran k ON f.id_kode_pembayaran = k.id_kode_pembayaran ' +
            'WHERE f.id_user = ? AND f.status = "Terverifikasi" AND f.status_formulir = "Sudah Lengkap" LIMIT 1',
            [req.user.id]
        );

        // Add formulir data to user object
        const user = {
            ...req.user,
            formulir: formulir[0] || null
        };

        // If no verified form or incomplete data, redirect
        if (!user.formulir) {
            return res.redirect('/dashboard/cpdb/pendaftaran/beli-formulir');
        }

        // Get berkas data first to check access
        const berkasData = await Berkas.findByFormulirId(user.formulir.id_formulir);

        // If no berkas, redirect
        if (!berkasData) {
            return res.redirect('/dashboard/cpdb/pendaftaran/upload-berkas');
        }

        // Get all required data using findByFormulirId
        const registrasiPesertaDidik = await RegistrasiPesertaDidik.findByFormulirId(user.formulir.id_formulir);
        const dataPribadi = await DataPribadi.findByFormulirId(user.formulir.id_formulir);
        const dataAyah = await DataAyah.findByFormulirId(user.formulir.id_formulir);
        const dataIbu = await DataIbu.findByFormulirId(user.formulir.id_formulir);
        const dataWali = await DataWali.findByFormulirId(user.formulir.id_formulir);
        const dataPeriodik = await DataPeriodik.findByFormulirId(user.formulir.id_formulir);

        res.render('dashboard/cpdb/pendaftaran', {
            title: 'Pendaftaran - SPMB SMK Jakarta Pusat 1',
            description: 'Pendaftaran CPDB SPMB SMK Jakarta Pusat 1',
            user: user,
            layout: 'layouts/dashboard-cpdb',
            currentPath: '/dashboard/cpdb/pendaftaran',
            currentStep: 'preview-formulir',
            activeTab: 'preview-formulir',
            registrasiPesertaDidik,
            dataPribadi,
            dataAyah,
            dataIbu,
            dataWali,
            dataPeriodik,
            berkasData
        });
    } catch (error) {
        console.error('Error in preview-formulir:', error);
        req.flash('error', 'Terjadi kesalahan saat memuat preview formulir');
        res.redirect('/dashboard/cpdb/pendaftaran');
    }
});

// Form section routes - Must be before /:step route to avoid conflict
router.get('/isi-formulir/:section', isAuthenticated, async (req, res) => {
    if (!validSections.includes(req.params.section)) {
        return res.redirect('/dashboard/cpdb/pendaftaran/isi-formulir');
    }

    try {
        // Check if user has a verified form
        const [formulir] = await db.execute(
            'SELECT f.*, k.status as kode_status FROM formulir f ' +
            'LEFT JOIN kode_pembayaran k ON f.id_kode_pembayaran = k.id_kode_pembayaran ' +
            'WHERE f.id_user = ? AND f.status = "Terverifikasi" LIMIT 1',
            [req.user.id]
        );

        // Add formulir data to user object
        const user = {
            ...req.user,
            formulir: formulir[0] || null
        };

        // If no verified form, redirect to beli-formulir
        if (!user.formulir) {
            return res.redirect('/dashboard/cpdb/pendaftaran/beli-formulir');
        }

        // Get current section index for progress tracking
        const currentSectionIndex = validSections.indexOf(req.params.section);
        
        // Get berkas data
        let berkasData = null;
        if (user.formulir) {
            berkasData = await Berkas.findByFormulirId(user.formulir.id_formulir);
        }

        res.render('dashboard/cpdb/pendaftaran', {
            title: 'Pendaftaran - SPMB SMK Jakarta Pusat 1',
            description: 'Pendaftaran CPDB SPMB SMK Jakarta Pusat 1',
            user: user,
            layout: 'layouts/dashboard-cpdb',
            currentPath: '/dashboard/cpdb/pendaftaran',
            currentStep: 'isi-formulir',
            currentSection: req.params.section,
            currentSectionIndex: currentSectionIndex,
            totalSections: validSections.length,
            activeTab: 'isi-formulir',
            berkasData: berkasData
        });
    } catch (error) {
        console.error('Error fetching user formulir:', error);
        res.status(500).send('Server error');
    }
});

// Payment route
router.get('/pembayaran', isAuthenticated, async (req, res) => {
    try {
        // Check if user has a form
        const [formulir] = await db.execute(
            'SELECT f.*, k.status as kode_status FROM formulir f ' +
            'LEFT JOIN kode_pembayaran k ON f.id_kode_pembayaran = k.id_kode_pembayaran ' +
            'WHERE f.id_user = ? LIMIT 1',
            [req.user.id]
        );

        if (!formulir[0]) {
            return res.redirect('/dashboard/cpdb/pendaftaran/beli-formulir');
        }

        const id_formulir = formulir[0].id_formulir;
        

        // Add formulir data to user object
        const user = {
            ...req.user,
            formulir: formulir[0] || null
        };

        // Get berkas data
        let berkasData = null;
        if (user.formulir) {
            berkasData = await Berkas.findByFormulirId(user.formulir.id_formulir);
        }
        
        // Get registration data
        const query = `
            SELECT 
                r.*,
                j.jurusan as nama_jurusan,
                j.id_jurusan
            FROM registrasi_peserta_didik r
            INNER JOIN jurusan j ON r.jurusan = j.id_jurusan
            WHERE r.id_formulir = ?
        `;
        const [registrationRows] = await db.execute(query, [id_formulir]);
        
        if (!registrationRows || registrationRows.length === 0) {
            return res.redirect('/dashboard/cpdb/pendaftaran/isi-formulir');
        }

        // Get payment info
        const pembayaran = await PembayaranPendaftaran.findByFormulir(id_formulir);
        let detailPembayaran = [];

        if (pembayaran) {
            detailPembayaran = await DetailPembayaranPendaftaran.findByPembayaran(pembayaran.id_pembayaran);
        } 

        res.render('dashboard/cpdb/pendaftaran', {
            title: 'Pembayaran - SPMB SMK Jakarta Pusat 1',
            description: 'Pendaftaran CPDB SPMB SMK Jakarta Pusat 1',
            user: user,
            layout: 'layouts/dashboard-cpdb',
            currentPath: '/dashboard/cpdb/pendaftaran',
            currentStep: 'pembayaran',
            activeTab: 'pembayaran',
            currentSection: null,
            currentSectionIndex: 0,
            totalSections: 6,
            berkasData: berkasData,
            pembayaran,
            detailPembayaran,
            registrationRows
        });
    } catch (error) {
        console.error('Error in pembayaran route:', error);
        res.status(500).render('error', { 
            error: error,
            message: 'Terjadi kesalahan saat memuat halaman pembayaran',
        });
    }
});

// Individual step pages - Must be last to avoid conflicts with other routes
router.get('/:step', isAuthenticated, async (req, res) => {
    if (!validSteps.includes(req.params.step)) {
        return res.redirect('/dashboard/cpdb/pendaftaran/beli-formulir');
    }

    try {
        // Check if user has a form
        const [formulir] = await db.execute(
            'SELECT f.*, k.status as kode_status FROM formulir f ' +
            'LEFT JOIN kode_pembayaran k ON f.id_kode_pembayaran = k.id_kode_pembayaran ' +
            'WHERE f.id_user = ? LIMIT 1',
            [req.user.id]
        );

        // Add formulir data to user object
        const user = {
            ...req.user,
            formulir: formulir[0] || null
        };

        // If trying to access isi-formulir or upload-berkas but hasn't bought form yet
        if ((req.params.step === 'isi-formulir' || req.params.step === 'upload-berkas') && !user.formulir) {
            return res.redirect('/dashboard/cpdb/pendaftaran/beli-formulir');
        }

        // Set default section for isi-formulir
        let currentSection = null;
        if (req.params.step === 'isi-formulir') {
            currentSection = 'data-pribadi';
        }

        // Get berkas data
        let berkasData = null;
        if (user.formulir) {
            berkasData = await Berkas.findByFormulirId(user.formulir.id_formulir);
        }
        
        res.render('dashboard/cpdb/pendaftaran', {
            title: 'Pendaftaran - SPMB SMK Jakarta Pusat 1',
            description: 'Pendaftaran CPDB SPMB SMK Jakarta Pusat 1',
            user: user,
            layout: 'layouts/dashboard-cpdb',
            currentPath: '/dashboard/cpdb/pendaftaran',
            currentStep: req.params.step,
            activeTab: req.params.step,
            currentSection: currentSection,
            currentSectionIndex: currentSection ? 0 : undefined,
            totalSections: 6,
            berkasData: berkasData
        });
    } catch (error) {
        console.error('Error fetching user formulir:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
