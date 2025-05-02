const express = require('express');
const router = express.Router();
const RegistrasiPesertaDidik = require('../../../models/RegistrasiPesertaDidik');
const auth = require('../../../middleware/auth');
const db = require('../../../config/database');

// Create or update registrasi peserta didik
router.post('/', async function(req, res) {
  try {
    const {
      jurusan, jenis_pendaftaran, tanggal_masuk_sekolah,
      asal_sekolah, nomor_peserta_ujian, no_seri_ijazah,
      no_seri_skhus
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

    // Check if registrasi peserta didik already exists for this formulir
    const existingData = await RegistrasiPesertaDidik.findByFormulirId(formulir.id_formulir);

    let result;
    if (existingData) {
      // Update existing data
      result = await RegistrasiPesertaDidik.update(formulir.id_formulir, {
        jurusan,
        jenis_pendaftaran,
        tanggal_masuk_sekolah,
        asal_sekolah,
        nomor_peserta_ujian,
        no_seri_ijazah,
        no_seri_skhus
      });

      if (!result) {
        throw new Error('Gagal memperbarui data registrasi');
      }
    } else {
      // Create new data
      result = await RegistrasiPesertaDidik.create({
        id_formulir: formulir.id_formulir,
        jurusan,
        jenis_pendaftaran,
        tanggal_masuk_sekolah,
        asal_sekolah,
        nomor_peserta_ujian,
        no_seri_ijazah,
        no_seri_skhus
      });
    }

    res.json({
      success: true,
      message: 'Data registrasi berhasil disimpan',
      data: result
    });
  } catch (error) {
    console.error('Error in registrasi creation:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan saat menyimpan data registrasi',
      error: error.message 
    });
  }
});

// Get registrasi peserta didik data
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
    const registrasiData = await RegistrasiPesertaDidik.findByFormulirId(formulir.id_formulir);

    if (!registrasiData) {
      return res.status(404).json({
        success: false,
        message: 'Data registrasi tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: registrasiData
    });
  } catch (error) {
    console.error('Error in fetching registrasi data:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan saat mengambil data registrasi',
      error: error.message 
    });
  }
});

// Get all jurusan
router.get('/jurusan', async function(req, res) {
  try {
    const jurusan = await RegistrasiPesertaDidik.getAllJurusan();
    res.json({
      success: true,
      data: jurusan
    });
  } catch (error) {
    console.error('Error in fetching jurusan:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan saat mengambil data jurusan',
      error: error.message 
    });
  }
});

module.exports = router;
