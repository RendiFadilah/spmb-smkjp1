const db = require('../config/database');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');

class CPDBAwal {
  static async findAll() {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE roles = "CPDB" ORDER BY tanggal_daftar ASC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE id_user = ? AND roles = "CPDB"',
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

  static async findByNISN(nisn) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE nisn = ?',
        [nisn]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByNIK(nik) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE nik = ?',
        [nik]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static generateInitials(nama_lengkap) {
    // Split nama_lengkap into words
    const words = nama_lengkap.split(' ');
    // Get first letter of each word and join them
    return words.map(word => word[0].toUpperCase()).join('');
  }

  static formatId(id) {
    // Add leading zero if id < 100
    return id < 100 ? `0${id}` : `${id}`;
  }

  static generatePassword(nama_lengkap, id) {
    const initials = this.generateInitials(nama_lengkap);
    const formattedId = id < 100 ? `0${id}` : `${id}`;
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
    return `${initials}${formattedId}${randomNum}`;
  }

  static async create(data) {
    const { 
      nama_lengkap, 
      nomor_whatsapp,
      nisn,
      nik,
      asal_smp,
      jenis_kelamin
    } = data;

    try {
      const tanggal_daftar = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

      // Ensure jenis_kelamin has a valid value
      if (!jenis_kelamin || !['Laki-laki', 'Perempuan'].includes(jenis_kelamin)) {
        throw new Error('Jenis kelamin harus dipilih (Laki-laki/Perempuan)');
      }

      // Get the current maximum id_user
      const [maxIdResult] = await db.execute('SELECT MAX(id_user) as maxId FROM users');
      const nextId = (maxIdResult[0].maxId || 0) + 1;

      // Generate password using the calculated next id
      const generatedPassword = this.generatePassword(nama_lengkap, nextId);
      const hashedPassword = await bcrypt.hash(generatedPassword, 12);

      // Log the values for debugging
      console.log('Creating CPDB with values:', {
        nama_lengkap,
        nomor_whatsapp,
        nisn,
        nik,
        asal_smp,
        jenis_kelamin,
        tanggal_daftar,
        raw_password: generatedPassword
      });

      // Insert user with password included
      const [result] = await db.execute(
        `INSERT INTO users (
          nama_lengkap,
          nomor_whatsapp,
          nisn,
          nik,
          asal_smp,
          jenis_kelamin,
          roles,
          tanggal_daftar,
          status_wawancara,
          password,
          raw_password
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nama_lengkap,
          nomor_whatsapp,
          nisn,
          nik,
          asal_smp,
          jenis_kelamin,
          'CPDB',
          tanggal_daftar,
          'Belum',
          hashedPassword,
          generatedPassword
        ]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status_wawancara) {
    try {
      const [result] = await db.execute(
        `UPDATE users 
         SET status_wawancara = ?
         WHERE id_user = ? 
         AND roles = "CPDB"`,
        [status_wawancara, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, data) {
    const { 
      nama_lengkap, 
      nomor_whatsapp, 
      nisn,
      nik,
      asal_smp,
      jenis_kelamin,
      status_wawancara 
    } = data;
    try {
      const [result] = await db.execute(
        `UPDATE users 
         SET nama_lengkap = ?, 
             nomor_whatsapp = ?, 
             nisn = ?,
             nik = ?,
             asal_smp = ?,
             jenis_kelamin = ?,
             status_wawancara = ?
         WHERE id_user = ? 
         AND roles = "CPDB"`,
        [nama_lengkap, nomor_whatsapp, nisn, nik, asal_smp, jenis_kelamin, status_wawancara, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async updateWithPassword(id, data) {
    const { 
      nama_lengkap, 
      nomor_whatsapp, 
      nisn,
      nik,
      asal_smp,
      jenis_kelamin,
      status_wawancara
    } = data;
    try {
      // Generate new password with random 4-digit number
      const generatedPassword = this.generatePassword(nama_lengkap, id);
      const hashedPassword = await bcrypt.hash(generatedPassword, 12);

      // Log the generated password for debugging
      console.log('Updating user with new password:', {
        id,
        nama_lengkap,
        raw_password: generatedPassword
      });

      const [result] = await db.execute(
        `UPDATE users 
         SET nama_lengkap = ?, 
             nomor_whatsapp = ?, 
             nisn = ?,
             nik = ?,
             asal_smp = ?,
             jenis_kelamin = ?,
             status_wawancara = ?,
             password = ?,
             raw_password = ?
         WHERE id_user = ? 
         AND roles = "CPDB"`,
        [nama_lengkap, nomor_whatsapp, nisn, nik, asal_smp, jenis_kelamin, status_wawancara, hashedPassword, generatedPassword, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM users WHERE id_user = ? AND roles = "CPDB"',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getStatusWawancaraStats() {
    try {
      const [rows] = await db.execute(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status_wawancara = 'Sudah' THEN 1 ELSE 0 END) as sudah_wawancara,
          SUM(CASE WHEN status_wawancara = 'Belum' THEN 1 ELSE 0 END) as belum_wawancara
        FROM users 
        WHERE roles = "CPDB"`
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CPDBAwal;
