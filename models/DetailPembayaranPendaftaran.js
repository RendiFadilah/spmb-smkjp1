const db = require('../config/database');
const moment = require('moment-timezone');
require('moment/locale/id');
moment.locale('id'); // Set default locale to Indonesian

class DetailPembayaranPendaftaran {
    static async create(data, connection = db) {
        try {
            // Validate required fields
            if (!data.id_pembayaran || !data.tanggal_pembayaran || !data.metode_pembayaran || !data.nominal_pembayaran) {
                throw new Error('Missing required fields for payment detail');
            }

            // Validate payment method
            if (!['TUNAI', 'TRANSFER'].includes(data.metode_pembayaran)) {
                throw new Error('Invalid payment method');
            }

            // Convert tanggal_pembayaran to Asia/Jakarta timezone before saving
            const jakartaDate = moment(data.tanggal_pembayaran).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
            
            const query = `
                INSERT INTO detail_pembayaran_pendaftaran 
                (id_pembayaran, tanggal_pembayaran, metode_pembayaran, nama_pengirim, 
                nominal_pembayaran, bukti_pembayaran, status_verifikasi, nama_verifikator)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const [result] = await connection.query(query, [
                data.id_pembayaran,
                jakartaDate,
                data.metode_pembayaran,
                data.nama_pengirim || null,
                data.nominal_pembayaran,
                data.bukti_pembayaran || null,
                data.status_verifikasi || 'PENDING',
                data.nama_verifikator || null
            ]);

            // Log payment detail creation
            console.log('Payment detail created:', {
                id_detail: result.insertId,
                id_pembayaran: data.id_pembayaran,
                metode: data.metode_pembayaran,
                nominal: data.nominal_pembayaran,
                status: 'PENDING'
            });

            return result.insertId;
        } catch (error) {
            console.error('Error creating payment detail:', error);
            throw error;
        }
    }

    static async findByPembayaran(idPembayaran) {
        try {
            const query = `
                SELECT 
                    d.*
                FROM detail_pembayaran_pendaftaran d
                WHERE d.id_pembayaran = ?
                ORDER BY d.created_at DESC
            `;
            const [rows] = await db.query(query, [idPembayaran]);
            
            // Format dates using moment-timezone with Indonesian format
            
            return rows.map(row => ({
                ...row,
                formatted_date: moment(row.tanggal_pembayaran).tz('Asia/Jakarta').format('DD MMMM YYYY, HH:mm [WIB]'),
                created_date: moment(row.created_at).tz('Asia/Jakarta').format('DD MMMM YYYY, HH:mm [WIB]'),
                updated_date: moment(row.updated_at).tz('Asia/Jakarta').format('DD MMMM YYYY, HH:mm [WIB]')
            }));
        } catch (error) {
            console.error('Error finding payment details:', error);
            throw error;
        }
    }

    static async updateVerifikasi(idDetail, data) {
        try {
            // Validate status
            if (!['PENDING', 'VERIFIED', 'REJECTED'].includes(data.status_verifikasi)) {
                throw new Error('Invalid verification status');
            }

            // Validate verifikator name for VERIFIED/REJECTED status
            if (['VERIFIED', 'REJECTED'].includes(data.status_verifikasi) && !data.nama_verifikator) {
                throw new Error('Verifikator name is required for verification');
            }

            const query = `
                UPDATE detail_pembayaran_pendaftaran 
                SET status_verifikasi = ?, 
                    nama_verifikator = ?,
                    catatan_verifikasi = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id_detail = ?
            `;
            
            await db.query(query, [
                data.status_verifikasi,
                data.nama_verifikator || null,
                data.catatan_verifikasi || null,
                idDetail
            ]);

            // Log verification update
            console.log('Payment verification updated:', {
                id_detail: idDetail,
                status: data.status_verifikasi,
                verifikator: data.nama_verifikator,
                timestamp: new Date()
            });

        } catch (error) {
            console.error('Error updating verification:', error);
            throw error;
        }
    }

    static async getTotalVerifiedPayment(idPembayaran) {
        try {
            const query = `
                SELECT 
                    COUNT(*) as total_payments,
                    SUM(CASE WHEN status_verifikasi = 'VERIFIED' THEN nominal_pembayaran ELSE 0 END) as total_verified,
                    SUM(CASE WHEN status_verifikasi = 'PENDING' THEN nominal_pembayaran ELSE 0 END) as total_pending,
                    SUM(CASE WHEN status_verifikasi = 'REJECTED' THEN nominal_pembayaran ELSE 0 END) as total_rejected
                FROM detail_pembayaran_pendaftaran
                WHERE id_pembayaran = ?
            `;
            const [result] = await db.query(query, [idPembayaran]);
            
            return {
                total_verified: result[0].total_verified || 0,
                total_pending: result[0].total_pending || 0,
                total_rejected: result[0].total_rejected || 0,
                total_payments: result[0].total_payments || 0
            };
        } catch (error) {
            console.error('Error getting payment totals:', error);
            throw error;
        }
    }
}

module.exports = DetailPembayaranPendaftaran;
