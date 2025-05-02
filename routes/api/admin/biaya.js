const express = require('express');
const router = express.Router();
const MasterBiayaJurusan = require('../../../models/MasterBiayaJurusan');

// Get all biaya
router.get('/', async (req, res) => {
    try {
        const biaya = await MasterBiayaJurusan.getAll();
        res.json(biaya);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data biaya' });
    }
});

// Get jurusan for dropdown
router.get('/data/jurusan', async (req, res) => {
    try {
        const jurusan = await MasterBiayaJurusan.getJurusan();
        res.json(jurusan);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data jurusan' });
    }
});

// Get biaya by ID
router.get('/:id', async (req, res) => {
    try {
        const biaya = await MasterBiayaJurusan.getById(req.params.id);
        if (!biaya) {
            return res.status(404).json({ message: 'Data biaya tidak ditemukan' });
        }
        res.json(biaya);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data biaya' });
    }
});

// Create new biaya
router.post('/', async (req, res) => {
    try {
        const id = await MasterBiayaJurusan.create(req.body);
        const biaya = await MasterBiayaJurusan.getById(id);
        res.status(201).json(biaya);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat membuat data biaya' });
    }
});

// Update biaya
router.put('/:id', async (req, res) => {
    try {
        const success = await MasterBiayaJurusan.update(req.params.id, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Data biaya tidak ditemukan' });
        }
        const biaya = await MasterBiayaJurusan.getById(req.params.id);
        res.json(biaya);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui data biaya' });
    }
});

// Delete biaya
router.delete('/:id', async (req, res) => {
    try {
        const success = await MasterBiayaJurusan.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Data biaya tidak ditemukan' });
        }
        res.json({ message: 'Data biaya berhasil dihapus' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus data biaya' });
    }
});

module.exports = router;
