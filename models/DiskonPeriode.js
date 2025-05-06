const db = require('../config/database');

class DiskonPeriode {
    static async getAll() {
        const query = `
            SELECT dp.*, 
                   pp.nama_periode,
                   j.jurusan as nama_jurusan,
                   j.kode as kode_jurusan
            FROM diskon_periode dp
            JOIN periode_pendaftaran pp ON dp.id_periode = pp.id_periode
            JOIN jurusan j ON dp.id_jurusan = j.id_jurusan
            ORDER BY pp.urutan_periode ASC, j.jurusan ASC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async getById(id) {
        const query = `
            SELECT dp.*, 
                   pp.nama_periode,
                   j.jurusan as nama_jurusan,
                   j.kode as kode_jurusan
            FROM diskon_periode dp
            JOIN periode_pendaftaran pp ON dp.id_periode = pp.id_periode
            JOIN jurusan j ON dp.id_jurusan = j.id_jurusan
            WHERE dp.id_diskon = ?
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async getByPeriodeId(periodeId) {
        const query = `
            SELECT dp.*, 
                   pp.nama_periode,
                   j.jurusan as nama_jurusan,
                   j.kode as kode_jurusan
            FROM diskon_periode dp
            JOIN periode_pendaftaran pp ON dp.id_periode = pp.id_periode
            JOIN jurusan j ON dp.id_jurusan = j.id_jurusan
            WHERE dp.id_periode = ?
            ORDER BY j.jurusan ASC
        `;
        const [rows] = await db.execute(query, [periodeId]);
        return rows;
    }

    // Get available jurusan for a period based on master_biaya_jurusan
    static async getAvailableJurusanByPeriodeId(periodeId) {
        const query = `
            SELECT DISTINCT j.id_jurusan, j.jurusan as nama_jurusan, j.kode as kode_jurusan
            FROM periode_master_biaya pmb
            JOIN master_biaya_jurusan mbj ON pmb.id_biaya = mbj.id_biaya
            JOIN jurusan j ON mbj.id_jurusan = j.id_jurusan
            WHERE pmb.id_periode = ?
            ORDER BY j.jurusan ASC
        `;
        const [rows] = await db.execute(query, [periodeId]);
        return rows;
    }

    static async create(data) {
        const query = `
            INSERT INTO diskon_periode (
                id_periode,
                id_jurusan,
                nominal_diskon
            ) VALUES (?, ?, ?)
        `;

        const [result] = await db.execute(query, [
            data.id_periode,
            data.id_jurusan,
            data.nominal_diskon
        ]);

        return result.insertId;
    }

    static async update(id, data) {
        const query = `
            UPDATE diskon_periode 
            SET id_periode = ?,
                id_jurusan = ?,
                nominal_diskon = ?
            WHERE id_diskon = ?
        `;

        const [result] = await db.execute(query, [
            data.id_periode,
            data.id_jurusan,
            data.nominal_diskon,
            id
        ]);

        return result.affectedRows > 0;
    }

    static async deleteByPeriodeId(periodeId) {
        const query = 'DELETE FROM diskon_periode WHERE id_periode = ?';
        const [result] = await db.execute(query, [periodeId]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const query = 'DELETE FROM diskon_periode WHERE id_diskon = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }

    static async getByPeriodeAndJurusan(periodeId, jurusanId) {
        const query = `
            SELECT dp.*, 
                   pp.nama_periode,
                   j.jurusan as nama_jurusan
            FROM diskon_periode dp
            JOIN periode_pendaftaran pp ON dp.id_periode = pp.id_periode
            JOIN jurusan j ON dp.id_jurusan = j.id_jurusan
            WHERE dp.id_periode = ? AND dp.id_jurusan = ?
        `;
        const [rows] = await db.execute(query, [periodeId, jurusanId]);
        return rows[0];
    }
}

module.exports = DiskonPeriode;
