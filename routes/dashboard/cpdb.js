const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../../middleware/auth');
const pendaftaranRouter = require('./cpdb/pendaftaran');
const kuitansiRouter = require('./cpdb/kuitansi');

// Use the pendaftaran router for /pendaftaran routes
router.use('/pendaftaran', pendaftaranRouter);

// Use the kuitansi router for /pendaftaran/kuitansi routes
router.use('/pendaftaran/kuitansi', kuitansiRouter);

// Main CPDB dashboard
// Main CPDB dashboard
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const db = require('../../config/database');
        
        // Get statistics for each jurusan
        const [jurusanStats] = await db.query(`
            SELECT 
                j.id_jurusan,
                j.jurusan as nama,
                j.kode,
                j.kapasitas,
                j.sisa_kapasitas,
                COALESCE(COUNT(DISTINCT CASE WHEN dpp.status_verifikasi = 'VERIFIED' THEN pp.id_formulir END), 0) as total_siswa
            FROM jurusan j
            LEFT JOIN registrasi_peserta_didik rpd ON j.id_jurusan = rpd.jurusan
            LEFT JOIN formulir f ON rpd.id_formulir = f.id_formulir
            LEFT JOIN pembayaran_pendaftaran pp ON f.id_formulir = pp.id_formulir
            LEFT JOIN detail_pembayaran_pendaftaran dpp ON pp.id_pembayaran = dpp.id_pembayaran
            GROUP BY j.id_jurusan, j.jurusan, j.kode, j.kapasitas, j.sisa_kapasitas
        `);

        // Add color coding for each jurusan
        const jurusanColors = {
            'AK': 'blue',
            'MP': 'green',
            'BR': 'purple',
            'BD': 'yellow',
            'DKV': 'pink',
            'TKJ': 'indigo'
        };

        const jurusanWithColors = jurusanStats.map(jurusan => ({
            ...jurusan,
            warna: jurusanColors[jurusan.kode] || 'gray'
        }));

        res.render('dashboard/cpdb/index', {
            title: 'Dashboard CPDB - SPMB SMK Jakarta Pusat 1',
            description: 'Dashboard CPDB SPMB SMK Jakarta Pusat 1',
            user: req.user,
            layout: 'layouts/dashboard-cpdb',
            currentPath: '/dashboard/cpdb',
            activeMenu: 'dashboard',
            stats: {
                jurusan: jurusanWithColors
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).send('Error fetching dashboard statistics');
    }
});

// Settings page
router.get('/settings', isAuthenticated, (req, res) => {
    res.render('dashboard/cpdb/settings', {
        title: 'Pengaturan Akun - SPMB SMK Jakarta Pusat 1',
        description: 'Pengaturan akun CPDB SPMB SMK Jakarta Pusat 1',
        user: req.user,
        layout: 'layouts/dashboard-cpdb',
        currentPath: '/dashboard/cpdb/settings',
        activeMenu: 'settings'
    });
});

module.exports = router;
