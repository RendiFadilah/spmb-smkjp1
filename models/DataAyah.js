const db = require('../config/database');

class DataAyah {
  static async create(data) {
    try {
      const [result] = await db.execute(
        `INSERT INTO data_ayah (
          id_formulir, nama_ayah, nik_ayah, tempat_lahir_ayah, 
          tanggal_lahir_ayah, nomor_telepon_ayah, pendidikan_terakhir,
          pekerjaan_ayah, penghasilan_perbulan_ayah, berkebutuhan_khusus_ayah
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.id_formulir,
          data.nama_ayah,
          data.nik_ayah,
          data.tempat_lahir_ayah,
          data.tanggal_lahir_ayah,
          data.nomor_telepon_ayah,
          data.pendidikan_terakhir,
          data.pekerjaan_ayah,
          data.penghasilan_perbulan_ayah,
          data.berkebutuhan_khusus_ayah
        ]
      );

      return result.insertId;
    } catch (error) {
      console.error('Error in DataAyah.create:', error);
      throw error;
    }
  }

  static async findByFormulirId(id_formulir) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM data_ayah WHERE id_formulir = ?',
        [id_formulir]
      );
      return rows[0];
    } catch (error) {
      console.error('Error in DataAyah.findByFormulirId:', error);
      throw error;
    }
  }

  static async update(id_formulir, data) {
    try {
      const [result] = await db.execute(
        `UPDATE data_ayah SET
          nama_ayah = ?,
          nik_ayah = ?,
          tempat_lahir_ayah = ?,
          tanggal_lahir_ayah = ?,
          nomor_telepon_ayah = ?,
          pendidikan_terakhir = ?,
          pekerjaan_ayah = ?,
          penghasilan_perbulan_ayah = ?,
          berkebutuhan_khusus_ayah = ?
        WHERE id_formulir = ?`,
        [
          data.nama_ayah,
          data.nik_ayah,
          data.tempat_lahir_ayah,
          data.tanggal_lahir_ayah,
          data.nomor_telepon_ayah,
          data.pendidikan_terakhir,
          data.pekerjaan_ayah,
          data.penghasilan_perbulan_ayah,
          data.berkebutuhan_khusus_ayah,
          id_formulir
        ]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in DataAyah.update:', error);
      throw error;
    }
  }
}

module.exports = DataAyah;
