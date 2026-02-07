const db = require('../config/database');

class Jurusan {
    static async getAll() {
        const query = 'SELECT *, kapasitas, sisa_kapasitas FROM jurusan ORDER BY id_jurusan ASC';
        const [rows] = await db.execute(query);
        return rows;
    }

    static async getById(id) {
        const query = 'SELECT *, kapasitas, sisa_kapasitas FROM jurusan WHERE id_jurusan = ?';
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async create(data) {
        const query = `
            INSERT INTO jurusan (jurusan, kode, kapasitas, sisa_kapasitas) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [
            data.jurusan,
            data.kode,
            data.kapasitas,
            data.kapasitas // Initially sisa_kapasitas equals kapasitas
        ]);
        return result.insertId;
    }

    static async update(id, data) {
        const query = `
            UPDATE jurusan 
            SET jurusan = ?, 
                kode = ?,
                kapasitas = ?,
                sisa_kapasitas = ?
            WHERE id_jurusan = ?
        `;
        const [result] = await db.execute(query, [
            data.jurusan,
            data.kode,
            data.kapasitas,
            data.sisa_kapasitas != null ? data.sisa_kapasitas : data.kapasitas,
            id
        ]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const query = 'DELETE FROM jurusan WHERE id_jurusan = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Jurusan;
