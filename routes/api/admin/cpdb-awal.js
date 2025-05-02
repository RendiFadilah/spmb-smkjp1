const express = require('express');
const router = express.Router();
const CPDBAwal = require('../../../models/CPDBAwal');
const { isAdmin } = require('../../../middleware/auth');

// Get all CPDB
router.get('/', isAdmin, async (req, res) => {
    try {
        const cpdbList = await CPDBAwal.findAll();
        res.json(cpdbList);
    } catch (error) {
        console.error('Error in GET /cpdb-awal:', error);
        res.status(500).json({ 
            message: 'Terjadi kesalahan saat mengambil data CPDB' 
        });
    }
});

// Get CPDB by ID
router.get('/:id', isAdmin, async (req, res) => {
    try {
        const cpdb = await CPDBAwal.findById(req.params.id);
        if (!cpdb) {
            return res.status(404).json({ message: 'CPDB tidak ditemukan' });
        }
        res.json(cpdb);
    } catch (error) {
        console.error('Error in GET /cpdb-awal/:id:', error);
        res.status(500).json({ 
            message: 'Terjadi kesalahan saat mengambil data CPDB' 
        });
    }
});

// Create new CPDB
router.post('/', isAdmin, async (req, res) => {
    try {
        const { nama_lengkap, nomor_whatsapp, nisn, nik, asal_smp, jenis_kelamin } = req.body;

        // Validate required fields
        if (!nama_lengkap || !nomor_whatsapp || !nisn || !nik || !asal_smp || !jenis_kelamin) {
            return res.status(400).json({ message: 'Semua field harus diisi' });
        }

        // Validate jenis_kelamin
        if (!['Laki-laki', 'Perempuan'].includes(jenis_kelamin)) {
            return res.status(400).json({ message: 'Jenis kelamin harus dipilih (Laki-laki/Perempuan)' });
        }

        // Validate WhatsApp number format
        const whatsappRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
        if (!whatsappRegex.test(nomor_whatsapp)) {
            return res.status(400).json({ message: 'Format nomor WhatsApp tidak valid' });
        }

        // Check if WhatsApp number already exists
        const existingWhatsApp = await CPDBAwal.findByWhatsApp(nomor_whatsapp);
        if (existingWhatsApp) {
            return res.status(400).json({ 
                message: 'Nomor WhatsApp sudah terdaftar' 
            });
        }

        // Check if NISN already exists
        const existingNISN = await CPDBAwal.findByNISN(nisn);
        if (existingNISN) {
            return res.status(400).json({ 
                message: 'NISN sudah terdaftar' 
            });
        }

        // Check if NIK already exists
        const existingNIK = await CPDBAwal.findByNIK(nik);
        if (existingNIK) {
            return res.status(400).json({ 
                message: 'NIK sudah terdaftar' 
            });
        }

        const cpdbId = await CPDBAwal.create({
            nama_lengkap,
            nomor_whatsapp,
            nisn,
            nik,
            asal_smp,
            jenis_kelamin
        });
        
        res.status(201).json({
            message: 'CPDB berhasil ditambahkan'
        });
    } catch (error) {
        console.error('Error in POST /cpdb-awal:', error);
        res.status(500).json({ 
            message: error.message || 'Terjadi kesalahan saat menambahkan CPDB' 
        });
    }
});

// Update CPDB
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const { nama_lengkap, nomor_whatsapp, nisn, nik, asal_smp, jenis_kelamin, status_wawancara } = req.body;
        const id = req.params.id;

        // Validate required fields
        if (!nama_lengkap || !nomor_whatsapp || !nisn || !nik || !asal_smp || !jenis_kelamin) {
            return res.status(400).json({ message: 'Semua field harus diisi' });
        }

        // Validate jenis_kelamin
        if (!['Laki-laki', 'Perempuan'].includes(jenis_kelamin)) {
            return res.status(400).json({ message: 'Jenis kelamin harus dipilih (Laki-laki/Perempuan)' });
        }

        // Validate WhatsApp number format
        const whatsappRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
        if (!whatsappRegex.test(nomor_whatsapp)) {
            return res.status(400).json({ message: 'Format nomor WhatsApp tidak valid' });
        }

        // Check if CPDB exists
        const cpdb = await CPDBAwal.findById(id);
        if (!cpdb) {
            return res.status(404).json({ message: 'CPDB tidak ditemukan' });
        }

        // Check if WhatsApp number is already used by another user
        const existingWhatsApp = await CPDBAwal.findByWhatsApp(nomor_whatsapp);
        if (existingWhatsApp && existingWhatsApp.id_user !== parseInt(id)) {
            return res.status(400).json({ message: 'Nomor WhatsApp sudah terdaftar' });
        }

        // Check if NISN is already used by another user
        const existingNISN = await CPDBAwal.findByNISN(nisn);
        if (existingNISN && existingNISN.id_user !== parseInt(id)) {
            return res.status(400).json({ message: 'NISN sudah terdaftar' });
        }

        // Check if NIK is already used by another user
        const existingNIK = await CPDBAwal.findByNIK(nik);
        if (existingNIK && existingNIK.id_user !== parseInt(id)) {
            return res.status(400).json({ message: 'NIK sudah terdaftar' });
        }

        // Update CPDB
        await CPDBAwal.update(id, {
            nama_lengkap,
            nomor_whatsapp,
            nisn,
            nik,
            asal_smp,
            jenis_kelamin,
            status_wawancara
        });

        res.json({ message: 'Data CPDB berhasil diperbarui' });
    } catch (error) {
        console.error('Error in PUT /cpdb-awal/:id:', error);
        res.status(500).json({ 
            message: error.message || 'Terjadi kesalahan saat memperbarui data CPDB' 
        });
    }
});

// Delete CPDB
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const id = req.params.id;

        // Check if CPDB exists
        const cpdb = await CPDBAwal.findById(id);
        if (!cpdb) {
            return res.status(404).json({ message: 'CPDB tidak ditemukan' });
        }

        // Delete CPDB
        await CPDBAwal.delete(id);
        res.json({ message: 'CPDB berhasil dihapus' });
    } catch (error) {
        console.error('Error in DELETE /cpdb-awal/:id:', error);
        res.status(500).json({ 
            message: 'Terjadi kesalahan saat menghapus CPDB' 
        });
    }
});

// Update CPDB status wawancara
router.put('/:id/status', isAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const { status_wawancara } = req.body;

        // Validate status
        if (!['Belum', 'Sudah'].includes(status_wawancara)) {
            return res.status(400).json({ 
                message: 'Status wawancara tidak valid' 
            });
        }

        // Check if CPDB exists
        const cpdb = await CPDBAwal.findById(id);
        if (!cpdb) {
            return res.status(404).json({ 
                message: 'CPDB tidak ditemukan' 
            });
        }

        // Update status
        await CPDBAwal.updateStatus(id, status_wawancara);
        res.json({ 
            message: 'Status wawancara berhasil diperbarui',
            status: status_wawancara
        });
    } catch (error) {
        console.error('Error in PUT /cpdb-awal/:id/status:', error);
        res.status(500).json({ 
            message: 'Terjadi kesalahan saat memperbarui status wawancara' 
        });
    }
});

// Get CPDB statistics
router.get('/stats/wawancara', isAdmin, async (req, res) => {
    try {
        const stats = await CPDBAwal.getStatusWawancaraStats();
        res.json(stats);
    } catch (error) {
        console.error('Error in GET /cpdb-awal/stats/wawancara:', error);
        res.status(500).json({ 
            message: 'Terjadi kesalahan saat mengambil statistik wawancara' 
        });
    }
});

module.exports = router;
