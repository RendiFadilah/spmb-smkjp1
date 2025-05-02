const express = require('express');
const router = express.Router();
const DataIbu = require('../../../models/DataIbu');
const auth = require('../../../middleware/auth');
const db = require('../../../config/database');

// Create or update data ibu
router.post('/', async function(req, res) {
  try {
    const {
      nama_ibu, nik_ibu, tempat_lahir_ibu, tanggal_lahir_ibu,
      nomor_telepon_ibu, pendidikan_terakhir_ibu, pekerjaan_ibu,
      penghasilan_perbulan_ibu, berkebutuhan_khusus_ibu
    } = req.body;

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

    // Check if data ibu already exists for this formulir
    const existingData = await DataIbu.findByFormulirId(formulir.id_formulir);

    let result;
    if (existingData) {
      // Update existing data
      result = await DataIbu.update(formulir.id_formulir, {
        nama_ibu,
        nik_ibu,
        tempat_lahir_ibu,
        tanggal_lahir_ibu,
        nomor_telepon_ibu,
        pendidikan_terakhir_ibu,
        pekerjaan_ibu,
        penghasilan_perbulan_ibu,
        berkebutuhan_khusus_ibu
      });

      if (!result) {
        throw new Error('Gagal memperbarui data ibu');
      }
    } else {
      // Create new data
      result = await DataIbu.create({
        id_formulir: formulir.id_formulir,
        nama_ibu,
        nik_ibu,
        tempat_lahir_ibu,
        tanggal_lahir_ibu,
        nomor_telepon_ibu,
        pendidikan_terakhir_ibu,
        pekerjaan_ibu,
        penghasilan_perbulan_ibu,
        berkebutuhan_khusus_ibu
      });
    }

    res.json({
      success: true,
      message: 'Data ibu berhasil disimpan',
      data: result
    });
  } catch (error) {
    console.error('Error in data ibu creation:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan saat menyimpan data ibu',
      error: error.message 
    });
  }
});

// Get data ibu
router.get('/', async function(req, res) {
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
    const dataIbu = await DataIbu.findByFormulirId(formulir.id_formulir);

    if (!dataIbu) {
      return res.status(404).json({
        success: false,
        message: 'Data ibu tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: dataIbu
    });
  } catch (error) {
    console.error('Error in fetching data ibu:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan saat mengambil data ibu',
      error: error.message 
    });
  }
});

module.exports = router;
