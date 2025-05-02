const express = require('express');
const router = express.Router();
const Petugas = require('../../../models/Petugas');
const { isAdmin } = require('../../../middleware/auth');

// Get all petugas
router.get('/', isAdmin, async (req, res) => {
    try {
        const petugas = await Petugas.findAll();
        res.json(petugas);
    } catch (error) {
        console.error('Error fetching petugas:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data petugas' });
    }
});

// Get single petugas
router.get('/:id', isAdmin, async (req, res) => {
    try {
        const petugas = await Petugas.findById(req.params.id);
        if (!petugas) {
            return res.status(404).json({ message: 'Petugas tidak ditemukan' });
        }
        res.json(petugas);
    } catch (error) {
        console.error('Error fetching petugas:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data petugas' });
    }
});

// Create new petugas
router.post('/', isAdmin, async (req, res) => {
    try {
        const { nama_lengkap, nomor_whatsapp, password, roles, jenis_kelamin } = req.body;

        // Validate required fields
        if (!nama_lengkap || !nomor_whatsapp || !password || !roles || !jenis_kelamin) {
            return res.status(400).json({ message: 'Semua field harus diisi' });
        }

        // Validate roles
        if (!['Petugas', 'Bendahara'].includes(roles)) {
            return res.status(400).json({ message: 'Role tidak valid' });
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

        // Check if user already exists
        const existingUser = await Petugas.findByWhatsApp(nomor_whatsapp);
        if (existingUser) {
            return res.status(400).json({ message: 'Nomor WhatsApp sudah terdaftar' });
        }

        // Create new petugas
        await Petugas.create({
            nama_lengkap,
            nomor_whatsapp,
            password,
            roles,
            jenis_kelamin
        });

        res.status(201).json({ message: 'Petugas berhasil ditambahkan' });
    } catch (error) {
        console.error('Error creating petugas:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan petugas' });
    }
});

// Update petugas
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const { nama_lengkap, nomor_whatsapp, password, roles, jenis_kelamin } = req.body;
        const id = req.params.id;

        // Validate required fields
        if (!nama_lengkap || !nomor_whatsapp || !roles || !jenis_kelamin) {
            return res.status(400).json({ message: 'Nama, nomor WhatsApp, role, dan jenis kelamin harus diisi' });
        }

        // Validate roles
        if (!['Petugas', 'Bendahara'].includes(roles)) {
            return res.status(400).json({ message: 'Role tidak valid' });
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

        // Check if petugas exists
        const petugas = await Petugas.findById(id);
        if (!petugas) {
            return res.status(404).json({ message: 'Petugas tidak ditemukan' });
        }

        // Check if WhatsApp number is already used by another user
        const existingUser = await Petugas.findByWhatsApp(nomor_whatsapp);
        if (existingUser && existingUser.id_user !== parseInt(id)) {
            return res.status(400).json({ message: 'Nomor WhatsApp sudah terdaftar' });
        }

        // Update petugas
        if (password) {
            await Petugas.updateWithPassword(id, {
                nama_lengkap,
                nomor_whatsapp,
                password,
                roles,
                jenis_kelamin
            });
        } else {
            await Petugas.update(id, {
                nama_lengkap,
                nomor_whatsapp,
                roles,
                jenis_kelamin
            });
        }

        res.json({ message: 'Petugas berhasil diperbarui' });
    } catch (error) {
        console.error('Error updating petugas:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui petugas' });
    }
});

// Delete petugas
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const id = req.params.id;

        // Check if petugas exists and is actually a staff member
        const petugas = await Petugas.findById(id);
        if (!petugas) {
            return res.status(404).json({ message: 'Petugas tidak ditemukan' });
        }

        // Verify this is actually a staff member
        if (!['Petugas', 'Bendahara'].includes(petugas.roles)) {
            return res.status(400).json({ message: 'Hanya dapat menghapus akun Petugas atau Bendahara' });
        }

        // Delete petugas
        await Petugas.delete(id);

        res.json({ message: 'Petugas berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting petugas:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus petugas' });
    }
});

module.exports = router;
