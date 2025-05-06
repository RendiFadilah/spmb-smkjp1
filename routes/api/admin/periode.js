const express = require('express');
const router = express.Router();
const PeriodePendaftaran = require('../../../models/PeriodePendaftaran');
const { isAdmin } = require('../../../middleware/auth');

// Get all periode
router.get('/', isAdmin, async (req, res) => {
    try {
        const periode = await PeriodePendaftaran.getAll();
        res.json({
            success: true,
            data: periode
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data periode'
        });
    }
});

// Get active periode
router.get('/active', isAdmin, async (req, res) => {
    try {
        const periode = await PeriodePendaftaran.getActive();
        if (!periode) {
            return res.status(404).json({
                success: false,
                message: 'Tidak ada periode aktif saat ini'
            });
        }
        res.json({
            success: true,
            data: periode
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil periode aktif'
        });
    }
});

// Get periode by id
router.get('/:id', isAdmin, async (req, res) => {
    try {
        const periode = await PeriodePendaftaran.getById(req.params.id);
        if (!periode) {
            return res.status(404).json({
                success: false,
                message: 'Periode tidak ditemukan'
            });
        }
        res.json({
            success: true,
            data: periode
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data periode'
        });
    }
});

// Create or update periode
router.post(['/', '/:id'], isAdmin, async (req, res) => {
    try {
        const { nama_periode, urutan_periode, tanggal_mulai, tanggal_selesai, id_biaya_array, status } = req.body;

        // Validasi input
        if (!nama_periode || !urutan_periode || !tanggal_mulai || !tanggal_selesai || !id_biaya_array) {
            return res.status(400).json({
                success: false,
                message: 'Semua field harus diisi'
            });
        }

        let periodeId;
        let message;

        if (req.params.id) {
            // Update existing periode
            const success = await PeriodePendaftaran.update(req.params.id, {
                nama_periode,
                urutan_periode,
                tanggal_mulai,
                tanggal_selesai,
                id_biaya_array,
                status: status || 'inactive'
            });

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Periode tidak ditemukan'
                });
            }

            periodeId = req.params.id;
            message = 'Periode berhasil diperbarui';
        } else {
            // Create new periode
            periodeId = await PeriodePendaftaran.create({
                nama_periode,
                urutan_periode,
                tanggal_mulai,
                tanggal_selesai,
                id_biaya_array,
                status: status || 'inactive'
            });
            message = 'Periode berhasil dibuat';
        }

        const periode = await PeriodePendaftaran.getById(periodeId);

        res.status(201).json({
            success: true,
            message: message,
            data: periode
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat membuat periode'
        });
    }
});

// Update periode status
router.post('/:id/status', isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status tidak valid'
            });
        }

        const success = await PeriodePendaftaran.updateStatus(req.params.id, status);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Periode tidak ditemukan'
            });
        }

        res.json({
            success: true,
            message: `Status periode berhasil diubah menjadi ${status}`
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengubah status periode'
        });
    }
});

// Delete periode
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const success = await PeriodePendaftaran.delete(req.params.id);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Periode tidak ditemukan'
            });
        }

        res.json({
            success: true,
            message: 'Periode berhasil dihapus'
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus periode'
        });
    }
});

// Get diskon for specific periode and jurusan
router.get('/:id/diskon/:jurusanId', isAdmin, async (req, res) => {
    try {
        const { id: periodeId, jurusanId } = req.params;
        const DiskonPeriode = require('../../../models/DiskonPeriode');
        
        // First verify if periode exists and is active
        const periode = await PeriodePendaftaran.getById(periodeId);
        if (!periode) {
            return res.status(404).json({
                success: false,
                message: 'Periode tidak ditemukan'
            });
        }

        // Get discount data
        const diskon = await DiskonPeriode.getByPeriodeAndJurusan(periodeId, jurusanId);
        
        // If no discount found, return success with 0 discount
        if (!diskon) {
            return res.json({
                success: true,
                data: {
                    id_periode: periodeId,
                    id_jurusan: jurusanId,
                    nominal_diskon: 0
                },
                message: 'Tidak ada diskon untuk periode dan jurusan ini'
            });
        }

        // Return found discount
        res.json({
            success: true,
            data: diskon,
            message: 'Data diskon ditemukan'
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data diskon'
        });
    }
});

module.exports = router;
