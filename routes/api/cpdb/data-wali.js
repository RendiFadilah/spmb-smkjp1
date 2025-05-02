const express = require('express');
const router = express.Router();
const DataWali = require('../../../models/DataWali');
const { isAuthenticated } = require('../../../middleware/auth');
const db = require('../../../config/database');

router.post('/', isAuthenticated, async (req, res) => {
  try {
    // Get active formulir for the user
    const [rows] = await db.execute(
      'SELECT id_formulir FROM formulir WHERE id_user = ? AND status = "Terverifikasi" ORDER BY id_formulir DESC LIMIT 1',
      [req.user.id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Formulir aktif tidak ditemukan' 
      });
    }

    const formulir = rows[0];

    // Convert empty strings to null
    const data = {
      id_formulir: formulir.id_formulir,
      nama_wali: req.body.nama_wali || null,
      nik_wali: req.body.nik_wali || null,
      tempat_lahir_wali: req.body.tempat_lahir_wali || null,
      tanggal_lahir_wali: req.body.tanggal_lahir_wali || null,
      nomor_telepon_wali: req.body.nomor_telepon_wali || null,
      pendidikan_terakhir_wali: req.body.pendidikan_terakhir_wali || null,
      pekerjaan_wali: req.body.pekerjaan_wali || null,
      penghasilan_perbulan_wali: req.body.penghasilan_perbulan_wali || null
    };

    const dataWali = await DataWali.findByFormulirId(formulir.id_formulir);

    if (dataWali) {
      // Update existing data
      await DataWali.update(formulir.id_formulir, data);
      res.json({
        success: true,
        message: 'Data wali berhasil diperbarui'
      });
    } else {
      // Create new data
      await DataWali.create(data);
      res.json({
        success: true,
        message: 'Data wali berhasil disimpan'
      });
    }
  } catch (error) {
    console.error('Error saving data wali:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menyimpan data wali',
      error: error.message
    });
  }
});

router.get('/', isAuthenticated, async (req, res) => {
  try {
    // Get active formulir for the user
    const [rows] = await db.execute(
      'SELECT id_formulir FROM formulir WHERE id_user = ? AND status = "Terverifikasi" ORDER BY id_formulir DESC LIMIT 1',
      [req.user.id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Formulir aktif tidak ditemukan' 
      });
    }

    const formulir = rows[0];
    const dataWali = await DataWali.findByFormulirId(formulir.id_formulir);

    res.json({
      success: true,
      data: dataWali
    });
  } catch (error) {
    console.error('Error fetching data wali:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data wali',
      error: error.message
    });
  }
});

module.exports = router;
