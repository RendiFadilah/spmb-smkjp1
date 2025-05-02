const express = require('express');
const router = express.Router();
const Settings = require('../../../models/Settings');

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        const profile = await Settings.getUserById(req.user.id);
        if (!profile) {
            return res.status(404).json({ message: 'Profil tidak ditemukan' });
        }
        res.json(profile);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil profil' });
    }
});

// Update profile
router.put('/profile', async (req, res) => {
    try {
        const success = await Settings.updateProfile(req.user.id, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Profil tidak ditemukan' });
        }
        const updatedProfile = await Settings.getUserById(req.user.id);
        res.json(updatedProfile);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui profil' });
    }
});

// Update password
router.put('/password', async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Password lama dan baru harus diisi' });
        }

        const success = await Settings.updatePassword(req.user.id, oldPassword, newPassword);
        if (!success) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }
        
        res.json({ message: 'Password berhasil diperbarui' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message || 'Terjadi kesalahan saat memperbarui password' });
    }
});

module.exports = router;
