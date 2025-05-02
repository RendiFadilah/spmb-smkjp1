const express = require('express');
const router = express.Router();
const CPDBFormulir = require('../../../models/CPDBFormulir');
const multer = require('multer');
const path = require('path');
const db = require('../../../config/database');
const dataPribadiRouter = require('./data-pribadi');

// Use data pribadi routes
router.use('/data-pribadi', dataPribadiRouter);

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/bukti-bayar')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'bukti-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Hanya file gambar yang diperbolehkan'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Check kode pembayaran validity and get its ID
router.get('/kode-pembayaran/check/:kode', async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.execute(
            'SELECT id_kode_pembayaran FROM kode_pembayaran WHERE kode_bayar = ? AND status = "Belum Terpakai" FOR UPDATE',
            [req.params.kode]
        );

        if (!rows || rows.length === 0) {
            return res.status(400).json({ message: 'Kode pembayaran tidak valid atau sudah digunakan' });
        }

        res.json({ id_kode_pembayaran: rows[0].id_kode_pembayaran });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memeriksa kode pembayaran' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// Get available payment codes
router.get('/kode-pembayaran', async (req, res) => {
    try {
        const codes = await CPDBFormulir.getAvailablePaymentCodes();
        res.json(codes);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data kode pembayaran' });
    }
});

// Create new formulir purchase
router.post('/', upload.single('bukti_bayar'), async (req, res) => {
    try {
        // Log request details
        console.log('Request user:', req.user);
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        if (!req.body.id_kode_pembayaran) {
            return res.status(400).json({ message: 'Kode pembayaran harus diisi' });
        }

        const data = {
            id_user: req.user.id,
            id_kode_pembayaran: req.body.id_kode_pembayaran,
            nominal_formulir: 150000,
            bukti_bayar: req.file ? `/uploads/bukti-bayar/${req.file.filename}` : null,
            status: 'Proses',
            verifikator: null
        };

        // Create formulir entry (includes transaction management)
        const id = await CPDBFormulir.create(data);

        res.status(201).json({ 
            message: 'Pembelian formulir berhasil', 
            id_formulir: id 
        });
    } catch (error) {
        console.error('Error:', error);
        if (error.message === 'Anda sudah memiliki formulir pendaftaran' || 
            error.message === 'ID kode pembayaran harus diisi' ||
            error.message === 'ID user harus diisi' ||
            error.message === 'Kode pembayaran tidak valid atau sudah digunakan') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Terjadi kesalahan saat membuat formulir' });
        }
    }
});

module.exports = router;
