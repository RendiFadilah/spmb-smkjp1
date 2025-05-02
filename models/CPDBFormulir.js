const db = require('../config/database');
const moment = require('moment-timezone');

class CPDBFormulir {
    static async getAvailablePaymentCodes() {
        let connection;
        try {
            connection = await db.getConnection();
            const query = `
                SELECT id_kode_pembayaran, kode_bayar 
                FROM kode_pembayaran 
                WHERE status = 'Belum Terpakai'
                FOR UPDATE
            `;
            const [rows] = await connection.execute(query);
            return rows;
        } catch (error) {
            console.error('Error in getAvailablePaymentCodes:', error);
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    static async getNextFormNumber(connection) {
        const query = 'SELECT MAX(no_formulir) as max_number FROM formulir FOR UPDATE';
        const [rows] = await connection.execute(query);
        const maxNumber = rows[0].max_number || 100; // Start from 100 if no records
        return maxNumber + 1;
    }

    static async create(data) {
        let connection;
        try {
            console.log('Creating formulir with data:', data);
            
            if (!data.id_kode_pembayaran) {
                throw new Error('ID kode pembayaran harus diisi');
            }

            if (!data.id_user) {
                throw new Error('ID user harus diisi');
            }

            // Get connection from pool
            connection = await db.getConnection();

            // Check if user already has a formulir
            const [existing] = await connection.execute(
                'SELECT id_formulir FROM formulir WHERE id_user = ?',
                [data.id_user]
            );

            if (existing.length > 0) {
                throw new Error('Anda sudah memiliki formulir pendaftaran');
            }

            // Begin transaction
            await connection.beginTransaction();

            const jakartaTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
            console.log('Jakarta time:', jakartaTime);
            
            const nextFormNumber = await this.getNextFormNumber(connection);
            console.log('Next form number:', nextFormNumber);
            
            const query = `
                INSERT INTO formulir (
                    id_user, 
                    id_kode_pembayaran, 
                    tanggal, 
                    no_formulir, 
                    nominal_formulir, 
                    bukti_bayar,
                    status,
                    verifikator
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                data.id_user,
                data.id_kode_pembayaran,
                jakartaTime,
                nextFormNumber,
                data.nominal_formulir,
                data.bukti_bayar || null,
                data.status || 'Proses',
                data.verifikator || null
            ];

            const [result] = await connection.execute(query, values);
            
            if (!result.insertId) {
                throw new Error('Gagal menyimpan data formulir');
            }

            // Update kode pembayaran status
            await connection.execute(
                'UPDATE kode_pembayaran SET status = "Sudah Terpakai" WHERE id_kode_pembayaran = ?',
                [data.id_kode_pembayaran]
            );

            // Commit transaction
            await connection.commit();
            
            return result.insertId;
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            console.error('Error in CPDBFormulir.create:', error);
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }
}

module.exports = CPDBFormulir;
