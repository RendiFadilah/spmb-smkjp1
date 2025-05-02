const db = require('../config/database');

class PembayaranPendaftaran {
    static async findByFormulir(idFormulir) {
        const query = `
            SELECT p.*, k.keterangan as keterangan_biaya
            FROM pembayaran_pendaftaran p
            LEFT JOIN master_biaya_jurusan k ON p.id_jurusan = k.id_jurusan
            WHERE p.id_formulir = ?
        `;
        const [rows] = await db.query(query, [idFormulir]);
        return rows[0];
    }

    static async create(data) {
        const totalBiaya = 3000000; // Default total_biaya
        const nominal = parseFloat(data.nominal_pembayaran) || 0;
        const sisaPembayaran = Math.max(0, totalBiaya - nominal);

        const query = `
            INSERT INTO pembayaran_pendaftaran 
            (id_formulir, id_jurusan, total_biaya, sisa_pembayaran, status_pelunasan)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [
            data.id_formulir,
            data.id_jurusan,
            totalBiaya,
            sisaPembayaran, // Calculate sisa_pembayaran based on nominal_pembayaran
            'BELUM_LUNAS' // Initial status
        ]);
        return result.insertId;
    }

    static async updateSisaPembayaran(idPembayaran) {
        try {
            // Get total_biaya and sum of VERIFIED nominal_pembayaran
            const query = `
                SELECT 
                    p.total_biaya,
                    COALESCE(SUM(CASE WHEN d.status_verifikasi = 'VERIFIED' THEN d.nominal_pembayaran ELSE 0 END), 0) as total_pembayaran_verified,
                    COALESCE(SUM(CASE WHEN d.status_verifikasi = 'PENDING' THEN d.nominal_pembayaran ELSE 0 END), 0) as total_pembayaran_pending
                FROM pembayaran_pendaftaran p
                LEFT JOIN detail_pembayaran_pendaftaran d ON p.id_pembayaran = d.id_pembayaran
                WHERE p.id_pembayaran = ?
                GROUP BY p.id_pembayaran, p.total_biaya
            `;
            const [rows] = await db.query(query, [idPembayaran]);
            
            if (rows.length === 0) {
                const error = new Error('Payment record not found');
                error.code = 'PAYMENT_NOT_FOUND';
                throw error;
            }

            const { total_biaya, total_pembayaran_verified, total_pembayaran_pending } = rows[0];
            
            // Ensure all values are properly parsed as numbers
            const parsedTotalBiaya = parseFloat(total_biaya) || 0;
            const parsedVerified = parseFloat(total_pembayaran_verified) || 0;
            const parsedPending = parseFloat(total_pembayaran_pending) || 0;
            
            // Calculate sisa_pembayaran considering both VERIFIED and PENDING payments
            const total_all_payments = parsedVerified + parsedPending;
            const sisa_pembayaran = Math.max(0, parsedTotalBiaya - total_all_payments);
            
            // Status pelunasan still only considers VERIFIED payments
            const status_pelunasan = (parsedTotalBiaya - parsedVerified) <= 0 ? 'LUNAS' : 'BELUM_LUNAS';

            // Update sisa_pembayaran and status
            const updateQuery = `
                UPDATE pembayaran_pendaftaran 
                SET sisa_pembayaran = ?,
                    status_pelunasan = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id_pembayaran = ?
            `;
            await db.query(updateQuery, [sisa_pembayaran, status_pelunasan, idPembayaran]);

            // Log payment status update with parsed values
            console.log('Payment status updated:', {
                id_pembayaran: idPembayaran,
                total_biaya: parsedTotalBiaya,
                total_pembayaran_verified: parsedVerified,
                total_pembayaran_pending: parsedPending,
                total_all_payments,
                sisa_pembayaran,
                status_pelunasan
            });

        } catch (error) {
            console.error('Error updating sisa pembayaran:', {
                id_pembayaran: idPembayaran,
                error: error.message,
                code: error.code
            });
            throw error;
        }
    }

}

module.exports = PembayaranPendaftaran;
