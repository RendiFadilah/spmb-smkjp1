const db = require('../config/database');

class DataPribadi {
  static async create(data) {
    try {
      const [result] = await db.execute(
        `INSERT INTO data_pribadi (
          id_formulir, nama_lengkap, jenis_kelamin, nisn, nik, 
          tempat_lahir, tanggal_lahir, no_registrasi_akta_lahir, 
          agama, kewarganegaraan, berkebutuhan_khusus, alamat_jalan, 
          rt, rw, nama_dusun, nama_kelurahan, kecamatan, kode_pos, 
          nomor_telepon, email, mode_transportasi, nomor_kks, anak_keberapa
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.id_formulir,
          data.nama_lengkap,
          data.jenis_kelamin,
          data.nisn,
          data.nik,
          data.tempat_lahir,
          data.tanggal_lahir,
          data.no_registrasi_akta_lahir,
          data.agama,
          data.kewarganegaraan,
          data.berkebutuhan_khusus,
          data.alamat_jalan,
          data.rt,
          data.rw,
          data.nama_dusun,
          data.nama_kelurahan,
          data.kecamatan,
          data.kode_pos,
          data.nomor_telepon,
          data.email,
          data.mode_transportasi,
          data.nomor_kks,
          data.anak_keberapa
        ]
      );

      return result.insertId;
    } catch (error) {
      console.error('Error in DataPribadi.create:', error);
      throw error;
    }
  }

  static async findByFormulirId(id_formulir) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM data_pribadi WHERE id_formulir = ?',
        [id_formulir]
      );
      return rows[0];
    } catch (error) {
      console.error('Error in DataPribadi.findByFormulirId:', error);
      throw error;
    }
  }

  static async update(id_formulir, data) {
    try {
      const [result] = await db.execute(
        `UPDATE data_pribadi SET
          nama_lengkap = ?,
          jenis_kelamin = ?,
          nisn = ?,
          nik = ?,
          tempat_lahir = ?,
          tanggal_lahir = ?,
          no_registrasi_akta_lahir = ?,
          agama = ?,
          kewarganegaraan = ?,
          berkebutuhan_khusus = ?,
          alamat_jalan = ?,
          rt = ?,
          rw = ?,
          nama_dusun = ?,
          nama_kelurahan = ?,
          kecamatan = ?,
          kode_pos = ?,
          nomor_telepon = ?,
          email = ?,
          mode_transportasi = ?,
          nomor_kks = ?,
          anak_keberapa = ?
        WHERE id_formulir = ?`,
        [
          data.nama_lengkap,
          data.jenis_kelamin,
          data.nisn,
          data.nik,
          data.tempat_lahir,
          data.tanggal_lahir,
          data.no_registrasi_akta_lahir,
          data.agama,
          data.kewarganegaraan,
          data.berkebutuhan_khusus,
          data.alamat_jalan,
          data.rt,
          data.rw,
          data.nama_dusun,
          data.nama_kelurahan,
          data.kecamatan,
          data.kode_pos,
          data.nomor_telepon,
          data.email,
          data.mode_transportasi,
          data.nomor_kks,
          data.anak_keberapa,
          id_formulir
        ]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in DataPribadi.update:', error);
      throw error;
    }
  }
}

module.exports = DataPribadi;
