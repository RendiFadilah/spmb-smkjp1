const db = require('../config/database');

class RegistrasiPesertaDidik {
  static async create(data) {
    try {
      // Start a transaction
      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        // Insert registrasi peserta didik data
        const [result] = await connection.execute(
          `INSERT INTO registrasi_peserta_didik (
            id_formulir, jurusan, jenis_pendaftaran, 
            tanggal_masuk_sekolah, asal_sekolah, 
            nomor_peserta_ujian, no_seri_ijazah, no_seri_skhus
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.id_formulir,
            data.jurusan,
            data.jenis_pendaftaran,
            data.tanggal_masuk_sekolah,
            data.asal_sekolah,
            data.nomor_peserta_ujian,
            data.no_seri_ijazah,
            data.no_seri_skhus
          ]
        );

        // Update formulir status
        await connection.execute(
          'UPDATE formulir SET status_formulir = "Sudah Lengkap" WHERE id_formulir = ?',
          [data.id_formulir]
        );

        // Commit the transaction
        await connection.commit();
        connection.release();

        return result.insertId;
      } catch (error) {
        // If error, rollback changes
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      console.error('Error in RegistrasiPesertaDidik.create:', error);
      throw error;
    }
  }

  static async findByFormulirId(id_formulir) {
    try {
      const query = `
        SELECT 
          r.*,
          j.jurusan as nama_jurusan,
          f.status_formulir,
          f.id_user
        FROM registrasi_peserta_didik r
        INNER JOIN formulir f ON r.id_formulir = f.id_formulir
        INNER JOIN jurusan j ON r.jurusan = j.id_jurusan
        WHERE r.id_formulir = ?
      `;
      const [rows] = await db.execute(query, [id_formulir]);
      console.log('Registration data:', rows[0]); // Debug log
      return rows[0];
    } catch (error) {
      console.error('Error in RegistrasiPesertaDidik.findByFormulirId:', error);
      throw error;
    }
  }

  static async update(id_formulir, data) {
    try {
      const [result] = await db.execute(
        `UPDATE registrasi_peserta_didik SET
          jurusan = ?,
          jenis_pendaftaran = ?,
          tanggal_masuk_sekolah = ?,
          asal_sekolah = ?,
          nomor_peserta_ujian = ?,
          no_seri_ijazah = ?,
          no_seri_skhus = ?
        WHERE id_formulir = ?`,
        [
          data.jurusan,
          data.jenis_pendaftaran,
          data.tanggal_masuk_sekolah,
          data.asal_sekolah,
          data.nomor_peserta_ujian,
          data.no_seri_ijazah,
          data.no_seri_skhus,
          id_formulir
        ]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in RegistrasiPesertaDidik.update:', error);
      throw error;
    }
  }

  static async getAllJurusan() {
    try {
      const [rows] = await db.execute('SELECT id_jurusan, jurusan, kode, kapasitas, sisa_kapasitas FROM jurusan');
      return rows;
    } catch (error) {
      console.error('Error in RegistrasiPesertaDidik.getAllJurusan:', error);
      throw error;
    }
  }
}

module.exports = RegistrasiPesertaDidik;
