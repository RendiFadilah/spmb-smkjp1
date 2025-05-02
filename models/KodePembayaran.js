const db = require('../config/database');
const ExcelJS = require('exceljs');

class KodePembayaran {
    static async getAll() {
        const query = `
            SELECT * 
            FROM kode_pembayaran
            ORDER BY id_kode_pembayaran DESC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async getById(id) {
        const query = `
            SELECT * 
            FROM kode_pembayaran 
            WHERE id_kode_pembayaran = ?
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async create(data) {
        const query = `
            INSERT INTO kode_pembayaran (
                kode_bayar,
                status
            ) VALUES (?, ?)
        `;
        const [result] = await db.execute(query, [
            data.kode_bayar,
            'Belum Terpakai'
        ]);
        return result.insertId;
    }

    static async update(id, data) {
        const query = `
            UPDATE kode_pembayaran 
            SET kode_bayar = ?,
                status = ?
            WHERE id_kode_pembayaran = ?
        `;
        const [result] = await db.execute(query, [
            data.kode_bayar,
            data.status,
            id
        ]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const query = 'DELETE FROM kode_pembayaran WHERE id_kode_pembayaran = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }

    static async getStats() {
        const query = `
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Belum Terpakai' THEN 1 ELSE 0 END) as belum_terpakai,
                SUM(CASE WHEN status = 'Sudah Terpakai' THEN 1 ELSE 0 END) as sudah_terpakai
            FROM kode_pembayaran
        `;
        const [rows] = await db.execute(query);
        return rows[0];
    }

    static async importFromExcel(filePath) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        
        const worksheet = workbook.getWorksheet(1);
        const kodeList = [];
        
        // Validate headers
        const expectedHeaders = ['No', 'Kode Bayar', 'Status'];
        const headers = worksheet.getRow(1).values.slice(1); // slice(1) to remove undefined at index 0
        
        if (!headers.every((header, index) => header === expectedHeaders[index])) {
            throw new Error('Format Excel tidak sesuai. Gunakan template yang disediakan.');
        }
        
        let rowNumber = 1;
        worksheet.eachRow((row, rowIndex) => {
            // Skip header row
            if (rowIndex > 1) {
                rowNumber = rowIndex;
                const kodeBayar = row.getCell(2).text.trim(); // Column B: Kode Bayar
                const status = row.getCell(3).text.trim();    // Column C: Status
                
                // Validate data
                if (!kodeBayar) {
                    throw new Error(`Kode Bayar kosong pada baris ${rowNumber}`);
                }
                
                if (status !== 'Sudah Terpakai' && status !== 'Belum Terpakai') {
                    throw new Error(`Status tidak valid pada baris ${rowNumber}. Status harus 'Sudah Terpakai' atau 'Belum Terpakai'`);
                }
                
                kodeList.push({
                    kode_bayar: kodeBayar,
                    status: status || 'Belum Terpakai' // Default to 'Belum Terpakai' if status is empty
                });
            }
        });

        if (kodeList.length === 0) {
            throw new Error('File Excel tidak memiliki data untuk diimpor');
        }

        // Insert kode bayar in batches
        const batchSize = 100;
        for (let i = 0; i < kodeList.length; i += batchSize) {
            const batch = kodeList.slice(i, i + batchSize);
            const values = batch.map(kode => 
                `('${kode.kode_bayar}', '${kode.status}')`
            ).join(',');
            
            const query = `
                INSERT INTO kode_pembayaran (kode_bayar, status)
                VALUES ${values}
            `;
            
            await db.execute(query);
        }

        return kodeList.length;
    }
}

module.exports = KodePembayaran;
