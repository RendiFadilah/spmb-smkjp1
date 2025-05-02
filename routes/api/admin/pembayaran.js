const express = require('express');
const router = express.Router();
const db = require('../../../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const moment = require('moment-timezone');
const excel = require('exceljs');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './public/uploads/bukti-pembayaran';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, 'bukti-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

// Export payment data to Excel
router.get('/export/:type', async (req, res) => {
    try {
        const type = req.params.type; // 'today' or 'all'
        
        // Base query
        let query = `
            SELECT 
                dpp.tanggal_pembayaran,
                f.no_formulir,
                u.nama_lengkap,
                j.jurusan,
                pp.total_biaya,
                dpp.nominal_pembayaran,
                pp.sisa_pembayaran,
                dpp.metode_pembayaran,
                dpp.nama_pengirim,
                dpp.bukti_pembayaran,
                dpp.status_verifikasi,
                dpp.nama_verifikator,
                pp.status_pelunasan
            FROM pembayaran_pendaftaran pp
            JOIN formulir f ON pp.id_formulir = f.id_formulir
            JOIN users u ON f.id_user = u.id_user
            JOIN jurusan j ON pp.id_jurusan = j.id_jurusan
            JOIN detail_pembayaran_pendaftaran dpp ON pp.id_pembayaran = dpp.id_pembayaran
        `;

        // Add date filter for today if specified
        if (type === 'today') {
            const today = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');
            query += ` WHERE DATE(dpp.tanggal_pembayaran) = '${today}'`;
        }

        query += ' ORDER BY dpp.tanggal_pembayaran ASC';

        const [payments] = await db.query(query);

        // Create a new workbook and worksheet
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Pembayaran');

        // Define columns
        worksheet.columns = [
            { header: 'No', key: 'no', width: 5 },
            { header: 'Tanggal Pembayaran', key: 'tanggal_pembayaran', width: 20 },
            { header: 'No Formulir', key: 'no_formulir', width: 15 },
            { header: 'Nama CPDB', key: 'nama_lengkap', width: 25 },
            { header: 'Jurusan', key: 'jurusan', width: 20 },
            { header: 'Total Biaya', key: 'total_biaya', width: 15 },
            { header: 'Nominal Pembayaran', key: 'nominal_pembayaran', width: 15 },
            { header: 'Sisa Pembayaran', key: 'sisa_pembayaran', width: 15 },
            { header: 'Metode Pembayaran', key: 'metode_pembayaran', width: 15 },
            { header: 'Nama Pengirim', key: 'nama_pengirim', width: 20 },
            { header: 'Bukti Pembayaran', key: 'bukti_pembayaran', width: 30 },
            { header: 'Status Verifikasi', key: 'status_verifikasi', width: 15 },
            { header: 'Nama Petugas', key: 'nama_verifikator', width: 20 },
            { header: 'Status Pelunasan', key: 'status_pelunasan', width: 15 }
        ];

        // Style the header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        // Add data rows
        payments.forEach((payment, index) => {
            worksheet.addRow({
                no: index + 1,
                tanggal_pembayaran: moment(payment.tanggal_pembayaran).format('DD/MM/YYYY HH:mm'),
                no_formulir: payment.no_formulir,
                nama_lengkap: payment.nama_lengkap,
                jurusan: payment.jurusan,
                total_biaya: payment.total_biaya,
                nominal_pembayaran: payment.nominal_pembayaran,
                sisa_pembayaran: payment.sisa_pembayaran,
                metode_pembayaran: payment.metode_pembayaran,
                nama_pengirim: payment.nama_pengirim || '-',
                bukti_pembayaran: payment.bukti_pembayaran || '-',
                status_verifikasi: payment.status_verifikasi,
                nama_verifikator: payment.nama_verifikator,
                status_pelunasan: payment.status_pelunasan === 'LUNAS' ? 'Lunas' : 'Belum Lunas'
            });
        });

        // Format currency columns
        ['F', 'G', 'H'].forEach(col => {
            worksheet.getColumn(col).numFmt = '"Rp"#,##0';
        });

        // Set response headers
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=Pembayaran_${type === 'today' ? 'HariIni' : 'Semua'}_${moment().format('DDMMYYYY')}.xlsx`
        );

        // Write to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting payments:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengekspor data pembayaran' });
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

// Get eligible CPDB for payment
router.get('/data/eligible-cpdb', async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT
                u.id_user,
                u.nama_lengkap,
                f.no_formulir,
                j.jurusan,
                mbj.total_biaya,
                COALESCE(SUM(CASE WHEN dpp.status_verifikasi = 'VERIFIED' THEN dpp.nominal_pembayaran ELSE 0 END), 0) as total_verified,
                CONCAT(u.nama_lengkap, ' - ', f.no_formulir, ' (', j.jurusan, ')') as display_name,
                CASE WHEN pp.id_pembayaran IS NOT NULL THEN 1 ELSE 0 END as has_payment
            FROM users u
            JOIN formulir f ON u.id_user = f.id_user
            JOIN registrasi_peserta_didik rpd ON f.id_formulir = rpd.id_formulir
            JOIN jurusan j ON rpd.jurusan = j.id_jurusan
            JOIN master_biaya_jurusan mbj ON j.id_jurusan = mbj.id_jurusan
            LEFT JOIN pembayaran_pendaftaran pp ON f.id_formulir = pp.id_formulir
            LEFT JOIN detail_pembayaran_pendaftaran dpp ON pp.id_pembayaran = dpp.id_pembayaran
            WHERE f.status = 'Terverifikasi' 
            AND f.status_formulir = 'Sudah Lengkap'
            AND (
                pp.id_pembayaran IS NULL 
                OR 
                pp.status_pelunasan = 'BELUM_LUNAS'
                OR f.id_formulir NOT IN (SELECT id_formulir FROM pembayaran_pendaftaran)
            )
            GROUP BY u.id_user, u.nama_lengkap, f.no_formulir, j.jurusan, mbj.total_biaya, pp.id_pembayaran
        `;
        
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching eligible CPDB:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data CPDB' });
    }
});

// Get payment details by ID
router.get('/detail/:id_pembayaran', async (req, res) => {
    try {
        // Get payment header info
        const [payment] = await db.query(`
            SELECT 
                pp.id_pembayaran,
                pp.id_formulir,
                pp.id_jurusan,
                pp.total_biaya,
                pp.sisa_pembayaran,
                pp.status_pelunasan,
                f.no_formulir,
                u.nama_lengkap,
                j.jurusan,
                COALESCE(SUM(CASE WHEN dpp.status_verifikasi = 'VERIFIED' THEN dpp.nominal_pembayaran ELSE 0 END), 0) as total_verified
            FROM pembayaran_pendaftaran pp
            JOIN formulir f ON pp.id_formulir = f.id_formulir
            JOIN users u ON f.id_user = u.id_user
            JOIN jurusan j ON pp.id_jurusan = j.id_jurusan
            LEFT JOIN detail_pembayaran_pendaftaran dpp ON pp.id_pembayaran = dpp.id_pembayaran
            WHERE pp.id_pembayaran = ?
            GROUP BY pp.id_pembayaran
        `, [req.params.id_pembayaran]);

        if (!payment) {
            return res.status(404).json({ message: 'Data pembayaran tidak ditemukan' });
        }

        // Get payment transactions
        const [transactions] = await db.query(`
            SELECT 
                dpp.*,
                DATE_FORMAT(dpp.tanggal_pembayaran, '%d/%m/%Y %H:%i') as formatted_date
            FROM detail_pembayaran_pendaftaran dpp
            WHERE dpp.id_pembayaran = ?
            ORDER BY dpp.tanggal_pembayaran DESC
        `, [req.params.id_pembayaran]);

        // Calculate first and second payments
        const firstPayment = transactions.find(t => t.status_verifikasi === 'VERIFIED');
        const secondPayment = transactions.filter(t => t.status_verifikasi === 'VERIFIED')[1];

        res.json({
            payment: {
                ...payment,
                first_payment: firstPayment ? firstPayment.nominal_pembayaran : 0,
                second_payment: secondPayment ? secondPayment.nominal_pembayaran : 0
            },
            transactions
        });
    } catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil detail pembayaran' });
    }
});

// Create new payment
router.post('/', upload.single('bukti_pembayaran'), async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const { id_user, total_biaya, nominal_pembayaran, metode_pembayaran, nama_pengirim } = req.body;
        
        console.log('Request Body:', req.body);
        console.log('File:', req.file);
        
        // Validate required fields
        if (!id_user || !total_biaya || !metode_pembayaran) {
            console.log('Missing required fields:', {
                id_user: id_user || 'missing',
                total_biaya: total_biaya || 'missing',
                metode_pembayaran: metode_pembayaran || 'missing'
            });
            return res.status(400).json({ 
                message: 'Data tidak lengkap', 
                details: 'id_user, total_biaya, dan metode_pembayaran harus diisi' 
            });
        }

        // Validate nama_pengirim if metode_pembayaran is TRANSFER
        if (metode_pembayaran === 'TRANSFER' && !nama_pengirim) {
            return res.status(400).json({
                message: 'Data tidak lengkap',
                details: 'Nama pengirim harus diisi untuk pembayaran transfer'
            });
        }

        // Get formulir and existing payment data
        const [formulirData] = await conn.query(
            `SELECT 
                f.id_formulir,
                pp.id_pembayaran,
                pp.sisa_pembayaran as existing_sisa,
                COALESCE(SUM(CASE WHEN dpp.status_verifikasi = 'VERIFIED' THEN dpp.nominal_pembayaran ELSE 0 END), 0) as total_verified
             FROM formulir f
             LEFT JOIN pembayaran_pendaftaran pp ON f.id_formulir = pp.id_formulir
             LEFT JOIN detail_pembayaran_pendaftaran dpp ON pp.id_pembayaran = dpp.id_pembayaran
             WHERE f.id_user = ? 
             AND f.status = 'Terverifikasi' 
             AND f.status_formulir = 'Sudah Lengkap'
             GROUP BY f.id_formulir, pp.id_pembayaran, pp.sisa_pembayaran`,
            [id_user]
        );

        if (!formulirData || formulirData.length === 0) {
            return res.status(400).json({ 
                message: 'Data tidak valid', 
                details: 'Formulir tidak ditemukan untuk user ini' 
            });
        }

        const id_formulir = formulirData[0].id_formulir;
        let existingPayment = formulirData[0].id_pembayaran;
        const existingSisa = formulirData[0].existing_sisa;
        const totalVerified = formulirData[0].total_verified;

        // Get id_jurusan and capacity from registrasi_peserta_didik
        const [jurusanData] = await conn.query(
            `SELECT j.id_jurusan, j.sisa_kapasitas 
             FROM registrasi_peserta_didik rpd 
             JOIN jurusan j ON rpd.jurusan = j.id_jurusan 
             WHERE rpd.id_formulir = ?`,
            [id_formulir]
        );
        if (!jurusanData || jurusanData.length === 0) {
            console.log('Jurusan data not found for id_formulir:', id_formulir);
            return res.status(400).json({ 
                message: 'Data tidak valid', 
                details: 'Data jurusan tidak ditemukan untuk formulir ini' 
            });
        }

        const id_jurusan = jurusanData[0].id_jurusan;
        const sisa_kapasitas = jurusanData[0].sisa_kapasitas;

        // Check jurusan capacity if this is a new payment
        if (!existingPayment && sisa_kapasitas <= 0) {
            return res.status(400).json({
                message: 'Kapasitas jurusan sudah penuh'
            });
        }

        // Convert values to proper format
        const parsedTotalBiaya = parseFloat(total_biaya);
        const parsedNominalPembayaran = nominal_pembayaran ? parseFloat(nominal_pembayaran) : 0;
        
        let sisaPembayaran, statusPelunasan;
        
        if (existingPayment) {
            // This is a second payment
            sisaPembayaran = existingSisa - parsedNominalPembayaran;
            
            // Update existing payment record
            await conn.query(
                `UPDATE pembayaran_pendaftaran 
                 SET sisa_pembayaran = ?, 
                     status_pelunasan = CASE 
                         WHEN ? <= 0 THEN 'LUNAS'
                         ELSE 'BELUM_LUNAS'
                     END
                 WHERE id_pembayaran = ?`,
                [sisaPembayaran, sisaPembayaran, existingPayment]
            );
        } else {
            // This is the first payment
            sisaPembayaran = parsedTotalBiaya - parsedNominalPembayaran;
            statusPelunasan = sisaPembayaran <= 0 ? 'LUNAS' : 'BELUM_LUNAS';
            
            // Insert new payment record
            const [payment] = await conn.query(
                'INSERT INTO pembayaran_pendaftaran (id_formulir, id_jurusan, total_biaya, sisa_pembayaran, status_pelunasan) VALUES (?, ?, ?, ?, ?)',
                [id_formulir, id_jurusan, parsedTotalBiaya, sisaPembayaran, statusPelunasan]
            );
            existingPayment = payment.insertId;

            // Decrease jurusan sisa_kapasitas since this is a new verified payment
            await conn.query(
                'UPDATE jurusan SET sisa_kapasitas = sisa_kapasitas - 1 WHERE id_jurusan = ?',
                [id_jurusan]
            );
        }
        
        const bukti_pembayaran = req.file ? `/uploads/bukti-pembayaran/${req.file.filename}` : null;
        // Set timezone to Asia/Jakarta
        const now = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

        console.log('Processed values:', {
            id_formulir,
            id_jurusan,
            parsedTotalBiaya,
            parsedNominalPembayaran,
            sisaPembayaran
        });

        // Insert payment detail
        const insertDetailQuery = `
            INSERT INTO detail_pembayaran_pendaftaran 
            (id_pembayaran, nominal_pembayaran, bukti_pembayaran, status_verifikasi, 
            tanggal_pembayaran, metode_pembayaran, nama_pengirim, nama_verifikator)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await conn.query(insertDetailQuery, [
            existingPayment,
            parsedNominalPembayaran,
            bukti_pembayaran,
            'VERIFIED',
            now,
            metode_pembayaran,
            nama_pengirim || null,
            req.user.nama // Set verifikator name from logged in admin
        ]);

        await conn.commit();
        res.json({ 
            success: true,
            message: 'Pembayaran berhasil ditambahkan',
            data: {
                id_pembayaran: existingPayment
            }
        });
    } catch (error) {
        await conn.rollback();
        console.error('Error creating payment:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan pembayaran' });
    } finally {
        conn.release();
    }
});

// Delete entire payment record
router.delete('/:id_pembayaran', async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // Get payment info before deleting
        const [payment] = await conn.query(
            `SELECT pp.*, f.no_formulir, j.sisa_kapasitas 
             FROM pembayaran_pendaftaran pp
             JOIN formulir f ON pp.id_formulir = f.id_formulir
             JOIN jurusan j ON pp.id_jurusan = j.id_jurusan
             WHERE pp.id_pembayaran = ?`,
            [req.params.id_pembayaran]
        );

        if (!payment || payment.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Data pembayaran tidak ditemukan' 
            });
        }

        // Check if there are any verified payments
        const [verifiedPayments] = await conn.query(
            'SELECT COUNT(*) as count FROM detail_pembayaran_pendaftaran WHERE id_pembayaran = ? AND status_verifikasi = "VERIFIED"',
            [req.params.id_pembayaran]
        );

        // Delete all payment details first (due to foreign key constraint)
        await conn.query(
            'DELETE FROM detail_pembayaran_pendaftaran WHERE id_pembayaran = ?',
            [req.params.id_pembayaran]
        );

        // Then delete the payment header
        await conn.query(
            'DELETE FROM pembayaran_pendaftaran WHERE id_pembayaran = ?',
            [req.params.id_pembayaran]
        );

        // If there were verified payments, increase jurusan capacity
        if (verifiedPayments[0].count > 0) {
            await conn.query(
                'UPDATE jurusan SET sisa_kapasitas = sisa_kapasitas + 1 WHERE id_jurusan = ?',
                [payment[0].id_jurusan]
            );
        }

        await conn.commit();
        res.json({ 
            success: true,
            message: 'Pembayaran berhasil dihapus'
        });
    } catch (error) {
        await conn.rollback();
        console.error('Error deleting payment:', error);
        res.status(500).json({ 
            success: false,
            message: 'Terjadi kesalahan saat menghapus pembayaran'
        });
    } finally {
        conn.release();
    }
});

// Verify payment detail
router.post('/verify/:id_detail', async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const { status, catatan } = req.body;
        const id_detail = req.params.id_detail;

        // Get payment detail info
        const [detailPayment] = await conn.query(
            `SELECT dpp.*, pp.id_pembayaran, pp.total_biaya, pp.id_jurusan
             FROM detail_pembayaran_pendaftaran dpp
             JOIN pembayaran_pendaftaran pp ON dpp.id_pembayaran = pp.id_pembayaran
             WHERE dpp.id_detail = ?`,
            [id_detail]
        );

        if (!detailPayment || detailPayment.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Data pembayaran tidak ditemukan' 
            });
        }

        // Update payment detail status
        await conn.query(
            `UPDATE detail_pembayaran_pendaftaran 
             SET status_verifikasi = ?,
                 catatan_verifikasi = ?,
                 nama_verifikator = ?
             WHERE id_detail = ?`,
            [status, catatan || null, req.user.nama, id_detail]
        );

        // If verified, update payment header
        if (status === 'VERIFIED') {
            // Get total verified payments
            const [totalVerified] = await conn.query(
                `SELECT COALESCE(SUM(nominal_pembayaran), 0) as total_verified
                 FROM detail_pembayaran_pendaftaran 
                 WHERE id_pembayaran = ? AND status_verifikasi = 'VERIFIED'`,
                [detailPayment[0].id_pembayaran]
            );

            // Calculate new remaining payment
            const newSisaPembayaran = detailPayment[0].total_biaya - totalVerified[0].total_verified;
            const newStatus = newSisaPembayaran <= 0 ? 'LUNAS' : 'BELUM_LUNAS';

        // Update payment header
        await conn.query(
            `UPDATE pembayaran_pendaftaran 
             SET sisa_pembayaran = ?,
                 status_pelunasan = ?
             WHERE id_pembayaran = ?`,
            [newSisaPembayaran, newStatus, detailPayment[0].id_pembayaran]
        );

        // If this was the only verified payment, increase jurusan capacity
        const [remainingVerified] = await conn.query(
            'SELECT COUNT(*) as count FROM detail_pembayaran_pendaftaran WHERE id_pembayaran = ? AND status_verifikasi = "VERIFIED"',
            [detailPayment[0].id_pembayaran]
        );

        if (remainingVerified[0].count === 0) {
            await conn.query(
                'UPDATE jurusan SET sisa_kapasitas = sisa_kapasitas + 1 WHERE id_jurusan = ?',
                [detailPayment[0].id_jurusan]
            );
        }
        }

        await conn.commit();
        res.json({ 
            success: true,
            message: status === 'VERIFIED' ? 
                'Pembayaran berhasil diverifikasi' : 
                'Pembayaran berhasil ditolak'
        });
    } catch (error) {
        await conn.rollback();
        console.error('Error verifying payment:', error);
        res.status(500).json({ 
            success: false,
            message: 'Terjadi kesalahan saat memverifikasi pembayaran'
        });
    } finally {
        conn.release();
    }
});

// Get kuitansi data
router.get('/kuitansi/:id_pembayaran', async (req, res) => {
    try {
        // Get payment header info with user and jurusan details
        const [[payment]] = await db.query(`
            SELECT 
                pp.id_pembayaran,
                pp.total_biaya,
                f.no_formulir,
                u.nama_lengkap,
                j.jurusan as nama_jurusan,
                pp.status_pelunasan,
                (
                    SELECT nama_verifikator 
                    FROM detail_pembayaran_pendaftaran 
                    WHERE id_pembayaran = pp.id_pembayaran 
                    AND status_verifikasi = 'VERIFIED'
                    ORDER BY tanggal_pembayaran DESC 
                    LIMIT 1
                ) as verifikator
            FROM pembayaran_pendaftaran pp
            JOIN formulir f ON pp.id_formulir = f.id_formulir
            JOIN users u ON f.id_user = u.id_user
            JOIN registrasi_peserta_didik rpd ON f.id_formulir = rpd.id_formulir
            JOIN jurusan j ON rpd.jurusan = j.id_jurusan
            WHERE pp.id_pembayaran = ?
        `, [req.params.id_pembayaran]);

        if (!payment) {
            return res.status(404).json({ message: 'Data pembayaran tidak ditemukan' });
        }

        console.log('Payment data:', payment); // Debug log

        // Get verified payment details
        const [detailPembayaran] = await db.query(`
            SELECT 
                id_detail,
                tanggal_pembayaran,
                nominal_pembayaran,
                nama_verifikator
            FROM detail_pembayaran_pendaftaran
            WHERE id_pembayaran = ?
            AND status_verifikasi = 'VERIFIED'
            ORDER BY tanggal_pembayaran ASC
        `, [req.params.id_pembayaran]);

        // Calculate total verified payments
        const totalPembayaran = detailPembayaran.reduce((sum, detail) => sum + parseFloat(detail.nominal_pembayaran), 0);

        // Prepare data for kuitansi
        const kuitansiData = {
            no_formulir: payment.no_formulir,
            nama_lengkap: payment.nama_lengkap,
            nama_jurusan: payment.nama_jurusan,
            total_biaya: parseFloat(payment.total_biaya),
            total_pembayaran: totalPembayaran,
            verifikator: payment.verifikator,
            detail_pembayaran: detailPembayaran.map(detail => ({
                tanggal_pembayaran: detail.tanggal_pembayaran,
                nominal_pembayaran: parseFloat(detail.nominal_pembayaran),
                nama_verifikator: detail.nama_verifikator
            }))
        };

        res.json(kuitansiData);
    } catch (error) {
        console.error('Error fetching kuitansi data:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data kuitansi' });
    }
});

// Delete payment detail
router.delete('/delete/:id_detail', async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // Get payment detail info before deleting
        const [detailPayment] = await conn.query(
            `SELECT dpp.*, pp.id_pembayaran, pp.total_biaya, pp.id_jurusan
             FROM detail_pembayaran_pendaftaran dpp
             JOIN pembayaran_pendaftaran pp ON dpp.id_pembayaran = pp.id_pembayaran
             WHERE dpp.id_detail = ?`,
            [req.params.id_detail]
        );

        if (!detailPayment || detailPayment.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Data pembayaran tidak ditemukan' 
            });
        }

        // Only allow deletion of verified payments
        if (detailPayment[0].status_verifikasi !== 'VERIFIED') {
            return res.status(400).json({
                success: false,
                message: 'Hanya pembayaran yang terverifikasi yang dapat dihapus'
            });
        }

        // Delete the payment detail
        await conn.query(
            'DELETE FROM detail_pembayaran_pendaftaran WHERE id_detail = ?',
            [req.params.id_detail]
        );

        // Get total verified payments after deletion
        const [totalVerified] = await conn.query(
            `SELECT COALESCE(SUM(nominal_pembayaran), 0) as total_verified
             FROM detail_pembayaran_pendaftaran 
             WHERE id_pembayaran = ? AND status_verifikasi = 'VERIFIED'`,
            [detailPayment[0].id_pembayaran]
        );

        // Calculate new remaining payment
        const newSisaPembayaran = detailPayment[0].total_biaya - totalVerified[0].total_verified;
        const newStatus = newSisaPembayaran <= 0 ? 'LUNAS' : 'BELUM_LUNAS';

        // Update payment header
        await conn.query(
            `UPDATE pembayaran_pendaftaran 
             SET sisa_pembayaran = ?,
                 status_pelunasan = ?
             WHERE id_pembayaran = ?`,
            [newSisaPembayaran, newStatus, detailPayment[0].id_pembayaran]
        );

        await conn.commit();
        res.json({ 
            success: true,
            message: 'Pembayaran berhasil dihapus'
        });
    } catch (error) {
        await conn.rollback();
        console.error('Error deleting payment:', error);
        res.status(500).json({ 
            success: false,
            message: 'Terjadi kesalahan saat menghapus pembayaran'
        });
    } finally {
        conn.release();
    }
});

module.exports = router;
