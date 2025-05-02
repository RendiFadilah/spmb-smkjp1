const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findByWhatsApp(nomor_whatsapp) {
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE nomor_whatsapp = ?', [nomor_whatsapp]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByNIK(nik) {
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE nik = ?', [nik]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByNIKOrWhatsApp(identifier) {
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE nik = ? OR nomor_whatsapp = ?', [identifier, identifier]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(userData) {
    const { 
      nama_lengkap, 
      nomor_whatsapp,
      nik,
      nisn, 
      asal_smp, 
      jenis_kelamin, 
      password
    } = userData;

    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const roles = 'CPDB'; // Default role for new registrations
      const status_wawancara = 'Belum'; // Default status
      const tanggal_daftar = new Date().toISOString().slice(0, 19).replace('T', ' '); // Current timestamp

      const [result] = await db.execute(
        'INSERT INTO users (nama_lengkap, nomor_whatsapp, nik, nisn, asal_smp, jenis_kelamin, password, roles, tanggal_daftar, status_wawancara) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nama_lengkap, nomor_whatsapp, nik, nisn, asal_smp, jenis_kelamin, hashedPassword, roles, tanggal_daftar, status_wawancara]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async validatePassword(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE id_user = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(userId, userData) {
    try {
      const { nama_lengkap, nomor_whatsapp, nik, nisn, asal_smp, jenis_kelamin } = userData;
      const [result] = await db.execute(
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async updatePassword(userId, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const [result] = await db.execute(
        'UPDATE users SET password = ? WHERE id_user = ?',
        [hashedPassword, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
