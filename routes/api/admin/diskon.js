const express = require('express');
const router = express.Router();
const DiskonPeriode = require('../../../models/DiskonPeriode');
const { isAdmin } = require('../../../middleware/auth');

// Get all diskon
router.get('/', isAdmin, async (req, res) => {
    try {
        const diskon = await DiskonPeriode.getAll();
        res.json({
            success: true,
            data: diskon
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data diskon'
        });
    }
});

// Get diskon by id
router.get('/:id', isAdmin, async (req, res) => {
    try {
        const diskon = await DiskonPeriode.getById(req.params.id);
        if (!diskon) {
            return res.status(404).json({
                success: false,
                message: 'Diskon tidak ditemukan'
            });
        }
        res.json({
            success: true,
            data: diskon
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data diskon'
        });
    }
});

// Get diskon by periode and jurusan
router.get('/periode/:id_periode/jurusan/:id_jurusan', isAdmin, async (req, res) => {
    try {
        const diskon = await DiskonPeriode.getByPeriodeAndJurusan(
            req.params.id_periode,
            req.params.id_jurusan
        );
        
        if (!diskon) {
            return res.status(404).json({
                success: false,
                message: 'Tidak ada diskon untuk periode dan jurusan ini'
            });
        }
        
        res.json({
            success: true,
            data: diskon
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data diskon'
        });
    }
});

// Get diskon by periode
router.get('/periode/:id_periode', isAdmin, async (req, res) => {
    try {
        const diskon = await DiskonPeriode.getByPeriodeId(req.params.id_periode);
        res.json({
            success: true,
            data: diskon
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data diskon'
        });
    }
});

// Get available jurusan for a period
router.get('/jurusan/:id_periode', isAdmin, async (req, res) => {
    try {
        const jurusan = await DiskonPeriode.getAvailableJurusanByPeriodeId(req.params.id_periode);
        res.json({
            success: true,
            data: jurusan
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data jurusan'
        });
    }
});

// Create new diskon
router.post('/', isAdmin, async (req, res) => {
    try {
        const { id_periode, id_jurusan, nominal_diskon } = req.body;

        // Validasi input
        if (!id_periode || !id_jurusan || !nominal_diskon) {
            return res.status(400).json({
                success: false,
                message: 'Semua field harus diisi'
            });
        }

        // Handle array of jurusan IDs
        const jurusanIds = Array.isArray(id_jurusan) ? id_jurusan : [id_jurusan];
        
        // Check for existing discounts for each jurusan
        for (const jurusanId of jurusanIds) {
            const existingDiskon = await DiskonPeriode.getByPeriodeAndJurusan(id_periode, jurusanId);
            if (existingDiskon) {
                return res.status(400).json({
                    success: false,
                    message: `Diskon untuk periode ini dan jurusan dengan ID ${jurusanId} sudah ada`
                });
            }
        }

        // Create discounts for each jurusan
        const createdDiskon = [];
        for (const jurusanId of jurusanIds) {
            const diskonId = await DiskonPeriode.create({
                id_periode,
                id_jurusan: jurusanId,
                nominal_diskon
            });
            const newDiskon = await DiskonPeriode.getById(diskonId);
            createdDiskon.push(newDiskon);
        }

        res.status(201).json({
            success: true,
            message: 'Diskon berhasil dibuat',
            data: createdDiskon
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat membuat diskon'
        });
    }
});

// Update diskon
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const { id_periode, id_jurusan, nominal_diskon } = req.body;

        // Validasi input
        if (!id_periode || !id_jurusan || !nominal_diskon) {
            return res.status(400).json({
                success: false,
                message: 'Semua field harus diisi'
            });
        }

        // Handle array of jurusan IDs
        const jurusanIds = Array.isArray(id_jurusan) ? id_jurusan : [id_jurusan];
        
        // Delete existing discounts for this period
        await DiskonPeriode.deleteByPeriodeId(id_periode);
        
        // Create new discounts for each jurusan
        const createdDiskon = [];
        for (const jurusanId of jurusanIds) {
            const diskonId = await DiskonPeriode.create({
                id_periode,
                id_jurusan: jurusanId,
                nominal_diskon
            });
            const newDiskon = await DiskonPeriode.getById(diskonId);
            createdDiskon.push(newDiskon);
        }

        res.json({
            success: true,
            message: 'Diskon berhasil diupdate',
            data: createdDiskon
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengupdate diskon'
        });
    }
});

// Delete diskon
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const success = await DiskonPeriode.delete(req.params.id);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Diskon tidak ditemukan'
            });
        }

        res.json({
            success: true,
            message: 'Diskon berhasil dihapus'
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus diskon'
        });
    }
});

module.exports = router;
