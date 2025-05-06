const db = require('../config/database');
const moment = require('moment-timezone');

class Reward {
    static async getAll() {
        const query = `
            SELECT r.*, f.no_formulir, u.nama_lengkap as nama_cpdb
            FROM rewards r
            LEFT JOIN pembayaran_pendaftaran p ON r.id_pembayaran = p.id_pembayaran
            LEFT JOIN formulir f ON p.id_formulir = f.id_formulir
            LEFT JOIN users u ON f.id_user = u.id_user
            ORDER BY r.tanggal_reward ASC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async getById(id) {
        const query = `
            SELECT r.*, f.no_formulir, u.nama_lengkap as nama_cpdb, j.jurusan
            FROM rewards r
            LEFT JOIN pembayaran_pendaftaran p ON r.id_pembayaran = p.id_pembayaran
            LEFT JOIN formulir f ON p.id_formulir = f.id_formulir
            LEFT JOIN users u ON f.id_user = u.id_user
            LEFT JOIN registrasi_peserta_didik rpd ON f.id_formulir = rpd.id_formulir
            LEFT JOIN jurusan j ON rpd.jurusan = j.id_jurusan
            WHERE r.id_reward = ?
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async create(data, loggedInUser) {
        const jakartaTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        
        const query = `
            INSERT INTO rewards (
                tanggal_reward,
                id_pembayaran,
                nama_pembawa,
                keterangan_pembawa,
                no_wa_pembawa,
                nominal,
                nama_petugas,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            jakartaTime,
            data.id_pembayaran || null,
            data.nama_pembawa || '',
            data.keterangan_pembawa || '',
            data.no_wa_pembawa || '',
            data.nominal || 0,
            loggedInUser.nama || '',
            jakartaTime,
            jakartaTime
        ];

        const [result] = await db.execute(query, values);
        return result.insertId;
    }

    static async update(id, data) {
        const jakartaTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        
        // Get existing data first
        const [existing] = await db.execute('SELECT * FROM rewards WHERE id_reward = ?', [id]);
        if (!existing || existing.length === 0) {
            return false;
        }

        const currentData = existing[0];
        
        const query = `
            UPDATE rewards 
            SET tanggal_reward = ?,
                id_pembayaran = ?,
                nama_pembawa = ?,
                keterangan_pembawa = ?,
                no_wa_pembawa = ?,
                nominal = ?,
                updated_at = ?
            WHERE id_reward = ?
        `;

        const values = [
            jakartaTime,
            data.id_pembayaran || currentData.id_pembayaran,
            data.nama_pembawa || currentData.nama_pembawa,
            data.keterangan_pembawa || currentData.keterangan_pembawa,
            data.no_wa_pembawa || currentData.no_wa_pembawa,
            data.nominal || currentData.nominal,
            jakartaTime,
            id
        ];

        const [result] = await db.execute(query, values);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const query = 'DELETE FROM rewards WHERE id_reward = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }

    static async getStats() {
        const query = `
            SELECT 
                COUNT(*) as total,
                COALESCE(SUM(nominal), 0) as total_nominal
            FROM rewards
        `;
        const [rows] = await db.execute(query);
        return rows[0];
    }

    static async getToday() {
        const query = `
            SELECT r.*, f.no_formulir, u.nama_lengkap as nama_cpdb
            FROM rewards r
            LEFT JOIN pembayaran_pendaftaran p ON r.id_pembayaran = p.id_pembayaran
            LEFT JOIN formulir f ON p.id_formulir = f.id_formulir
            LEFT JOIN users u ON f.id_user = u.id_user
            WHERE DATE(r.tanggal_reward) = CURDATE()
            ORDER BY r.tanggal_reward DESC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async getStatsToday() {
        const query = `
            SELECT 
                COUNT(*) as total,
                COALESCE(SUM(nominal), 0) as total_nominal
            FROM rewards
            WHERE DATE(tanggal_reward) = CURDATE()
        `;
        const [rows] = await db.execute(query);
        return rows[0];
    }

    static async getEligiblePayments() {
        const query = `
            SELECT 
                p.id_pembayaran,
                f.no_formulir,
                u.nama_lengkap as nama_cpdb
            FROM pembayaran_pendaftaran p
            JOIN formulir f ON p.id_formulir = f.id_formulir
            JOIN users u ON f.id_user = u.id_user
            LEFT JOIN rewards r ON p.id_pembayaran = r.id_pembayaran
            WHERE r.id_reward IS NULL
        `;
        const [rows] = await db.execute(query);
        return rows;
    }
}

module.exports = Reward;
