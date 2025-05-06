const db = require('../config/database');

class PeriodeMasterBiaya {
    static async create(id_periode, id_biaya_array) {
        try {
            // Validate inputs
            if (!id_periode || !Array.isArray(id_biaya_array) || id_biaya_array.length === 0) {
                throw new Error('Invalid input parameters');
            }

            const query = `
                INSERT INTO periode_master_biaya (id_periode, id_biaya)
                VALUES ?
            `;
            
            // Filter out any invalid values and ensure all values are integers
            const values = id_biaya_array
                .filter(id => id) // Remove falsy values
                .map(id_biaya => [
                    parseInt(id_periode), 
                    parseInt(id_biaya)
                ])
                .filter(([periode_id, biaya_id]) => 
                    !isNaN(periode_id) && !isNaN(biaya_id)
                );

            if (values.length === 0) {
                throw new Error('No valid biaya IDs provided');
            }
            
            const [result] = await db.query(query, [values]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in PeriodeMasterBiaya.create:', error);
            throw error;
        }
    }

    static async getByPeriodeId(id_periode) {
        const query = `
            SELECT pmb.*, mbj.tahun_ajaran, j.jurusan as nama_jurusan, j.id_jurusan, j.kode as kode_jurusan,
                   mbj.total_biaya, mbj.minimal_pembayaran
            FROM periode_master_biaya pmb
            JOIN master_biaya_jurusan mbj ON pmb.id_biaya = mbj.id_biaya
            JOIN jurusan j ON mbj.id_jurusan = j.id_jurusan
            WHERE pmb.id_periode = ?
        `;
        const [rows] = await db.execute(query, [id_periode]);
        return rows;
    }

    static async deleteByPeriodeId(id_periode) {
        const query = 'DELETE FROM periode_master_biaya WHERE id_periode = ?';
        const [result] = await db.execute(query, [id_periode]);
        return result.affectedRows > 0;
    }

    static async update(id_periode, id_biaya_array) {
        try {
            // Hapus data lama
            await this.deleteByPeriodeId(parseInt(id_periode));
            
            // Insert data baru jika array tidak kosong
            if (Array.isArray(id_biaya_array) && id_biaya_array.length > 0) {
                return await this.create(id_periode, id_biaya_array);
            }
            return true;
        } catch (error) {
            console.error('Error in PeriodeMasterBiaya.update:', error);
            throw error;
        }
    }
}

module.exports = PeriodeMasterBiaya;
