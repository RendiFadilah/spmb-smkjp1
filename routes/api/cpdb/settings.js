const express = require('express');
const router = express.Router();
const db = require('../../../config/database');
const bcrypt = require('bcryptjs');
const { isAuthenticated } = require('../../../middleware/auth');

// Update profile
router.put('/profile', isAuthenticated, async (req, res) => {
    try {
        const { nama_lengkap, nomor_whatsapp } = req.body;
        const userId = req.user.id;  // Changed from id_user to id to match middleware

        const query = `
            UPDATE users 
            SET nama_lengkap = ?, 
                nomor_whatsapp = ?
            WHERE id_user = ?
        `;

        await db.execute(query, [nama_lengkap, nomor_whatsapp, userId]);

        res.json({ 
            success: true, 
            message: 'Profil berhasil diperbarui',
            user: {
                id_user: req.user.id,
                nama_lengkap: nama_lengkap,
                nomor_whatsapp: nomor_whatsapp
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat memperbarui profil' 
        });
    }
});

// Change password
router.put('/password', isAuthenticated, async (req, res) => {
    try {
        const { current_password, new_password, confirm_password } = req.body;
        const userId = req.user.id;  // Changed from id_user to id to match middleware

        // Validate password match
        if (new_password !== confirm_password) {
            return res.status(400).json({
                success: false,
                message: 'Password baru dan konfirmasi password tidak cocok'
            });
        }

        // Get current user password
        const [user] = await db.execute('SELECT password FROM users WHERE id_user = ?', [userId]);
        
        if (!user.length) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(current_password, user[0].password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Password saat ini tidak valid'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);

        // Update password and raw_password
        await db.execute(
            'UPDATE users SET password = ?, raw_password = ? WHERE id_user = ?',
            [hashedPassword, new_password, userId]
        );

        res.json({
            success: true,
            message: 'Password berhasil diperbarui'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengubah password'
        });
    }
});

module.exports = router;
