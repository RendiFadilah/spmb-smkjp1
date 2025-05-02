const db = require('../config/database');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');

class Petugas {
  static async findAll() {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE roles IN ("Petugas", "Bendahara") ORDER BY tanggal_daftar ASC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE id_user = ? AND roles IN ("Petugas", "Bendahara")',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByWhatsApp(nomor_whatsapp) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE nomor_whatsapp = ?',
        [nomor_whatsapp]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(data) {
    const { 
      nama_lengkap, 
      nomor_whatsapp, 
      password,
      jenis_kelamin,
      roles // 'Petugas' or 'Bendahara'
    } = data;

    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const tanggal_daftar = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

      // Ensure jenis_kelamin has a valid value
      if (!jenis_kelamin || !['Laki-laki', 'Perempuan'].includes(jenis_kelamin)) {
        throw new Error('Jenis kelamin harus dipilih (Laki-laki/Perempuan)');
      }

      // Log the values for debugging
      console.log('Creating petugas with values:', {
        nama_lengkap,
        nomor_whatsapp,
        jenis_kelamin,
        roles,
        tanggal_daftar
      });

      const [result] = await db.execute(
        `INSERT INTO users (
          nama_lengkap,
          nomor_whatsapp,
          nisn,
          asal_smp,
          jenis_kelamin,
          password,
          roles,
          tanggal_daftar,
          status_wawancara
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nama_lengkap,
          nomor_whatsapp,
          null, // nisn
          null, // asal_smp
          jenis_kelamin, // jenis_kelamin (now validated)
          hashedPassword,
          roles,
          tanggal_daftar,
          'Belum' // status_wawancara
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, data) {
    const { nama_lengkap, nomor_whatsapp, roles, jenis_kelamin } = data;
    try {
      const [result] = await db.execute(
        `UPDATE users 
         SET nama_lengkap = ?, 
             nomor_whatsapp = ?, 
             roles = ?,
             jenis_kelamin = ?
         WHERE id_user = ? 
         AND roles IN ("Petugas", "Bendahara")`,
        [nama_lengkap, nomor_whatsapp, roles, jenis_kelamin, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async updateWithPassword(id, data) {
    const { nama_lengkap, nomor_whatsapp, roles, jenis_kelamin, password } = data;
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const [result] = await db.execute(
        `UPDATE users 
         SET nama_lengkap = ?, 
             nomor_whatsapp = ?, 
             roles = ?,
             jenis_kelamin = ?,
             password = ? 
         WHERE id_user = ? 
         AND roles IN ("Petugas", "Bendahara")`,
        [nama_lengkap, nomor_whatsapp, roles, jenis_kelamin, hashedPassword, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM users WHERE id_user = ? AND roles IN ("Petugas", "Bendahara")',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Utility method to validate if a user is a staff member
  static async isStaff(id) {
    try {
      const [rows] = await db.execute(
        'SELECT COUNT(*) as count FROM users WHERE id_user = ? AND roles IN ("Petugas", "Bendahara")',
        [id]
      );
      return rows[0].count > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Petugas;
