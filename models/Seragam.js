const db = require('../config/database');
const moment = require('moment-timezone');

class Seragam {
    static async getAll() {
        const query = `
            SELECT s.*, 
                   u.nama_lengkap as nama_cpdb,
                   u.jenis_kelamin,
                   j.jurusan,
                   f.no_formulir as nomor_formulir
            FROM seragam s
            JOIN pembayaran_pendaftaran pp ON s.id_pembayaran = pp.id_pembayaran
            JOIN formulir f ON pp.id_formulir = f.id_formulir
            JOIN users u ON f.id_user = u.id_user
            JOIN registrasi_peserta_didik rpd ON f.id_formulir = rpd.id_formulir
            JOIN jurusan j ON rpd.jurusan = j.id_jurusan
            ORDER BY s.tanggal_pemberian ASC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async getById(id) {
        const query = `
            SELECT s.*, 
                   u.nama_lengkap as nama_cpdb,
                   u.jenis_kelamin,
                   j.jurusan,
                   f.no_formulir as nomor_formulir
            FROM seragam s
            JOIN pembayaran_pendaftaran pp ON s.id_pembayaran = pp.id_pembayaran
            JOIN formulir f ON pp.id_formulir = f.id_formulir
            JOIN users u ON f.id_user = u.id_user
            JOIN registrasi_peserta_didik rpd ON f.id_formulir = rpd.id_formulir
            JOIN jurusan j ON rpd.jurusan = j.id_jurusan
            WHERE s.id_seragam = ?
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async getAvailablePayments() {
        const query = `
            SELECT pp.id_pembayaran, 
                   u.nama_lengkap as nama_cpdb,
                   j.jurusan,
                   f.no_formulir as nomor_formulir
            FROM pembayaran_pendaftaran pp
            JOIN formulir f ON pp.id_formulir = f.id_formulir
            JOIN users u ON f.id_user = u.id_user
            JOIN registrasi_peserta_didik rpd ON f.id_formulir = rpd.id_formulir
            JOIN jurusan j ON rpd.jurusan = j.id_jurusan
            WHERE pp.id_pembayaran NOT IN (SELECT id_pembayaran FROM seragam)
            ORDER BY f.no_formulir ASC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async create(data) {
        const jakartaTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        const query = `
            INSERT INTO seragam (
                id_pembayaran,
                tanggal_pemberian,
                seragam_batik,
                seragam_olahraga,
                seragam_muslim,
                al_quran,
                tempat_makan,
                kartu_pelajar,
                gesper,
                kerudung,
                nama_petugas,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [
            data.id_pembayaran,
            data.tanggal_pemberian,
            data.seragam_batik || 'Belum',
            data.seragam_olahraga || 'Belum',
            data.seragam_muslim || 'Belum',
            data.al_quran || 'Belum',
            data.tempat_makan || 'Belum',
            data.kartu_pelajar || 'Belum',
            data.gesper || 'Belum',
            data.kerudung || 'Belum',
            data.nama_petugas,
            jakartaTime,
            jakartaTime
        ]);

        return result.insertId;
    }

    static async update(id, data) {
        const jakartaTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        const query = `
            UPDATE seragam 
            SET tanggal_pemberian = ?,
                seragam_batik = ?,
                seragam_olahraga = ?,
                seragam_muslim = ?,
                al_quran = ?,
                tempat_makan = ?,
                kartu_pelajar = ?,
                gesper = ?,
                kerudung = ?,
                nama_petugas = ?,
                updated_at = ?
            WHERE id_seragam = ?
        `;

        const [result] = await db.execute(query, [
            data.tanggal_pemberian,
            data.seragam_batik,
            data.seragam_olahraga,
            data.seragam_muslim,
            data.al_quran,
            data.tempat_makan,
            data.kartu_pelajar,
            data.gesper,
            data.kerudung,
            data.nama_petugas,
            jakartaTime,
            id
        ]);

        return result.affectedRows > 0;
    }

    static async updateStatus(id, field, status) {
        const jakartaTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        const query = `
            UPDATE seragam 
            SET ${field} = ?,
                updated_at = ?
            WHERE id_seragam = ?
        `;

        const [result] = await db.execute(query, [status, jakartaTime, id]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const query = 'DELETE FROM seragam WHERE id_seragam = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }

    static async getToday() {
        const query = `
            SELECT s.*, 
                   u.nama_lengkap as nama_cpdb,
                   u.jenis_kelamin,
                   j.jurusan,
                   f.no_formulir as nomor_formulir
            FROM seragam s
            JOIN pembayaran_pendaftaran pp ON s.id_pembayaran = pp.id_pembayaran
            JOIN formulir f ON pp.id_formulir = f.id_formulir
            JOIN users u ON f.id_user = u.id_user
            JOIN registrasi_peserta_didik rpd ON f.id_formulir = rpd.id_formulir
            JOIN jurusan j ON rpd.jurusan = j.id_jurusan
            WHERE DATE(s.tanggal_pemberian) = CURDATE()
            ORDER BY s.tanggal_pemberian ASC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async getAllByJurusan(jurusan) {
        const query = `
            SELECT s.*, 
                   u.nama_lengkap as nama_cpdb,
                   u.jenis_kelamin,
                   j.jurusan,
                   f.no_formulir as nomor_formulir
            FROM seragam s
            JOIN pembayaran_pendaftaran pp ON s.id_pembayaran = pp.id_pembayaran
            JOIN formulir f ON pp.id_formulir = f.id_formulir
            JOIN users u ON f.id_user = u.id_user
            JOIN registrasi_peserta_didik rpd ON f.id_formulir = rpd.id_formulir
            JOIN jurusan j ON rpd.jurusan = j.id_jurusan
            WHERE j.nama_jurusan = ?
            ORDER BY s.tanggal_pemberian ASC
        `;
        const [rows] = await db.execute(query, [jurusan]);
        return rows;
    }

    static async getTodayByJurusan(jurusan) {
        const query = `
            SELECT s.*, 
                   u.nama_lengkap as nama_cpdb,
                   u.jenis_kelamin,
                   j.jurusan,
                   f.no_formulir as nomor_formulir
            FROM seragam s
            JOIN pembayaran_pendaftaran pp ON s.id_pembayaran = pp.id_pembayaran
            JOIN formulir f ON pp.id_formulir = f.id_formulir
            JOIN users u ON f.id_user = u.id_user
            JOIN registrasi_peserta_didik rpd ON f.id_formulir = rpd.id_formulir
            JOIN jurusan j ON rpd.jurusan = j.id_jurusan
            WHERE DATE(s.tanggal_pemberian) = CURDATE()
              AND j.jurusan = ?
            ORDER BY s.tanggal_pemberian ASC
        `;
        const [rows] = await db.execute(query, [jurusan]);
        return rows;
    }
}

module.exports = Seragam;
