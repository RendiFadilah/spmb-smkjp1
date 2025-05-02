const express = require('express');
const router = express.Router();
const Jurusan = require('../../../models/Jurusan');

// Get all jurusan
router.get('/', async (req, res) => {
    try {
        const jurusan = await Jurusan.getAll();
        res.json(jurusan);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data jurusan' });
    }
});

// Get jurusan by ID
router.get('/:id', async (req, res) => {
    try {
        const jurusan = await Jurusan.getById(req.params.id);
        if (!jurusan) {
            return res.status(404).json({ message: 'Jurusan tidak ditemukan' });
        }
        res.json(jurusan);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data jurusan' });
    }
});

// Create new jurusan
router.post('/', async (req, res) => {
    try {
        const data = {
            ...req.body,
            kapasitas: parseInt(req.body.kapasitas)
        };

        const id = await Jurusan.create(data);
        const jurusan = await Jurusan.getById(id);
        res.status(201).json(jurusan);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat membuat jurusan' });
    }
});

// Update jurusan
router.put('/:id', async (req, res) => {
    try {
        const data = {
            ...req.body,
            kapasitas: parseInt(req.body.kapasitas)
        };

        const success = await Jurusan.update(req.params.id, data);
        if (!success) {
            return res.status(404).json({ message: 'Jurusan tidak ditemukan' });
        }

        const jurusan = await Jurusan.getById(req.params.id);
        res.json(jurusan);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui jurusan' });
    }
});

// Delete jurusan
router.delete('/:id', async (req, res) => {
    try {
        const success = await Jurusan.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Jurusan tidak ditemukan' });
        }
        res.json({ message: 'Jurusan berhasil dihapus' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus jurusan' });
    }
});

module.exports = router;
