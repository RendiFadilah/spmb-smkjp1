const express = require('express');
const router = express.Router();
const DataPribadi = require('../../../models/DataPribadi');
const auth = require('../../../middleware/auth');
const db = require('../../../config/database');

// Create or update data pribadi
router.post('/', async function(req, res) {
  try {
    const {
      nama_lengkap, jenis_kelamin, nisn, nik, tempat_lahir, tanggal_lahir,
      no_registrasi_akta_lahir, agama, kewarganegaraan, berkebutuhan_khusus,
      alamat_jalan, rt, rw, nama_dusun, nama_kelurahan, kecamatan, kode_pos,
      nomor_telepon, email, mode_transportasi, nomor_kks, anak_keberapa
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

    // Check if data pribadi already exists for this formulir
    const existingData = await DataPribadi.findByFormulirId(formulir.id_formulir);

    let result;
    if (existingData) {
      // Update existing data
      result = await DataPribadi.update(formulir.id_formulir, {
        nama_lengkap,
        jenis_kelamin,
        nisn,
        nik,
        tempat_lahir,
        tanggal_lahir,
        no_registrasi_akta_lahir,
        agama,
        kewarganegaraan,
        berkebutuhan_khusus,
        alamat_jalan,
        rt,
        rw,
        nama_dusun,
        nama_kelurahan,
        kecamatan,
        kode_pos,
        nomor_telepon,
        email,
        mode_transportasi,
        nomor_kks,
        anak_keberapa
      });

      if (!result) {
        throw new Error('Gagal memperbarui data pribadi');
      }
    } else {
      // Create new data
      result = await DataPribadi.create({
        id_formulir: formulir.id_formulir,
        nama_lengkap,
        jenis_kelamin,
        nisn,
        nik,
        tempat_lahir,
        tanggal_lahir,
        no_registrasi_akta_lahir,
        agama,
        kewarganegaraan,
        berkebutuhan_khusus,
        alamat_jalan,
        rt,
        rw,
        nama_dusun,
        nama_kelurahan,
        kecamatan,
        kode_pos,
        nomor_telepon,
        email,
        mode_transportasi,
        nomor_kks,
        anak_keberapa
      });
    }

    res.json({
      success: true,
      message: 'Data pribadi berhasil disimpan',
      data: result
    });
  } catch (error) {
    console.error('Error in data pribadi creation:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan saat menyimpan data pribadi',
      error: error.message 
    });
  }
});

// Get data pribadi
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
    const dataPribadi = await DataPribadi.findByFormulirId(formulir.id_formulir);

    if (!dataPribadi) {
      return res.status(404).json({
        success: false,
        message: 'Data pribadi tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: dataPribadi
    });
  } catch (error) {
    console.error('Error in fetching data pribadi:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pribadi',
      error: error.message 
    });
  }
});

module.exports = router;
