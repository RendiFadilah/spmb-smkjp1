    const db = require('../config/database');
const moment = require('moment-timezone');

class Formulir {
    static async getAll() {
        const query = `
            SELECT f.*, u.nama_lengkap, u.asal_smp, k.kode_bayar 
            FROM formulir f
            JOIN users u ON f.id_user = u.id_user
            JOIN kode_pembayaran k ON f.id_kode_pembayaran = k.id_kode_pembayaran
            ORDER BY f.id_formulir ASC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async getById(id) {
        const query = `
            SELECT 
                f.*,
                u.nama_lengkap,
                u.nisn,
                u.asal_smp,
                u.nik,
                u.nomor_whatsapp,
                u.raw_password,
                k.kode_bayar
            FROM formulir f
            JOIN users u ON f.id_user = u.id_user
            JOIN kode_pembayaran k ON f.id_kode_pembayaran = k.id_kode_pembayaran
            WHERE f.id_formulir = ?
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async getNextFormNumber() {
        const query = 'SELECT MAX(no_formulir) as max_number FROM formulir';
        const [rows] = await db.execute(query);
        const maxNumber = rows[0].max_number || 100; // Start from 100 if no records
        return maxNumber + 1;
    }

    static async getEligibleCPDB() {
        const query = `
            SELECT u.id_user, u.nama_lengkap, u.nisn, u.asal_smp 
            FROM users u
            WHERE u.roles = 'CPDB' 
            AND u.status_wawancara = 'Sudah'
            AND u.id_user NOT IN (SELECT id_user FROM formulir)
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async getAvailablePaymentCodes() {
        const query = `
            SELECT id_kode_pembayaran, kode_bayar 
            FROM kode_pembayaran 
            WHERE status = 'Belum Terpakai'
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async create(data, loggedInUser) {
        const jakartaTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        const nextFormNumber = await this.getNextFormNumber();
        
        // Set status based on user roles
        const status = (loggedInUser.roles === 'Admin' || loggedInUser.roles === 'Petugas') 
            ? 'Terverifikasi' 
            : 'Proses';

        const query = `
            INSERT INTO formulir (
                id_user, 
                id_kode_pembayaran, 
                tanggal, 
                no_formulir, 
                nominal_formulir, 
                bukti_bayar,
                status,
                verifikator,
                metode_pembayaran,
                nama_pengirim
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Ensure bukti_bayar is null if not provided
        const bukti_bayar = data.bukti_bayar === undefined ? null : data.bukti_bayar;
        // Ensure nama_pengirim is null if not provided or if metode_pembayaran is not Transfer
        const nama_pengirim = (data.metode_pembayaran === 'Transfer' && data.nama_pengirim) ? data.nama_pengirim : null;

        const [result] = await db.execute(query, [
            data.id_user,
            data.id_kode_pembayaran,
            jakartaTime,
            nextFormNumber,
            data.nominal_formulir,
            bukti_bayar,
            status,
            loggedInUser.nama, // Using nama instead of nama_lengkap to match auth middleware
            data.metode_pembayaran,
            nama_pengirim
        ]);

        // Update kode pembayaran status to "Sudah Terpakai"
        await db.execute(
            'UPDATE kode_pembayaran SET status = "Sudah Terpakai" WHERE id_kode_pembayaran = ?',
            [data.id_kode_pembayaran]
        );

        return result.insertId;
    }

    static async update(id, data) {
        const query = `
            UPDATE formulir 
            SET nominal_formulir = ?, 
                bukti_bayar = ?,
                metode_pembayaran = ?,
                nama_pengirim = ?
            WHERE id_formulir = ?
        `;

        // Ensure bukti_bayar is null if not provided
        const bukti_bayar = data.bukti_bayar === undefined ? null : data.bukti_bayar;
        // Ensure nama_pengirim is null if not provided or if metode_pembayaran is not Transfer
        const nama_pengirim = (data.metode_pembayaran === 'Transfer' && data.nama_pengirim) ? data.nama_pengirim : null;

        const [result] = await db.execute(query, [
            data.nominal_formulir,
            bukti_bayar,
            data.metode_pembayaran,
            nama_pengirim,
            id
        ]);

        return result.affectedRows > 0;
    }

    static async delete(id) {
        // Get kode pembayaran ID before deleting
        const [form] = await db.execute(
            'SELECT id_kode_pembayaran FROM formulir WHERE id_formulir = ?',
            [id]
        );

        if (form[0]) {
            // Reset kode pembayaran status
            await db.execute(
                'UPDATE kode_pembayaran SET status = "Belum Terpakai" WHERE id_kode_pembayaran = ?',
                [form[0].id_kode_pembayaran]
            );
        }

        const query = 'DELETE FROM formulir WHERE id_formulir = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }

    static async getStats() {
        const query = `
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Proses' THEN 1 ELSE 0 END) as proses,
                SUM(CASE WHEN status = 'Terverifikasi' THEN 1 ELSE 0 END) as terverifikasi,
                COALESCE(SUM(nominal_formulir), 0) as totalUang
            FROM formulir
        `;
        const [rows] = await db.execute(query);
        return rows[0];
    }

    static async getToday() {
        const query = `
            SELECT f.*, u.nama_lengkap, u.asal_smp, k.kode_bayar 
            FROM formulir f
            JOIN users u ON f.id_user = u.id_user
            JOIN kode_pembayaran k ON f.id_kode_pembayaran = k.id_kode_pembayaran
            WHERE DATE(f.tanggal) = CURDATE()
            ORDER BY f.id_formulir ASC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async getStatsToday() {
        const query = `
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Proses' THEN 1 ELSE 0 END) as proses,
                SUM(CASE WHEN status = 'Terverifikasi' THEN 1 ELSE 0 END) as terverifikasi,
                COALESCE(SUM(nominal_formulir), 0) as totalUang
            FROM formulir
            WHERE DATE(tanggal) = CURDATE()
        `;
        const [rows] = await db.execute(query);
        return rows[0];
    }

    static async verify(id, verifikator) {
        const query = `
            UPDATE formulir 
            SET status = 'Terverifikasi',
                verifikator = ?
            WHERE id_formulir = ?
        `;
        
        const [result] = await db.execute(query, [verifikator, id]);
        return result.affectedRows > 0;
    }

}

module.exports = Formulir;
