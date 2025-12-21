const db = require('../config/database');

class MasterBiayaJurusan {
    static async getAll() {
        const query = `
            SELECT mbj.*, j.jurusan as nama_jurusan 
            FROM master_biaya_jurusan mbj
            JOIN jurusan j ON mbj.id_jurusan = j.id_jurusan
            ORDER BY mbj.id_biaya DESC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async getById(id) {
        const query = `
            SELECT mbj.*, j.jurusan as nama_jurusan 
            FROM master_biaya_jurusan mbj
            JOIN jurusan j ON mbj.id_jurusan = j.id_jurusan
            WHERE mbj.id_biaya = ?
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async create(data) {
        const query = `
            INSERT INTO master_biaya_jurusan (
                id_jurusan,
                tahun_ajaran,
                total_biaya,
                minimal_pembayaran,
                keterangan
            ) VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [
            data.id_jurusan,
            data.tahun_ajaran,
            data.total_biaya,
            data.minimal_pembayaran,
            data.keterangan
        ]);

        return result.insertId;
    }

    static async update(id, data) {
        const query = `
            UPDATE master_biaya_jurusan 
            SET id_jurusan = ?,
                tahun_ajaran = ?,
                total_biaya = ?,
                minimal_pembayaran = ?,
                keterangan = ?
            WHERE id_biaya = ?
        `;

        const [result] = await db.execute(query, [
            data.id_jurusan,
            data.tahun_ajaran,
            data.total_biaya,
            data.minimal_pembayaran,
            data.keterangan,
            id
        ]);

        return result.affectedRows > 0;
    }

    static async delete(id) {
        const query = 'DELETE FROM master_biaya_jurusan WHERE id_biaya = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }

    static async getJurusan() {
        const query = 'SELECT id_jurusan, jurusan as nama_jurusan FROM jurusan';
        const [rows] = await db.execute(query);
        return rows;
    }

    static async getBiayaByPeriodeAndJurusan(idJurusan) {
        const query = `
            SELECT mbj.* 
            FROM master_biaya_jurusan mbj
            INNER JOIN periode_master_biaya pmb ON mbj.id_biaya = pmb.id_biaya
            INNER JOIN periode_pendaftaran pp ON pmb.id_periode = pp.id_periode
            WHERE mbj.id_jurusan = ? 
            AND pp.status = 'active'
            ORDER BY mbj.created_at DESC
            LIMIT 1
        `;
        const [rows] = await db.execute(query, [idJurusan]);
        return rows[0];
    }
}

module.exports = MasterBiayaJurusan;
