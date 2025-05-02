const db = require('../config/database');

class Berkas {
    static async create({ id_formulir, nama_file }) {
        const query = 'INSERT INTO berkas (id_formulir, nama_file) VALUES (?, ?)';
        const [result] = await db.execute(query, [id_formulir, nama_file]);
        return result.insertId;
    }

    static async update({ id_berkas, nama_file }) {
        const query = 'UPDATE berkas SET nama_file = ? WHERE id_berkas = ?';
        const [result] = await db.execute(query, [nama_file, id_berkas]);
        return result.affectedRows > 0;
    }

    static async delete(id_berkas) {
        const query = 'DELETE FROM berkas WHERE id_berkas = ?';
        const [result] = await db.execute(query, [id_berkas]);
        return result.affectedRows > 0;
    }

    static async findByFormulirId(id_formulir) {
        const query = 'SELECT * FROM berkas WHERE id_formulir = ?';
        const [rows] = await db.execute(query, [id_formulir]);
        return rows[0];
    }

    static async findById(id_berkas) {
        const query = 'SELECT * FROM berkas WHERE id_berkas = ?';
        const [rows] = await db.execute(query, [id_berkas]);
        return rows[0];
    }
}

module.exports = Berkas;
