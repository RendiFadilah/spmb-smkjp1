const db = require('../config/database');

class DataPeriodik {
  static async create(data) {
    try {
      const [result] = await db.execute(
        `INSERT INTO data_periodik (
          id_formulir, tinggi_badan, berat_badan, 
          jarak_tempuh_ke_sekolah, waktu_tempuh_ke_sekolah, jumlah_saudara_kandung
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          data.id_formulir,
          data.tinggi_badan,
          data.berat_badan,
          data.jarak_tempuh_ke_sekolah,
          data.waktu_tempuh_ke_sekolah,
          data.jumlah_saudara_kandung
        ]
      );

      return result.insertId;
    } catch (error) {
      console.error('Error in DataPeriodik.create:', error);
      throw error;
    }
  }

  static async findByFormulirId(id_formulir) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM data_periodik WHERE id_formulir = ?',
        [id_formulir]
      );
      return rows[0];
    } catch (error) {
      console.error('Error in DataPeriodik.findByFormulirId:', error);
      throw error;
    }
  }

  static async update(id_formulir, data) {
    try {
      const [result] = await db.execute(
        `UPDATE data_periodik SET
          tinggi_badan = ?,
          berat_badan = ?,
          jarak_tempuh_ke_sekolah = ?,
          waktu_tempuh_ke_sekolah = ?,
          jumlah_saudara_kandung = ?
        WHERE id_formulir = ?`,
        [
          data.tinggi_badan,
          data.berat_badan,
          data.jarak_tempuh_ke_sekolah,
          data.waktu_tempuh_ke_sekolah,
          data.jumlah_saudara_kandung,
          id_formulir
        ]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in DataPeriodik.update:', error);
      throw error;
    }
  }
}

module.exports = DataPeriodik;
