const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Settings {
    static async updateProfile(userId, data) {
        if (!userId) {
            throw new Error('User ID is required');
        }

        const query = `
            UPDATE users 
            SET nama_lengkap = ?,
                nik = ?,
                nomor_whatsapp = ?
            WHERE id_user = ?
        `;
        
        const [result] = await db.execute(query, [
            data.nama_lengkap,
            data.nik,
            data.nomor_whatsapp,
            userId
        ]);
        
        return result.affectedRows > 0;
    }

    static async updatePassword(userId, oldPassword, newPassword) {
        if (!userId) {
            throw new Error('User ID is required');
        }

        // Get current user data
        const [users] = await db.execute(
            'SELECT * FROM users WHERE id_user = ?',
            [userId]
        );
        
        const user = users[0];
        if (!user) {
            throw new Error('User tidak ditemukan');
        }

        // Verify old password
        const isValidPassword = await bcrypt.compare(oldPassword, user.password);
        if (!isValidPassword) {
            throw new Error('Password lama tidak sesuai');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        const query = `
            UPDATE users 
            SET password = ?
            WHERE id_user = ?
        `;
        
        const [result] = await db.execute(query, [hashedPassword, userId]);
        return result.affectedRows > 0;
    }

    static async getUserById(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }

        const query = `
            SELECT id_user, nama_lengkap, nomor_whatsapp, nik
            FROM users 
            WHERE id_user = ?
        `;
        
        const [rows] = await db.execute(query, [userId]);
        return rows[0];
    }
}

module.exports = Settings;
