const db = require('../config/database');
const PeriodeMasterBiaya = require('./PeriodeMasterBiaya');

class PeriodePendaftaran {
    static async getAll() {
        const query = `
            SELECT pp.*, GROUP_CONCAT(j.jurusan) as jurusan_list
            FROM periode_pendaftaran pp
            LEFT JOIN periode_master_biaya pmb ON pp.id_periode = pmb.id_periode
            LEFT JOIN master_biaya_jurusan mbj ON pmb.id_biaya = mbj.id_biaya
            LEFT JOIN jurusan j ON mbj.id_jurusan = j.id_jurusan
            GROUP BY pp.id_periode
            ORDER BY pp.urutan_periode ASC
        `;
        const [rows] = await db.execute(query);
        
        // Get master biaya details for each periode
        for (let periode of rows) {
            periode.master_biaya = await PeriodeMasterBiaya.getByPeriodeId(periode.id_periode);
        }
        
        return rows;
    }

    static async getById(id) {
        const query = `
            SELECT pp.*
            FROM periode_pendaftaran pp
            WHERE pp.id_periode = ?
        `;
        const [rows] = await db.execute(query, [id]);
        if (rows.length === 0) return null;

        const periode = rows[0];
        periode.master_biaya = await PeriodeMasterBiaya.getByPeriodeId(id);
        return periode;
    }

    static async create(data) {
        const { nama_periode, urutan_periode, tanggal_mulai, tanggal_selesai, status, id_biaya_array } = data;
        
        const query = `
            INSERT INTO periode_pendaftaran (
                nama_periode,
                urutan_periode,
                tanggal_mulai,
                tanggal_selesai,
                status
            ) VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [
            nama_periode,
            urutan_periode,
            tanggal_mulai,
            tanggal_selesai,
            status || 'inactive'
        ]);

        const periodeId = result.insertId;

        // Create periode master biaya relations
        if (id_biaya_array) {
            // Convert comma-separated string to array if needed
            const biayaArray = Array.isArray(id_biaya_array) ? 
                             id_biaya_array : 
                             id_biaya_array.split(',').map(id => parseInt(id));
                             
            if (biayaArray.length > 0) {
                await PeriodeMasterBiaya.create(periodeId, biayaArray);
            }
        }

        return periodeId;
    }

    static async update(id, data) {
        const { nama_periode, urutan_periode, tanggal_mulai, tanggal_selesai, status, id_biaya_array } = data;
        
        const query = `
            UPDATE periode_pendaftaran 
            SET nama_periode = ?,
                urutan_periode = ?,
                tanggal_mulai = ?,
                tanggal_selesai = ?,
                status = ?
            WHERE id_periode = ?
        `;

        const [result] = await db.execute(query, [
            nama_periode,
            urutan_periode,
            tanggal_mulai,
            tanggal_selesai,
            status,
            id
        ]);

        // Update periode master biaya relations
        if (id_biaya_array) {
            // Convert comma-separated string to array if needed
            const biayaArray = Array.isArray(id_biaya_array) ? 
                             id_biaya_array : 
                             id_biaya_array.split(',').map(id => parseInt(id));
                             
            if (biayaArray.length > 0) {
                await PeriodeMasterBiaya.update(id, biayaArray);
            }
        }

        return result.affectedRows > 0;
    }

    static async delete(id) {
        // periode_master_biaya akan terhapus otomatis karena ON DELETE CASCADE
        const query = 'DELETE FROM periode_pendaftaran WHERE id_periode = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }

    static async updateStatus(id, status) {
        // Jika status active, nonaktifkan semua periode lain terlebih dahulu
        if (status === 'active') {
            await db.execute('UPDATE periode_pendaftaran SET status = "inactive"');
        }

        const query = 'UPDATE periode_pendaftaran SET status = ? WHERE id_periode = ?';
        const [result] = await db.execute(query, [status, id]);
        return result.affectedRows > 0;
    }

    static async getActive() {
        const query = `
            SELECT pp.*
            FROM periode_pendaftaran pp
            WHERE pp.status = 'active'
            LIMIT 1
        `;
        const [rows] = await db.execute(query);
        if (rows.length === 0) return null;

        const periode = rows[0];
        periode.master_biaya = await PeriodeMasterBiaya.getByPeriodeId(periode.id_periode);
        return periode;
    }
}

module.exports = PeriodePendaftaran;
