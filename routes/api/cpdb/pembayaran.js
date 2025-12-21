const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../../../config/database');
const PembayaranPendaftaran = require('../../../models/PembayaranPendaftaran');
const DetailPembayaranPendaftaran = require('../../../models/DetailPembayaranPendaftaran');
const RegistrasiPesertaDidik = require('../../../models/RegistrasiPesertaDidik');
const MasterBiayaJurusan = require('../../../models/MasterBiayaJurusan');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/uploads/bukti-bayar';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, 'bukti-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
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

// Get biaya by jurusan and active period
router.get('/biaya/:idJurusan', async function(req, res) {
    try {
        const idJurusan = parseInt(req.params.idJurusan);
        
        if (!idJurusan) {
            return res.status(400).json({
                success: false,
                message: 'ID Jurusan tidak valid'
            });
        }

        const biaya = await MasterBiayaJurusan.getBiayaByPeriodeAndJurusan(idJurusan);
        
        if (!biaya) {
            return res.status(404).json({
                success: false,
                message: 'Biaya tidak ditemukan untuk jurusan ini pada periode aktif'
            });
        }

        res.json({
            success: true,
            data: biaya
        });
    } catch (error) {
        console.error('Error getting biaya:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Get payment information
router.get('/:idFormulir', async function(req, res) {
    try {
        console.log('Request params:', req.params);
        console.log('Request query:', req.query);
        console.log('User ID:', req.user.id);

        // First get formulir data for the logged-in user
        const query = `
            SELECT 
                r.*,
                j.jurusan as nama_jurusan,
                j.id_jurusan,
                f.status_formulir,
                f.id_user
            FROM formulir f
            INNER JOIN registrasi_peserta_didik r ON f.id_formulir = r.id_formulir
            INNER JOIN jurusan j ON r.jurusan = j.id_jurusan
            WHERE f.id_user = ?
        `;
        const [registrationRows] = await db.execute(query, [req.user.id]);
        console.log('Query result rows:', registrationRows);
        
        // Parse and validate idFormulir
        const idFormulir = req.params.idFormulir === 'null' ? null : parseInt(req.params.idFormulir);
        
        // If no formulir ID is provided, return empty payment info
        if (idFormulir === null) {
            return res.json({
                pembayaran: null,
                detailPembayaran: [],
                registrasi: null
            });
        }

        // Find the specific formulir we're looking for
        const registrasi = registrationRows.find(row => row.id_formulir === idFormulir);

        // Then get payment information
        const pembayaran = await PembayaranPendaftaran.findByFormulir(idFormulir);
        
        if (!pembayaran) {
            // If no payment record exists
            let responseData = {};

            // Get jurusan information
            const idJurusan = registrasi?.jurusan || 
                             (req.query.idJurusan === 'null' ? null : parseInt(req.query.idJurusan));

            if (!idJurusan) {
                return res.status(400).json({
                    message: 'ID Jurusan tidak valid',
                    detail: 'ID Jurusan harus berupa angka yang valid'
                });
            }

            // If we have registration data, include it
            if (registrasi) {
                responseData.registrasi = registrasi;
            }

            // If we don't have jurusan name in registration, get it directly
            if (!registrasi?.nama_jurusan) {
                const [jurusanRows] = await db.execute(
                    'SELECT jurusan as nama_jurusan FROM jurusan WHERE id_jurusan = ?',
                    [idJurusan]
                );
                if (jurusanRows.length > 0) {
                    responseData.registrasi = {
                        ...(responseData.registrasi || {}),
                        jurusan: idJurusan,
                        nama_jurusan: jurusanRows[0].nama_jurusan
                    };
                } else {
                    return res.status(404).json({
                        message: 'Jurusan tidak ditemukan',
                        detail: `Tidak ada jurusan dengan ID ${idJurusan}`
                    });
                }
            }

            return res.json({
                pembayaran: null,
                detailPembayaran: [],
                registrasi: responseData.registrasi || null
            });
        }

        // Get payment details if payment record exists
        const detailPembayaran = await DetailPembayaranPendaftaran.findByPembayaran(pembayaran.id_pembayaran);
        res.json({ pembayaran, detailPembayaran, registrasi });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit new payment
router.post('/', upload.single('bukti_pembayaran'), async function(req, res) {
    try {
        // Log raw request data
        console.log('Payment submission - Raw request body:', req.body);
        console.log('Payment submission - File:', req.file);

        // Parse and validate IDs
        const id_formulir = req.body.id_formulir === 'null' ? null : parseInt(req.body.id_formulir);
        const id_jurusan = req.body.id_jurusan === 'null' ? null : parseInt(req.body.id_jurusan);
        const nominal_pembayaran = parseInt(req.body.nominal_pembayaran) || 0;
        const metode_pembayaran = req.body.metode_pembayaran;

        // Log raw request data
        console.log('Payment submission - Raw request body:', req.body);
        console.log('Payment submission - Parsed nominal_pembayaran:', nominal_pembayaran);
        console.log('Payment submission - Parsed values:', {
            id_formulir,
            id_jurusan,
            nominal_pembayaran,
            metode_pembayaran
        });

        // Validate required fields
        if (!id_formulir || !id_jurusan) {
            console.log('Payment submission - Validation failed:', {
                id_formulir_valid: Boolean(id_formulir),
                id_jurusan_valid: Boolean(id_jurusan),
                raw_id_formulir: req.body.id_formulir,
                raw_id_jurusan: req.body.id_jurusan
            });
            return res.status(400).json({
                message: 'Data pembayaran tidak lengkap',
                detail: 'ID formulir dan ID jurusan harus berupa angka yang valid'
            });
        }

        if (!nominal_pembayaran || nominal_pembayaran <= 0) {
            return res.status(400).json({
                message: 'Nominal pembayaran tidak valid',
                detail: 'Nominal pembayaran harus lebih dari 0'
            });
        }

        if (!['TUNAI', 'TRANSFER'].includes(metode_pembayaran)) {
            return res.status(400).json({
                message: 'Metode pembayaran tidak valid',
                detail: 'Metode pembayaran harus TUNAI atau TRANSFER'
            });
        }

        // Additional validation for TRANSFER method
        if (metode_pembayaran === 'TRANSFER') {
            if (!req.body.nama_pengirim?.trim()) {
                return res.status(400).json({
                    message: 'Nama pengirim wajib diisi',
                    detail: 'Nama pengirim harus diisi untuk pembayaran transfer'
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    message: 'Bukti pembayaran wajib diupload',
                    detail: 'Bukti pembayaran harus diupload untuk pembayaran transfer'
                });
            }
        }

        let savedPembayaran;
        
        // Check if payment record exists
        const pembayaran = await PembayaranPendaftaran.findByFormulir(id_formulir);
        
        if (!pembayaran) {
            // Create initial payment record
            const idPembayaran = await PembayaranPendaftaran.create({
                id_formulir,
                id_jurusan,
                nominal_pembayaran // Include nominal_pembayaran in the create method
            });
            
            // Get the fresh payment record
            savedPembayaran = await PembayaranPendaftaran.findByFormulir(id_formulir);
            if (!savedPembayaran) {
                throw new Error('Failed to retrieve created payment record');
            }
        } else {
            savedPembayaran = pembayaran;

            // Validate if payment is already completed
            if (savedPembayaran.status_pelunasan === 'LUNAS') {
                return res.status(400).json({
                    message: 'Pembayaran sudah lunas',
                    detail: 'Tidak dapat menambah pembayaran karena status sudah lunas'
                });
            }
        }

        // Create payment detail record
        const detailPembayaran = await DetailPembayaranPendaftaran.create({
            id_pembayaran: savedPembayaran.id_pembayaran,
            tanggal_pembayaran: new Date(),
            metode_pembayaran: metode_pembayaran,
            nama_pengirim: req.body.nama_pengirim?.trim() || null,
            nominal_pembayaran: nominal_pembayaran,
            bukti_pembayaran: req.file ? req.file.filename : null
        });

        // Update sisa_pembayaran and status
        await PembayaranPendaftaran.updateSisaPembayaran(savedPembayaran.id_pembayaran);
        
        // Get fresh payment data after update
        savedPembayaran = await PembayaranPendaftaran.findByFormulir(id_formulir);

        // Log successful payment
        console.log('Payment submitted successfully:', {
            id_formulir,
            id_pembayaran: savedPembayaran.id_pembayaran,
            nominal: nominal_pembayaran,
            metode: metode_pembayaran,
            sisa: savedPembayaran.sisa_pembayaran
        });

        res.json({ 
            message: 'Pembayaran berhasil disubmit',
            pembayaran: savedPembayaran,
            detailPembayaran 
        });
    } catch (error) {
        console.error('Error submitting payment:', error);
        res.status(500).json({ 
            message: 'Terjadi kesalahan saat memproses pembayaran',
            detail: error.message
        });
    }
});

module.exports = router;
