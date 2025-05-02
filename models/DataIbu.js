const db = require('../config/database');

class DataIbu {
  static async create(data) {
    try {
      const [result] = await db.execute(
        `INSERT INTO data_ibu (
          id_formulir, nama_ibu, nik_ibu, tempat_lahir_ibu, 
          tanggal_lahir_ibu, nomor_telepon_ibu, pendidikan_terakhir_ibu,
          pekerjaan_ibu, penghasilan_perbulan_ibu, berkebutuhan_khusus_ibu
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.id_formulir,
          data.nama_ibu,
          data.nik_ibu,
          data.tempat_lahir_ibu,
          data.tanggal_lahir_ibu,
          data.nomor_telepon_ibu,
          data.pendidikan_terakhir_ibu,
          data.pekerjaan_ibu,
          data.penghasilan_perbulan_ibu,
          data.berkebutuhan_khusus_ibu
        ]
      );

      return result.insertId;
    } catch (error) {
      console.error('Error in DataIbu.create:', error);
      throw error;
    }
  }

  static async findByFormulirId(id_formulir) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM data_ibu WHERE id_formulir = ?',
        [id_formulir]
      );
      return rows[0];
    } catch (error) {
      console.error('Error in DataIbu.findByFormulirId:', error);
      throw error;
    }
  }

  static async update(id_formulir, data) {
    try {
      const [result] = await db.execute(
        `UPDATE data_ibu SET
          nama_ibu = ?,
          nik_ibu = ?,
          tempat_lahir_ibu = ?,
          tanggal_lahir_ibu = ?,
          nomor_telepon_ibu = ?,
          pendidikan_terakhir_ibu = ?,
          pekerjaan_ibu = ?,
          penghasilan_perbulan_ibu = ?,
          berkebutuhan_khusus_ibu = ?
        WHERE id_formulir = ?`,
        [
          data.nama_ibu,
          data.nik_ibu,
          data.tempat_lahir_ibu,
          data.tanggal_lahir_ibu,
          data.nomor_telepon_ibu,
          data.pendidikan_terakhir_ibu,
          data.pekerjaan_ibu,
          data.penghasilan_perbulan_ibu,
          data.berkebutuhan_khusus_ibu,
          id_formulir
        ]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in DataIbu.update:', error);
      throw error;
    }
  }
}

module.exports = DataIbu;
