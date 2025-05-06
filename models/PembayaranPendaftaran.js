const db = require('../config/database');

class PembayaranPendaftaran {
    static async findByFormulir(idFormulir) {
        const query = `
            SELECT p.*, k.keterangan as keterangan_biaya,
                   k.total_biaya as master_biaya,
                   COALESCE(dp.nominal_diskon, 0) as nominal_diskon
            FROM pembayaran_pendaftaran p
            LEFT JOIN master_biaya_jurusan k ON p.id_jurusan = k.id_jurusan
            LEFT JOIN periode_pendaftaran pp ON p.id_periode_daftar = pp.id_periode
            LEFT JOIN diskon_periode dp ON (dp.id_periode = pp.id_periode AND dp.id_jurusan = p.id_jurusan)
            WHERE p.id_formulir = ?
        `;
        const [rows] = await db.query(query, [idFormulir]);
        return rows[0];
    }

    static async create(data) {
        try {
            // Get active period
            const [activePeriod] = await db.query(
                'SELECT id_periode FROM periode_pendaftaran WHERE status = "active" LIMIT 1'
            );
            
            if (!activePeriod[0]) {
                throw new Error('No active registration period found');
            }

            // Get master biaya for the jurusan
            const [masterBiaya] = await db.query(
                'SELECT total_biaya FROM master_biaya_jurusan WHERE id_jurusan = ? ORDER BY created_at DESC LIMIT 1',
                [data.id_jurusan]
            );

            if (!masterBiaya[0]) {
                throw new Error('Master biaya not found for the specified jurusan');
            }

            // Get discount if available
            const [discount] = await db.query(
                'SELECT nominal_diskon FROM diskon_periode WHERE id_periode = ? AND id_jurusan = ?',
                [activePeriod[0].id_periode, data.id_jurusan]
            );

            // Calculate total biaya with discount
            const baseBiaya = parseFloat(masterBiaya[0].total_biaya);
            const discountAmount = discount[0] ? parseFloat(discount[0].nominal_diskon) : 0;
            const totalBiaya = Math.max(0, baseBiaya - discountAmount);

            // Calculate initial sisa pembayaran
            const nominal = parseFloat(data.nominal_pembayaran) || 0;
            const sisaPembayaran = Math.max(0, totalBiaya - nominal);

            const query = `
                INSERT INTO pembayaran_pendaftaran 
                (id_formulir, id_jurusan, id_periode_daftar, total_biaya, sisa_pembayaran, status_pelunasan)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            const [result] = await db.query(query, [
                data.id_formulir,
                data.id_jurusan,
                activePeriod[0].id_periode,
                totalBiaya,
                sisaPembayaran,
                'BELUM_LUNAS'
            ]);

            return result.insertId;
        } catch (error) {
            console.error('Error in PembayaranPendaftaran.create:', error);
            throw error;
        }
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
