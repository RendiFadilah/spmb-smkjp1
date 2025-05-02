const express = require('express');
const router = express.Router();
const DataAyah = require('../../../models/DataAyah');
const auth = require('../../../middleware/auth');
const db = require('../../../config/database');

// Create or update data ayah
router.post('/', async function(req, res) {
  try {
    const {
      nama_ayah, nik_ayah, tempat_lahir_ayah, tanggal_lahir_ayah,
      nomor_telepon_ayah, pendidikan_terakhir, pekerjaan_ayah,
      penghasilan_perbulan_ayah, berkebutuhan_khusus_ayah
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

    // Check if data ayah already exists for this formulir
    const existingData = await DataAyah.findByFormulirId(formulir.id_formulir);

    let result;
    if (existingData) {
      // Update existing data
      result = await DataAyah.update(formulir.id_formulir, {
        nama_ayah,
        nik_ayah,
        tempat_lahir_ayah,
        tanggal_lahir_ayah,
        nomor_telepon_ayah,
        pendidikan_terakhir,
        pekerjaan_ayah,
        penghasilan_perbulan_ayah,
        berkebutuhan_khusus_ayah
      });

      if (!result) {
        throw new Error('Gagal memperbarui data ayah');
      }
    } else {
      // Create new data
      result = await DataAyah.create({
        id_formulir: formulir.id_formulir,
        nama_ayah,
        nik_ayah,
        tempat_lahir_ayah,
        tanggal_lahir_ayah,
        nomor_telepon_ayah,
        pendidikan_terakhir,
        pekerjaan_ayah,
        penghasilan_perbulan_ayah,
        berkebutuhan_khusus_ayah
      });
    }

    res.json({
      success: true,
      message: 'Data ayah berhasil disimpan',
      data: result
    });
  } catch (error) {
    console.error('Error in data ayah creation:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan saat menyimpan data ayah',
      error: error.message 
    });
  }
});

// Get data ayah
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
    const dataAyah = await DataAyah.findByFormulirId(formulir.id_formulir);

    if (!dataAyah) {
      return res.status(404).json({
        success: false,
        message: 'Data ayah tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: dataAyah
    });
  } catch (error) {
    console.error('Error in fetching data ayah:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan saat mengambil data ayah',
      error: error.message 
    });
  }
});

module.exports = router;
