const express = require('express');
const router = express.Router();
const Seragam = require('../../../models/Seragam');
const { isAuthenticated, isAdmin } = require('../../../middleware/auth');
const ExcelJS = require('exceljs');

// Apply auth middlewares
router.use(isAuthenticated);
router.use(isAdmin);

// Get today's seragam data with optional jurusan filter
router.get('/today', async (req, res) => {
    try {
        const { jurusan } = req.query;
        let seragam;
        if (jurusan) {
            seragam = await Seragam.getTodayByJurusan(jurusan);
        } else {
            seragam = await Seragam.getToday();
        }
        res.json(seragam);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data seragam' });
    }
});

// Get all seragam data with optional jurusan filter
router.get('/', async (req, res) => {
    try {
        const { jurusan } = req.query;
        let seragam;
        if (jurusan) {
            seragam = await Seragam.getAllByJurusan(jurusan);
        } else {
            seragam = await Seragam.getAll();
        }
        res.json(seragam);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data seragam' });
    }
});

// Get available payments (CPDB who haven't received uniforms)
router.get('/data/available-payments', async (req, res) => {
    try {
        const payments = await Seragam.getAvailablePayments();
        res.json(payments);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data pembayaran' });
    }
});

// Get seragam by ID
router.get('/:id', async (req, res) => {
    try {
        const seragam = await Seragam.getById(req.params.id);
        if (!seragam) {
            return res.status(404).json({ message: 'Data seragam tidak ditemukan' });
        }
        res.json(seragam);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data seragam' });
    }
});

// Create new seragam data
router.post('/', async (req, res) => {
    try {
        const data = {
            ...req.body,
            nama_petugas: req.user.nama // Get from logged in user
        };
        
        const id = await Seragam.create(data);
        const seragam = await Seragam.getById(id);
        res.status(201).json(seragam);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat membuat data seragam' });
    }
});

// Update seragam data with partial update support
router.put('/:id', async (req, res) => {
    try {
        // Fetch existing data
        const existing = await Seragam.getById(req.params.id);
        if (!existing) {
            return res.status(404).json({ message: 'Data seragam tidak ditemukan' });
        }

        // Merge existing data with incoming data
        const data = {
            tanggal_pemberian: req.body.tanggal_pemberian ?? existing.tanggal_pemberian,
            seragam_batik: req.body.seragam_batik ?? existing.seragam_batik,
            seragam_olahraga: req.body.seragam_olahraga ?? existing.seragam_olahraga,
            seragam_muslim: req.body.seragam_muslim ?? existing.seragam_muslim,
            al_quran: req.body.al_quran ?? existing.al_quran,
            tempat_makan: req.body.tempat_makan ?? existing.tempat_makan,
            kartu_pelajar: req.body.kartu_pelajar ?? existing.kartu_pelajar,
            gesper: req.body.gesper ?? existing.gesper,
            kerudung: req.body.kerudung ?? existing.kerudung,
            nama_petugas: req.user.nama
        };

        const success = await Seragam.update(req.params.id, data);
        if (!success) {
            return res.status(404).json({ message: 'Data seragam tidak ditemukan' });
        }

        const seragam = await Seragam.getById(req.params.id);
        res.json(seragam);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui data seragam' });
    }
});

// Update seragam status
router.put('/:id/status', async (req, res) => {
    try {
        const { field, status } = req.body;
        const success = await Seragam.updateStatus(req.params.id, field, status);
        if (!success) {
            return res.status(404).json({ message: 'Data seragam tidak ditemukan' });
        }
        res.json({ message: 'Status berhasil diperbarui' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui status' });
    }
});

// Delete seragam data
router.delete('/:id', async (req, res) => {
    try {
        const success = await Seragam.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Data seragam tidak ditemukan' });
        }
        res.json({ message: 'Data seragam berhasil dihapus' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus data seragam' });
    }
});

// Export all seragam to Excel
router.get('/export/all', async (req, res) => {
    try {
        const seragam = await Seragam.getAll();
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Laporan Seragam');

        // Set worksheet properties
        worksheet.properties.defaultRowHeight = 30;

        // Add title rows
        const titles = [
            'Laporan Pemberian Seragam',
            'PPDB SMK Jakarta Pusat 1',
            'Tahun 2025/2026'
        ];

        titles.forEach((title, index) => {
            const rowNum = index + 1;
            worksheet.mergeCells(`A${rowNum}:M${rowNum}`);
            const titleRow = worksheet.getRow(rowNum);
            titleRow.height = 30;
            
            const cell = worksheet.getCell(`A${rowNum}`);
            cell.value = title;
            cell.font = { bold: true, size: 16 };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE2F0D9' }
            };
        });

        // Add headers
        const headers = [
            'Tanggal Pemberian',
            'Nama CPDB',
            'Jurusan',
            'Gender',
            'Seragam Batik',
            'Seragam Olahraga',
            'Seragam Muslim',
            'Al-Quran',
            'Tempat Makan',
            'Kartu Pelajar',
            'Gesper',
            'Kerudung',
            'Nama Petugas'
        ];

        const headerRow = worksheet.addRow(headers);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4472C4' }
        };
        headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

        // Add data
        seragam.forEach(item => {
            const row = worksheet.addRow([
                new Date(item.tanggal_pemberian).toLocaleDateString('id-ID'),
                item.nama_cpdb,
                item.jurusan,
                item.jenis_kelamin,
                item.seragam_batik,
                item.seragam_olahraga,
                item.seragam_muslim,
                item.al_quran,
                item.tempat_makan,
                item.kartu_pelajar,
                item.gesper,
                item.kerudung,
                item.nama_petugas
            ]);

            // Apply conditional formatting for status columns (Al-Quran, Tempat Makan, Kartu Pelajar, Gesper, Kerudung)
            const statusColumns = [8, 9, 10, 11, 12]; // Column indices for status fields
            statusColumns.forEach(colIndex => {
                const cell = row.getCell(colIndex);
                const status = cell.value;
                
                if (status === 'Sudah') {
                    cell.value = '✓';
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF90EE90' }
                    };
                } else {
                    cell.value = '×';
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFF9999' }
                    };
                }
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });

            // Format seragam size columns (Batik, Olahraga, Muslim)
            const sizeColumns = [5, 6, 7]; // Column indices for size fields
            sizeColumns.forEach(colIndex => {
                const cell = row.getCell(colIndex);
                if (cell.value === 'Belum') {
                    cell.value = '×';
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFF9999' }
                    };
                }
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
        });

        // Auto-fit columns
        worksheet.columns.forEach(column => {
            column.width = 15;
            column.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Laporan_Seragam_PPDB.xlsx');

        // Write to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengekspor data' });
    }
});

// Export today's seragam to Excel
router.get('/export/today', async (req, res) => {
    try {
        const seragam = await Seragam.getToday();
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Laporan Seragam Hari Ini');

        // Set worksheet properties
        worksheet.properties.defaultRowHeight = 30;

        // Get formatted date
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = today.toLocaleDateString('id-ID', options);

        // Add title rows
        const titles = [
            'Laporan Pemberian Seragam',
            'PPDB SMK Jakarta Pusat 1',
            'Tahun 2025/2026',
            formattedDate
        ];

        titles.forEach((title, index) => {
            const rowNum = index + 1;
            worksheet.mergeCells(`A${rowNum}:M${rowNum}`);
            const titleRow = worksheet.getRow(rowNum);
            titleRow.height = 30;
            
            const cell = worksheet.getCell(`A${rowNum}`);
            cell.value = title;
            cell.font = { bold: true, size: 16 };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE2F0D9' }
            };
        });

        // Add headers
        const headers = [
            'Tanggal Pemberian',
            'Nama CPDB',
            'Jurusan',
            'Gender',
            'Seragam Batik',
            'Seragam Olahraga',
            'Seragam Muslim',
            'Al-Quran',
            'Tempat Makan', 
            'Kartu Pelajar',
            'Gesper',
            'Kerudung',
            'Nama Petugas'
        ];

        const headerRow = worksheet.addRow(headers);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4472C4' }
        };
        headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

        // Add data
        seragam.forEach(item => {
            const row = worksheet.addRow([
                new Date(item.tanggal_pemberian).toLocaleDateString('id-ID'),
                item.nama_cpdb,
                item.jurusan,
                item.jenis_kelamin,
                item.seragam_batik,
                item.seragam_olahraga,
                item.seragam_muslim,
                item.al_quran,
                item.tempat_makan,
                item.kartu_pelajar,
                item.gesper,
                item.kerudung,
                item.nama_petugas
            ]);

            // Apply conditional formatting for status columns (Al-Quran, Tempat Makan, Kartu Pelajar, Gesper, Kerudung)
            const statusColumns = [8, 9, 10, 11, 12]; // Column indices for status fields
            statusColumns.forEach(colIndex => {
                const cell = row.getCell(colIndex);
                const status = cell.value;
                
                if (status === 'Sudah') {
                    cell.value = '✓';
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF90EE90' }
                    };
                } else {
                    cell.value = '×';
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFF9999' }
                    };
                }
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });

            // Format seragam size columns (Batik, Olahraga, Muslim)
            const sizeColumns = [5, 6, 7]; // Column indices for size fields
            sizeColumns.forEach(colIndex => {
                const cell = row.getCell(colIndex);
                if (cell.value === 'Belum') {
                    cell.value = '×';
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFF9999' }
                    };
                }
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
        });

        // Auto-fit columns
        worksheet.columns.forEach(column => {
            column.width = 15;
            column.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Laporan_Seragam_PPDB_Harian.xlsx');

        // Write to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengekspor data' });
    }
});

module.exports = router;
