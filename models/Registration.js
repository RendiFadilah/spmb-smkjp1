const db = require('../config/database');

class Registration {
    static async getProgress(userId) {
        try {
            // Get registration status from database
            const query = `
                SELECT 
                    f.id_formulir,
                    f.data_diri_completed,
                    f.berkas_completed,
                    f.preview_completed,
                    f.pembayaran_completed
                FROM formulir f
                WHERE f.id_user = ?
                ORDER BY f.created_at DESC
                LIMIT 1
            `;
            
            const [rows] = await db.execute(query, [userId]);
            
            if (!rows || rows.length === 0) {
                return 0; // No registration found, start at beli-formulir
            }

            const reg = rows[0];
            
            // Return step index based on completion status
            if (!reg.id_formulir) return 0; // beli-formulir
            if (!reg.data_diri_completed) return 1; // isi-formulir
            if (!reg.berkas_completed) return 2; // upload-berkas
            if (!reg.preview_completed) return 3; // preview-formulir
            if (!reg.pembayaran_completed) return 4; // pembayaran
            
            return 4; // All steps completed
        } catch (error) {
            console.error('Error in Registration.getProgress:', error);
            throw error;
        }
    }

    static async updateProgress(userId, step) {
        try {
            let updateField;
            switch(step) {
                case 'isi-formulir':
                    updateField = 'data_diri_completed';
                    break;
                case 'upload-berkas':
                    updateField = 'berkas_completed';
                    break;
                case 'preview-formulir':
                    updateField = 'preview_completed';
                    break;
                case 'pembayaran':
                    updateField = 'pembayaran_completed';
                    break;
                default:
                    throw new Error('Invalid step');
            }

            const query = `
                UPDATE formulir 
                SET ${updateField} = true,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id_user = ?
                ORDER BY created_at DESC
                LIMIT 1
            `;

            const [result] = await db.execute(query, [userId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in Registration.updateProgress:', error);
            throw error;
        }
    }

    static async getFormData(userId) {
        try {
            const query = `
                SELECT 
                    f.id_formulir,
                    f.nominal_formulir,
                    f.bukti_bayar,
                    d.tempat_lahir,
                    d.tanggal_lahir,
                    d.email,
                    d.no_hp,
                    d.jurusan,
                    b.ijazah_path,
                    b.skhun_path,
                    b.kk_path,
                    b.sertifikat_paths
                FROM formulir f
                LEFT JOIN data_diri d ON d.id_formulir = f.id_formulir
                LEFT JOIN berkas b ON b.id_formulir = f.id_formulir
                WHERE f.id_user = ?
                ORDER BY f.created_at DESC
                LIMIT 1
            `;

            const [rows] = await db.execute(query, [userId]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error in Registration.getFormData:', error);
            throw error;
        }
    }

    static async saveDataDiri(userId, data) {
        try {
            // First get the formulir ID
            const [formulir] = await db.execute(
                'SELECT id_formulir FROM formulir WHERE id_user = ? ORDER BY created_at DESC LIMIT 1',
                [userId]
            );

            if (!formulir || formulir.length === 0) {
                throw new Error('No formulir found for user');
            }

            const id_formulir = formulir[0].id_formulir;

            // Insert or update data_diri
            const query = `
                INSERT INTO data_diri (
                    id_formulir, tempat_lahir, tanggal_lahir, 
                    email, no_hp, jurusan
                ) VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    tempat_lahir = VALUES(tempat_lahir),
                    tanggal_lahir = VALUES(tanggal_lahir),
                    email = VALUES(email),
                    no_hp = VALUES(no_hp),
                    jurusan = VALUES(jurusan)
            `;

            await db.execute(query, [
                id_formulir,
                data.tempat_lahir,
                data.tanggal_lahir,
                data.email,
                data.no_hp,
                data.jurusan
            ]);

            // Update progress in formulir table
            await this.updateProgress(userId, 'isi-formulir');

            return true;
        } catch (error) {
            console.error('Error in Registration.saveDataDiri:', error);
            throw error;
        }
    }

    static async saveBerkas(userId, files) {
        try {
            // First get the formulir ID
            const [formulir] = await db.execute(
                'SELECT id_formulir FROM formulir WHERE id_user = ? ORDER BY created_at DESC LIMIT 1',
                [userId]
            );

            if (!formulir || formulir.length === 0) {
                throw new Error('No formulir found for user');
            }

            const id_formulir = formulir[0].id_formulir;

            // Insert or update berkas
            const query = `
                INSERT INTO berkas (
                    id_formulir, ijazah_path, skhun_path, 
                    kk_path, sertifikat_paths
                ) VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    ijazah_path = VALUES(ijazah_path),
                    skhun_path = VALUES(skhun_path),
                    kk_path = VALUES(kk_path),
                    sertifikat_paths = VALUES(sertifikat_paths)
            `;

            await db.execute(query, [
                id_formulir,
                files.ijazah,
                files.skhun,
                files.kk,
                files.sertifikat ? JSON.stringify(files.sertifikat) : null
            ]);

            // Update progress in formulir table
            await this.updateProgress(userId, 'upload-berkas');

            return true;
        } catch (error) {
            console.error('Error in Registration.saveBerkas:', error);
            throw error;
        }
    }
}

module.exports = Registration;
