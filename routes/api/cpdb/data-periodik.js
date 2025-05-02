const express = require('express');
const router = express.Router();
const DataPeriodik = require('../../../models/DataPeriodik');
const auth = require('../../../middleware/auth');
const db = require('../../../config/database');

// Create or update data periodik
router.post('/', async function(req, res) {
  try {
    // Convert empty strings to null
    const data = {
      tinggi_badan: req.body.tinggi_badan || null,
      berat_badan: req.body.berat_badan || null,
      jarak_tempuh_ke_sekolah: req.body.jarak_tempuh_ke_sekolah || null,
      waktu_tempuh_ke_sekolah: req.body.waktu_tempuh_ke_sekolah || null,
      jumlah_saudara_kandung: req.body.jumlah_saudara_kandung || null
    };

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

    // Check if data periodik already exists for this formulir
    const existingData = await DataPeriodik.findByFormulirId(formulir.id_formulir);

    let result;
    if (existingData) {
      // Update existing data
      result = await DataPeriodik.update(formulir.id_formulir, data);

      if (!result) {
        throw new Error('Gagal memperbarui data periodik');
      }
    } else {
      // Create new data
      result = await DataPeriodik.create({
        id_formulir: formulir.id_formulir,
        ...data
      });
    }

    res.json({
      success: true,
      message: 'Data periodik berhasil disimpan',
      data: result
    });
  } catch (error) {
    console.error('Error in data periodik creation:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan saat menyimpan data periodik',
      error: error.message 
    });
  }
});

// Get data periodik
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
    const dataPeriodik = await DataPeriodik.findByFormulirId(formulir.id_formulir);

    // Return empty success if no data found
    res.json({
      success: true,
      data: dataPeriodik || null
    });
  } catch (error) {
    console.error('Error in fetching data periodik:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan saat mengambil data periodik',
      error: error.message 
    });
  }
});

module.exports = router;
