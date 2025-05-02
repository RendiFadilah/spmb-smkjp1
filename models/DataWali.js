const db = require('../config/database');

class DataWali {
  static async create(data) {
    try {
      const [result] = await db.execute(
        `INSERT INTO data_wali (
          id_formulir, nama_wali, nik_wali, tempat_lahir_wali, 
          tanggal_lahir_wali, nomor_telepon_wali, pendidikan_terakhir_wali,
          pekerjaan_wali, penghasilan_perbulan_wali
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.id_formulir,
          data.nama_wali,
          data.nik_wali,
          data.tempat_lahir_wali,
          data.tanggal_lahir_wali,
          data.nomor_telepon_wali,
          data.pendidikan_terakhir_wali,
          data.pekerjaan_wali,
          data.penghasilan_perbulan_wali
        ]
      );

      return result.insertId;
    } catch (error) {
      console.error('Error in DataWali.create:', error);
      throw error;
    }
  }

  static async findByFormulirId(id_formulir) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM data_wali WHERE id_formulir = ?',
        [id_formulir]
      );
      return rows[0];
    } catch (error) {
      console.error('Error in DataWali.findByFormulirId:', error);
      throw error;
    }
  }

  static async update(id_formulir, data) {
    try {
      const [result] = await db.execute(
        `UPDATE data_wali SET
          nama_wali = ?,
          nik_wali = ?,
          tempat_lahir_wali = ?,
          tanggal_lahir_wali = ?,
          nomor_telepon_wali = ?,
          pendidikan_terakhir_wali = ?,
          pekerjaan_wali = ?,
          penghasilan_perbulan_wali = ?
        WHERE id_formulir = ?`,
        [
          data.nama_wali,
          data.nik_wali,
          data.tempat_lahir_wali,
          data.tanggal_lahir_wali,
          data.nomor_telepon_wali,
          data.pendidikan_terakhir_wali,
          data.pekerjaan_wali,
          data.penghasilan_perbulan_wali,
          id_formulir
        ]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in DataWali.update:', error);
      throw error;
    }
  }
}

module.exports = DataWali;
