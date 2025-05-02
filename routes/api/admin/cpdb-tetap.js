const express = require('express');
const router = express.Router();
const CPDBTetap = require('../../../models/CPDBTetap');
const excel = require('exceljs');

// Get all CPDB Tetap
router.get('/', async (req, res) => {
    try {
        const cpdbList = await CPDBTetap.findAll();
        res.json(cpdbList);
    } catch (error) {
        console.error('Error fetching CPDB Tetap:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data CPDB Tetap' });
    }
});

// Get Jurusan Statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await CPDBTetap.getJurusanStats();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching jurusan stats:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil statistik jurusan' });
    }
});

// Export to Excel
router.get('/export', async (req, res) => {
    try {
        const data = await CPDBTetap.exportToExcel();
        
        // Create workbook and worksheet
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('CPDB Tetap');

        // Define columns
        worksheet.columns = [
            { header: 'Nama Lengkap', key: 'nama_lengkap', width: 30 },
            { header: 'NISN', key: 'nisn', width: 15 },
            { header: 'NIK', key: 'nik', width: 20 },
            { header: 'Asal SMP', key: 'asal_smp', width: 30 },
            { header: 'Nomor WhatsApp', key: 'nomor_whatsapp', width: 20 },
            { header: 'Jenis Kelamin', key: 'jenis_kelamin', width: 15 },
            { header: 'Jurusan', key: 'jurusan', width: 20 },
            { header: 'Kode Jurusan', key: 'kode', width: 15 },
            { header: 'Nominal Pembayaran', key: 'nominal_pembayaran', width: 15 },
            { header: 'Status Pelunasan', key: 'status_pelunasan', width: 20 },
            { header: 'Tanggal Daftar', key: 'tanggal_daftar', width: 15 },
            
            // Data Pribadi
            { header: 'Tempat Lahir', key: 'tempat_lahir', width: 20 },
            { header: 'Tanggal Lahir', key: 'tanggal_lahir', width: 15 },
            { header: 'No. Akta Lahir', key: 'no_registrasi_akta_lahir', width: 20 },
            { header: 'Agama', key: 'agama', width: 15 },
            { header: 'Kewarganegaraan', key: 'kewarganegaraan', width: 20 },
            { header: 'Berkebutuhan Khusus', key: 'berkebutuhan_khusus', width: 20 },
            { header: 'Alamat', key: 'alamat_jalan', width: 40 },
            { header: 'RT', key: 'rt', width: 10 },
            { header: 'RW', key: 'rw', width: 10 },
            { header: 'Dusun', key: 'nama_dusun', width: 20 },
            { header: 'Kelurahan', key: 'nama_kelurahan', width: 20 },
            { header: 'Kecamatan', key: 'kecamatan', width: 20 },
            { header: 'Kode Pos', key: 'kode_pos', width: 15 },
            { header: 'No. Telepon', key: 'nomor_telepon', width: 20 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Transportasi', key: 'mode_transportasi', width: 20 },
            { header: 'No. KKS', key: 'nomor_kks', width: 20 },
            { header: 'Anak Ke-', key: 'anak_keberapa', width: 10 },

            // Data Ayah
            { header: 'Nama Ayah', key: 'nama_ayah', width: 30 },
            { header: 'NIK Ayah', key: 'nik_ayah', width: 20 },
            { header: 'Tempat Lahir Ayah', key: 'tempat_lahir_ayah', width: 20 },
            { header: 'Tanggal Lahir Ayah', key: 'tanggal_lahir_ayah', width: 15 },
            { header: 'No. Telepon Ayah', key: 'nomor_telepon_ayah', width: 20 },
            { header: 'Pendidikan Ayah', key: 'pendidikan_ayah', width: 20 },
            { header: 'Pekerjaan Ayah', key: 'pekerjaan_ayah', width: 20 },
            { header: 'Penghasilan Ayah', key: 'penghasilan_perbulan_ayah', width: 25 },
            { header: 'Berkebutuhan Khusus Ayah', key: 'berkebutuhan_khusus_ayah', width: 25 },

            // Data Ibu
            { header: 'Nama Ibu', key: 'nama_ibu', width: 30 },
            { header: 'NIK Ibu', key: 'nik_ibu', width: 20 },
            { header: 'Tempat Lahir Ibu', key: 'tempat_lahir_ibu', width: 20 },
            { header: 'Tanggal Lahir Ibu', key: 'tanggal_lahir_ibu', width: 15 },
            { header: 'No. Telepon Ibu', key: 'nomor_telepon_ibu', width: 20 },
            { header: 'Pendidikan Ibu', key: 'pendidikan_terakhir_ibu', width: 20 },
            { header: 'Pekerjaan Ibu', key: 'pekerjaan_ibu', width: 20 },
            { header: 'Penghasilan Ibu', key: 'penghasilan_perbulan_ibu', width: 25 },
            { header: 'Berkebutuhan Khusus Ibu', key: 'berkebutuhan_khusus_ibu', width: 25 },

            // Data Wali
            { header: 'Nama Wali', key: 'nama_wali', width: 30 },
            { header: 'NIK Wali', key: 'nik_wali', width: 20 },
            { header: 'Tempat Lahir Wali', key: 'tempat_lahir_wali', width: 20 },
            { header: 'Tanggal Lahir Wali', key: 'tanggal_lahir_wali', width: 15 },
            { header: 'No. Telepon Wali', key: 'nomor_telepon_wali', width: 20 },
            { header: 'Pendidikan Wali', key: 'pendidikan_terakhir_wali', width: 20 },
            { header: 'Pekerjaan Wali', key: 'pekerjaan_wali', width: 20 },
            { header: 'Penghasilan Wali', key: 'penghasilan_perbulan_wali', width: 25 },

            // Data Periodik
            { header: 'Tinggi Badan', key: 'tinggi_badan', width: 15 },
            { header: 'Berat Badan', key: 'berat_badan', width: 15 },
            { header: 'Jarak ke Sekolah', key: 'jarak_tempuh_ke_sekolah', width: 20 },
            { header: 'Waktu Tempuh', key: 'waktu_tempuh_ke_sekolah', width: 20 },
            { header: 'Jumlah Saudara', key: 'jumlah_saudara_kandung', width: 15 },

            // Registrasi
            { header: 'Jenis Pendaftaran', key: 'jenis_pendaftaran', width: 20 },
            { header: 'Tanggal Masuk', key: 'tanggal_masuk_sekolah', width: 15 },
            { header: 'Asal Sekolah', key: 'asal_sekolah', width: 30 },
            { header: 'No. Peserta Ujian', key: 'nomor_peserta_ujian', width: 25 },
            { header: 'No. Ijazah', key: 'no_seri_ijazah', width: 20 },
            { header: 'No. SKHUS', key: 'no_seri_skhus', width: 20 }
        ];

        // Style the header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        // Add data rows
        worksheet.addRows(data);

        // Set response headers
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=CPDB-Tetap.xlsx'
        );

        // Write to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengekspor data' });
    }
});

module.exports = router;
