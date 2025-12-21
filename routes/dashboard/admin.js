const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../../middleware/auth');
const PembayaranPendaftaran = require('../../models/PembayaranPendaftaran');
const DetailPembayaranPendaftaran = require('../../models/DetailPembayaranPendaftaran');
const db = require('../../config/database');

// Apply auth middlewares to all routes
router.use(isAuthenticated);
router.use(isAdmin);


// GET /dashboard/admin - Admin Dashboard
router.get('/', async (req, res) => {
    try {
        // Get total CPDB Awal (users with role CPDB)
        const [cpdbAwalResult] = await db.query(
            'SELECT COUNT(*) as total FROM users WHERE roles = "CPDB"'
        );
        const totalCPDBAwal = cpdbAwalResult[0].total;

        // Get total CPDB Tetap (verified payments)
        const [cpdbTetapResult] = await db.query(`
            SELECT COUNT(DISTINCT pp.id_formulir) as total 
            FROM pembayaran_pendaftaran pp
            JOIN detail_pembayaran_pendaftaran dpp ON pp.id_pembayaran = dpp.id_pembayaran
            WHERE dpp.status_verifikasi = 'VERIFIED'
        `);
        const totalCPDBTetap = cpdbTetapResult[0].total;

        // Get total Formulir
        const [formulirResult] = await db.query(
            'SELECT COUNT(*) as total FROM formulir'
        );
        const totalFormulir = formulirResult[0].total;

        // Get kuotaKeseluruhan (sum sisa_kapasitas from jurusan)
        const [kuotaKeseluruhanResult] = await db.query(`
            SELECT COALESCE(SUM(sisa_kapasitas), 0) as total FROM jurusan
        `);
        const sisaKuotaKeseluruhan = kuotaKeseluruhanResult[0].total;

        // Get Pembayaran Hari Ini (sum nominal_pembayaran where tanggal_pembayaran is today)
        const [pembayaranHariIniResult] = await db.query(`
            SELECT COALESCE(SUM(nominal_pembayaran), 0) as total 
            FROM detail_pembayaran_pendaftaran 
            WHERE DATE(tanggal_pembayaran) = CURDATE()
        `);
        const pembayaranHariIni = pembayaranHariIniResult[0].total;

        // Get Pembayaran Keseluruhan (sum nominal_pembayaran overall)
        const [pembayaranKeseluruhanResult] = await db.query(`
            SELECT COALESCE(SUM(nominal_pembayaran), 0) as total 
            FROM detail_pembayaran_pendaftaran
        `);
        const pembayaranKeseluruhan = pembayaranKeseluruhanResult[0].total;

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

        res.render('dashboard/admin/index', {
            title: 'Dashboard Admin - SPMB SMK Jakarta Pusat 1',
            description: 'Dashboard Admin SPMB SMK Jakarta Pusat 1',
            user: req.user,
            layout: 'layouts/dashboard',
            currentPath: '/dashboard/admin',
            stats: {
                cpdbAwal: totalCPDBAwal,
                cpdbTetap: totalCPDBTetap,
                formulir: totalFormulir,
                kuotaKeseluruhan: sisaKuotaKeseluruhan,
                pembayaranHariIni: pembayaranHariIni,
                pembayaranKeseluruhan: pembayaranKeseluruhan,
                jurusan: jurusanWithColors
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).send('Error fetching dashboard statistics');
    }
});

// GET /dashboard/admin/petugas - Petugas Management
router.get('/petugas', (req, res) => {
    res.render('dashboard/admin/petugas/index', {
        title: 'Manajemen Petugas - SPMB SMK Jakarta Pusat 1',
        description: 'Manajemen Petugas SPMB SMK Jakarta Pusat 1',
        user: req.user,
        layout: 'layouts/dashboard',
        currentPath: '/dashboard/admin/petugas'
    });
});

// GET /dashboard/admin/jurusan - Jurusan Management
router.get('/jurusan', (req, res) => {
    res.render('dashboard/admin/jurusan/index', {
        title: 'Manajemen Jurusan - SPMB SMK Jakarta Pusat 1',
        description: 'Manajemen Jurusan SPMB SMK Jakarta Pusat 1',
        user: req.user,
        layout: 'layouts/dashboard',
        currentPath: '/dashboard/admin/jurusan'
    });
});

// GET /dashboard/admin/cpdb-awal - CPDB Awal Management
router.get('/cpdb-awal', (req, res) => {
    res.render('dashboard/admin/cpdb-awal/index', {
        title: 'Manajemen CPDB Awal - SPMB SMK Jakarta Pusat 1',
        description: 'Manajemen Calon Peserta Didik Baru SPMB SMK Jakarta Pusat 1',
        user: req.user,
        layout: 'layouts/dashboard',
        currentPath: '/dashboard/admin/cpdb-awal'
    });
});

// GET /dashboard/admin/cpdb-tetap - CPDB Tetap Management
router.get('/cpdb-tetap', (req, res) => {
    res.render('dashboard/admin/cpdb-tetap/index', {
        title: 'CPDB Tetap - SPMB SMK Jakarta Pusat 1',
        description: 'Data Calon Peserta Didik Baru yang Sudah Terverifikasi',
        user: req.user,
        layout: 'layouts/dashboard',
        currentPath: '/dashboard/admin/cpdb-tetap'
    });
});

// GET /dashboard/admin/formulir/kode-pembayaran - Kode Pembayaran Management
router.get('/formulir/kode-pembayaran', (req, res) => {
    res.render('dashboard/admin/formulir/kode-pembayaran/index', {
        title: 'Manajemen Kode Pembayaran - SPMB SMK Jakarta Pusat 1',
        description: 'Manajemen Kode Pembayaran SPMB SMK Jakarta Pusat 1',
        user: req.user,
        layout: 'layouts/dashboard',
        currentPath: '/dashboard/admin/formulir/kode-pembayaran'
    });
});

// GET /dashboard/admin/formulir - Formulir Management
router.get('/formulir', (req, res) => {
    res.render('dashboard/admin/formulir/index', {
        title: 'Manajemen Formulir - SPMB SMK Jakarta Pusat 1',
        description: 'Manajemen Formulir SPMB SMK Jakarta Pusat 1',
        user: req.user,
        layout: 'layouts/dashboard',
        currentPath: '/dashboard/admin/formulir'
    });
});

// GET /dashboard/admin/formulir/cetak-kuitansi - Print Receipt
router.get('/formulir/cetak-kuitansi', (req, res) => {
    res.render('dashboard/admin/formulir/cetakKuitansi', {
        title: 'Cetak Kuitansi Formulir - SPMB SMK Jakarta Pusat 1',
        description: 'Cetak Kuitansi Formulir SPMB SMK Jakarta Pusat 1',
        user: req.user,
        layout: false, // No layout for printing
        currentUser: req.user // Pass the logged-in user data
    });
});

// GET /dashboard/admin/pembayaran - Payment Management
router.get('/pembayaran', async (req, res) => {
    try {
        // Get active period
        const [activePeriodeResult] = await db.query(`
            SELECT * FROM periode_pendaftaran 
            WHERE tanggal_mulai <= CURDATE() 
            AND tanggal_selesai >= CURDATE() 
            AND status = 'ACTIVE'
            LIMIT 1
        `);
        const activePeriode = activePeriodeResult[0] || null;

        // Get all payments with their basic info (without JSON_ARRAYAGG)
        const query = `
            SELECT 
                pp.*,
                u.nama_lengkap,
                f.no_formulir,
                j.jurusan,
                j.id_jurusan,
                mbj.total_biaya as base_biaya,
                MAX(COALESCE(dp.nominal_diskon, 0)) as nominal_diskon,
                (mbj.total_biaya - MAX(COALESCE(dp.nominal_diskon, 0))) as total_biaya,
                per.nama_periode,
                COALESCE(SUM(CASE WHEN dpp.status_verifikasi = 'VERIFIED' THEN dpp.nominal_pembayaran ELSE 0 END), 0) as total_verified,
                COALESCE(SUM(CASE WHEN dpp.status_verifikasi = 'PENDING' THEN dpp.nominal_pembayaran ELSE 0 END), 0) as total_pending,
                ((mbj.total_biaya - MAX(COALESCE(dp.nominal_diskon, 0))) - COALESCE(SUM(CASE WHEN dpp.status_verifikasi = 'VERIFIED' THEN dpp.nominal_pembayaran ELSE 0 END), 0)) as sisa_pembayaran,
                MAX(CASE WHEN dpp.status_verifikasi = 'VERIFIED' THEN dpp.nama_verifikator END) as nama_verifikator
            FROM pembayaran_pendaftaran pp
            JOIN formulir f ON pp.id_formulir = f.id_formulir
            JOIN users u ON f.id_user = u.id_user
            JOIN registrasi_peserta_didik rpd ON f.id_formulir = rpd.id_formulir
            JOIN jurusan j ON rpd.jurusan = j.id_jurusan
            JOIN master_biaya_jurusan mbj ON j.id_jurusan = mbj.id_jurusan
            LEFT JOIN periode_pendaftaran per ON pp.id_periode_daftar = per.id_periode
            LEFT JOIN diskon_periode dp ON (per.id_periode = dp.id_periode AND j.id_jurusan = dp.id_jurusan)
            LEFT JOIN detail_pembayaran_pendaftaran dpp ON pp.id_pembayaran = dpp.id_pembayaran
            GROUP BY pp.id_pembayaran, pp.id_formulir, pp.id_periode_daftar, pp.status_pelunasan, pp.created_at, pp.updated_at,
                     u.nama_lengkap, f.no_formulir, j.jurusan, j.id_jurusan, mbj.total_biaya, per.nama_periode
            ORDER BY pp.created_at DESC
        `;
        const [payments] = await db.query(query);

        // Get all payment details separately
        const [paymentDetails] = await db.query(`
            SELECT 
                dpp.id_pembayaran,
                dpp.id_detail,
                dpp.tanggal_pembayaran,
                dpp.nominal_pembayaran,
                dpp.status_verifikasi,
                dpp.nama_verifikator
            FROM detail_pembayaran_pendaftaran dpp
            ORDER BY dpp.id_pembayaran, dpp.tanggal_pembayaran
        `);

        // Group payment details by payment ID
        const detailsByPayment = {};
        paymentDetails.forEach(detail => {
            if (!detailsByPayment[detail.id_pembayaran]) {
                detailsByPayment[detail.id_pembayaran] = [];
            }
            detailsByPayment[detail.id_pembayaran].push({
                id_detail: detail.id_detail,
                tanggal_pembayaran: detail.tanggal_pembayaran,
                nominal_pembayaran: detail.nominal_pembayaran,
                status_verifikasi: detail.status_verifikasi,
                nama_verifikator: detail.nama_verifikator
            });
        });

        // Add payment details to each payment
        const paymentsWithDetails = payments.map(payment => ({
            ...payment,
            detail_pembayaran: detailsByPayment[payment.id_pembayaran] || []
        }));

        // Get master biaya data with jurusan
        const [masterBiaya] = await db.query(`
            SELECT mbj.*, j.jurusan, j.id_jurusan
            FROM master_biaya_jurusan mbj
            JOIN jurusan j ON mbj.id_jurusan = j.id_jurusan
        `);

        // Get diskon periode data for active period with jurusan
        const [diskonPeriode] = await db.query(`
            SELECT dp.*, j.jurusan, j.id_jurusan
            FROM diskon_periode dp
            JOIN jurusan j ON dp.id_jurusan = j.id_jurusan
            WHERE dp.id_periode = ?
        `, [activePeriode ? activePeriode.id_periode : 0]);

        // Process payments to include biaya and diskon info
        const processedPayments = paymentsWithDetails.map(payment => {
            // Find matching biaya for the jurusan
            const akBiaya = masterBiaya.find(mb => mb.id_jurusan === payment.id_jurusan) || null;
            
            // Find matching diskon for the jurusan
            const akDiskon = diskonPeriode.find(dp => dp.id_jurusan === payment.id_jurusan) || null;

            return {
                ...payment,
                akBiaya,
                akDiskon
            };
        });

        // Debug logging
        console.log('Active Periode:', activePeriode);
        console.log('Diskon Periode:', diskonPeriode);
        console.log('Master Biaya:', masterBiaya);

        res.render('dashboard/admin/pembayaran/index', {
            title: 'Manajemen Pembayaran - SPMB SMK Jakarta Pusat 1',
            description: 'Manajemen Pembayaran SPMB SMK Jakarta Pusat 1',
            user: req.user,
            layout: 'layouts/dashboard',
            currentPath: '/dashboard/admin/pembayaran',
            payments: processedPayments,
            activePeriode,
            masterBiaya,
            diskonPeriode
        });
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).send('Error fetching payments');
    }
});

// GET /dashboard/admin/reward-spmb - Rewards Management
router.get('/reward-spmb', (req, res) => {
    res.render('dashboard/admin/rewards/index', {
        title: 'Reward SPMB - SPMB SMK Jakarta Pusat 1',
        description: 'Manajemen Reward SPMB SPMB SMK Jakarta Pusat 1',
        user: req.user,
        layout: 'layouts/dashboard',
        currentPath: '/dashboard/admin/reward-spmb'
    });
});

// GET /dashboard/admin/reward-spmb/cetak/:id - Print Reward Receipt
router.get('/reward-spmb/cetak/:id', isAdmin, (req, res) => {
    res.render('dashboard/admin/rewards/cetakKuitansi', {
        title: 'Cetak Kuitansi Reward',
        layout: false
    });
});

// GET /dashboard/admin/seragam - Seragam Management
router.get('/seragam', (req, res) => {
    res.render('dashboard/admin/seragam/index', {
        title: 'Manajemen Seragam - SPMB SMK Jakarta Pusat 1',
        description: 'Manajemen Seragam SPMB SMK Jakarta Pusat 1',
        user: req.user,
        layout: 'layouts/dashboard',
        currentPath: '/dashboard/admin/seragam'
    });
});

// GET /dashboard/admin/biaya - Master Biaya Jurusan Management
router.get('/biaya', (req, res) => {
    res.render('dashboard/admin/biaya/index', {
        title: 'Master Biaya Jurusan - SPMB SMK Jakarta Pusat 1',
        description: 'Manajemen Biaya per Jurusan SPMB SMK Jakarta Pusat 1',
        user: req.user,
        layout: 'layouts/dashboard',
        currentPath: '/dashboard/admin/biaya'
    });
});

// GET /dashboard/admin/periode - Periode Pendaftaran Management
router.get('/periode', (req, res) => {
    res.render('dashboard/admin/periode/index', {
        title: 'Periode Pendaftaran - SPMB SMK Jakarta Pusat 1',
        description: 'Manajemen Periode Pendaftaran SPMB SMK Jakarta Pusat 1',
        user: req.user,
        layout: 'layouts/dashboard',
        currentPath: '/dashboard/admin/periode'
    });
});

// GET /dashboard/admin/diskon - Diskon Periode Management
router.get('/diskon', (req, res) => {
    res.render('dashboard/admin/diskon/index', {
        title: 'Diskon Periode - SPMB SMK Jakarta Pusat 1',
        description: 'Manajemen Diskon Periode SPMB SMK Jakarta Pusat 1',
        user: req.user,
        layout: 'layouts/dashboard',
        currentPath: '/dashboard/admin/diskon'
    });
});

// GET /dashboard/admin/settings - Settings Page
router.get('/settings', (req, res) => {
    res.render('dashboard/admin/settings/index', {
        title: 'Pengaturan - SPMB SMK Jakarta Pusat 1',
        description: 'Pengaturan Akun SPMB SMK Jakarta Pusat 1',
        user: req.user,
        layout: 'layouts/dashboard',
        currentPath: '/dashboard/admin/settings'
    });
});

// GET /dashboard/admin/pembayaran/cetak-kuitansi/:id - Print Payment Receipt
router.get('/pembayaran/cetak-kuitansi/:id', isAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        
        // Validate id parameter
        if (!id || isNaN(id)) {
            return res.status(400).send('Invalid payment ID');
        }

        res.render('dashboard/admin/pembayaran/cetakKuitansi', {
            title: 'Cetak Kuitansi Pembayaran - SPMB SMK Jakarta Pusat 1',
            description: 'Cetak Kuitansi Pembayaran SPMB SMK Jakarta Pusat 1',
            layout: false,
            id_pembayaran: id
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Terjadi kesalahan saat mencetak kuitansi');
    }
});

// GET /dashboard/admin/pembayaran/:id - Payment Detail
router.get('/pembayaran/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get payment details
        const paymentQuery = `
            SELECT 
                pp.*,
                u.nama_lengkap,
                f.no_formulir,
                j.jurusan,
                mbj.total_biaya as base_biaya,
                MAX(COALESCE(dp.nominal_diskon, 0)) as nominal_diskon,
                (mbj.total_biaya - MAX(COALESCE(dp.nominal_diskon, 0))) as total_biaya,
                per.nama_periode,
                MAX(CASE WHEN dpp.status_verifikasi = 'VERIFIED' THEN dpp.nama_verifikator END) as nama_verifikator,
                COALESCE(SUM(CASE WHEN dpp.status_verifikasi = 'VERIFIED' THEN dpp.nominal_pembayaran ELSE 0 END), 0) as total_verified,
                COALESCE(SUM(CASE WHEN dpp.status_verifikasi = 'PENDING' THEN dpp.nominal_pembayaran ELSE 0 END), 0) as total_pending,
                ((mbj.total_biaya - MAX(COALESCE(dp.nominal_diskon, 0))) - COALESCE(SUM(CASE WHEN dpp.status_verifikasi = 'VERIFIED' THEN dpp.nominal_pembayaran ELSE 0 END), 0)) as sisa_pembayaran
            FROM pembayaran_pendaftaran pp
            JOIN formulir f ON pp.id_formulir = f.id_formulir
            JOIN users u ON f.id_user = u.id_user
            JOIN registrasi_peserta_didik rpd ON f.id_formulir = rpd.id_formulir
            JOIN jurusan j ON rpd.jurusan = j.id_jurusan
            JOIN master_biaya_jurusan mbj ON j.id_jurusan = mbj.id_jurusan
            LEFT JOIN periode_pendaftaran per ON pp.id_periode_daftar = per.id_periode
            LEFT JOIN diskon_periode dp ON (per.id_periode = dp.id_periode AND j.id_jurusan = dp.id_jurusan)
            LEFT JOIN detail_pembayaran_pendaftaran dpp ON pp.id_pembayaran = dpp.id_pembayaran
            WHERE pp.id_pembayaran = ?
            GROUP BY pp.id_pembayaran, pp.id_formulir, pp.id_periode_daftar, pp.status_pelunasan, pp.created_at, pp.updated_at,
                     u.nama_lengkap, f.no_formulir, j.jurusan, mbj.total_biaya, per.nama_periode
        `;
        const [payments] = await db.query(paymentQuery, [id]);
        const payment = payments[0];

        if (!payment) {
            return res.status(404).send('Payment not found');
        }

        // Get payment transactions
        const transactionsQuery = `
            SELECT 
                dpp.*,
                DATE_FORMAT(dpp.tanggal_pembayaran, '%d/%m/%Y %H:%i') as formatted_date
            FROM detail_pembayaran_pendaftaran dpp
            WHERE dpp.id_pembayaran = ?
            ORDER BY dpp.tanggal_pembayaran ASC
        `;
        const [transactions] = await db.query(transactionsQuery, [id]);

        // Calculate first and second payments
        const verifiedTransactions = transactions.filter(t => t.status_verifikasi === 'VERIFIED');
        const firstPayment = verifiedTransactions[0] || null;
        const secondPayment = verifiedTransactions[1] || null;

        res.render('dashboard/admin/pembayaran/detail', {
            title: 'Detail Pembayaran - SPMB SMK Jakarta Pusat 1',
            description: 'Detail Pembayaran SPMB SMK Jakarta Pusat 1',
            user: req.user,
            layout: 'layouts/dashboard',
            currentPath: '/dashboard/admin/pembayaran',
            payment,
            transactions,
            firstPayment,
            secondPayment
        });
    } catch (error) {
        console.error('Error fetching payment detail:', error);
        res.status(500).send('Error fetching payment detail');
    }
});

module.exports = router;
