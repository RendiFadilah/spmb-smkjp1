    const express = require('express');
const router = express.Router();
const Formulir = require('../../../models/Formulir');
const multer = require('multer');
const path = require('path');
const ExcelJS = require('exceljs');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/bukti-bayar')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'bukti-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Hanya file gambar yang diperbolehkan'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Get all formulir
router.get('/', async (req, res) => {
    try {
        const formulir = await Formulir.getAll();
        res.json(formulir);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data formulir' });
    }
});

// Get today's formulir
router.get('/today', async (req, res) => {
    try {
        const formulir = await Formulir.getToday();
        res.json(formulir);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data formulir' });
    }
});

// Get eligible CPDB
router.get('/data/eligible-cpdb', async (req, res) => {
    try {
        const cpdb = await Formulir.getEligibleCPDB();
        res.json(cpdb);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data CPDB' });
    }
});

// Get available payment codes
router.get('/data/available-codes', async (req, res) => {
    try {
        const codes = await Formulir.getAvailablePaymentCodes();
        res.json(codes);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data kode pembayaran' });
    }
});

// Get statistics
router.get('/data/stats', async (req, res) => {
    try {
        const stats = await Formulir.getStats();
        res.json(stats); // totalUang already included in getStats()
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil statistik' });
    }
});

// Get today's statistics
router.get('/data/stats/today', async (req, res) => {
    try {
        const stats = await Formulir.getStatsToday();
        res.json(stats); // totalUang already included in getStatsToday()
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil statistik' });
    }
});

// Get formulir by ID (must be after all other GET routes)
router.get('/:id', async (req, res) => {
    try {
        const formulir = await Formulir.getById(req.params.id);
        if (!formulir) {
            return res.status(404).json({ message: 'Formulir tidak ditemukan' });
        }
        res.json(formulir);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data formulir' });
    }
});

// Create new formulir
router.post('/', upload.single('bukti_bayar'), async (req, res) => {
    try {
        // Parse numeric values
        const data = {
            ...req.body,
            id_user: parseInt(req.body.id_user),
            id_kode_pembayaran: parseInt(req.body.id_kode_pembayaran),
            nominal_formulir: parseFloat(req.body.nominal_formulir),
            bukti_bayar: req.file ? `/uploads/bukti-bayar/${req.file.filename}` : null,
            metode_pembayaran: req.body.metode_pembayaran,
            nama_pengirim: req.body.metode_pembayaran === 'Transfer' ? req.body.nama_pengirim : null
        };

        const id = await Formulir.create(data, req.user);
        const formulir = await Formulir.getById(id);
        res.status(201).json(formulir);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat membuat formulir' });
    }
});

// Update formulir
router.put('/:id', upload.single('bukti_bayar'), async (req, res) => {
    try {
        // Parse numeric values
        const data = {
            ...req.body,
            nominal_formulir: parseFloat(req.body.nominal_formulir),
            bukti_bayar: req.file ? `/uploads/bukti-bayar/${req.file.filename}` : null,
            metode_pembayaran: req.body.metode_pembayaran,
            nama_pengirim: req.body.metode_pembayaran === 'Transfer' ? req.body.nama_pengirim : null
        };

        const success = await Formulir.update(req.params.id, data);
        if (!success) {
            return res.status(404).json({ message: 'Formulir tidak ditemukan' });
        }

        const formulir = await Formulir.getById(req.params.id);
        res.json(formulir);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui formulir' });
    }
});

// Delete formulir
router.delete('/:id', async (req, res) => {
    try {
        const success = await Formulir.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Formulir tidak ditemukan' });
        }
        res.json({ message: 'Formulir berhasil dihapus' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus formulir' });
    }
});

// Verify formulir
router.put('/:id/verify', async (req, res) => {
    try {
        const success = await Formulir.verify(req.params.id, req.user.nama);
        if (!success) {
            return res.status(404).json({ message: 'Formulir tidak ditemukan' });
        }
        res.json({ message: 'Formulir berhasil diverifikasi' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memverifikasi formulir' });
    }
});

// Helper function for Excel formatting
const formatExcelWorksheet = (worksheet, titles, formulir) => {
    // Set worksheet properties
    worksheet.properties.defaultRowHeight = 30;
    worksheet.properties.outlineLevelRow = 1;

    // Merge and style title cells
    titles.forEach((title, index) => {
        const rowNum = index + 1;
        worksheet.mergeCells(`A${rowNum}:J${rowNum}`);
        const titleRow = worksheet.getRow(rowNum);
        titleRow.height = 30;
        
        const cell = worksheet.getCell(`A${rowNum}`);
        cell.value = title;
        cell.font = { bold: true, size: 16 };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE2F0D9' }
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

        // Add headers with styling
        const headers = ['No Formulir', 'Tanggal', 'Nama CPDB', 'Asal SMP', 'Kode Bayar', 'Nominal', 'Metode Bayar', 'Nama Pengirim', 'Status', 'Verifikator'];
    const headerRow = worksheet.addRow(headers);
    headerRow.height = 30;

    // Style header row
    headerRow.eachCell((cell) => {
        cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4472C4' }
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });
    
    // Add data
    formulir.forEach((form, index) => {
        const row = worksheet.addRow([
                form.no_formulir,
                new Date(form.tanggal).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                }),
                form.nama_lengkap,
                form.asal_smp,
                form.kode_bayar,
                form.nominal_formulir,
                form.metode_pembayaran || '-',
                form.nama_pengirim || '-',
                form.status,
                form.verifikator
        ]);

        // Set row height
        row.height = 25;

        // Alternate row colors (starting after header)
        if ((index + 1) % 2 === 0) {
            row.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFD9E1F2' }
                };
            });
        }

        // Add borders to each cell
        row.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
        });
    });
    
    // Add total row
    const totalRow = worksheet.addRow(['Total', '', '', '', '', formulir.reduce((sum, form) => sum + parseFloat(form.nominal_formulir), 0), '', '', '', '']);
    totalRow.height = 25;
    totalRow.font = { bold: true };
    totalRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    totalRow.getCell(6).numFmt = '"Rp"#,##0.00';
    
    // Style total row
    totalRow.eachCell((cell) => {
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE2F0D9' }
        };
    });

        // Format columns with specific alignments and styles
        const columnStyles = [
            { width: 15, alignment: 'center' }, // No Formulir
            { width: 25, alignment: 'center' }, // Tanggal
            { width: 30, alignment: 'left' },   // Nama CPDB
            { width: 25, alignment: 'left' },   // Asal SMP
            { width: 15, alignment: 'center' }, // Kode Bayar
            { width: 20, alignment: 'right', format: '"Rp"#,##0.00' },  // Nominal
            { width: 15, alignment: 'center' }, // Metode Bayar
            { width: 20, alignment: 'left' },   // Nama Pengirim
            { width: 15, alignment: 'center' }, // Status
            { width: 20, alignment: 'center' }  // Verifikator
        ];

        worksheet.columns.forEach((column, index) => {
            const style = columnStyles[index];
            column.width = style.width;
            column.alignment = { horizontal: style.alignment, vertical: 'middle' };
            if (style.format) {
                column.numFmt = style.format;
            }
        });
};

// Export all formulir to Excel
router.get('/export/all', async (req, res) => {
    try {
        const formulir = await Formulir.getAll();
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Laporan Formulir');

        // Set worksheet properties
        worksheet.properties.defaultRowHeight = 30;
        worksheet.properties.outlineLevelRow = 1;

        // Merge and style title cells
        const titles = [
            'Laporan Pembelian Formulir',
            'SPMB - SMK Jakarta Pusat 1',
            'Tahun 2026/2027'
        ];

        titles.forEach((title, index) => {
            const rowNum = index + 1;
            worksheet.mergeCells(`A${rowNum}:J${rowNum}`);
            const titleRow = worksheet.getRow(rowNum);
            titleRow.height = 30;
            
            const cell = worksheet.getCell(`A${rowNum}`);
            cell.value = title;
            cell.font = { bold: true, size: 16 };
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE2F0D9' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

    // Add headers with styling
    const headers = ['No Formulir', 'Tanggal', 'Nama CPDB', 'Asal SMP', 'Kode Bayar', 'Nominal', 'Metode Bayar', 'Nama Pengirim', 'Status', 'Verifikator'];
    const headerRow = worksheet.addRow(headers);
    headerRow.height = 30;

        // Style header row
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4472C4' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
        
        // Add data
        formulir.forEach((form, index) => {
            const row = worksheet.addRow([
                form.no_formulir,
                new Date(form.tanggal).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                }),
                form.nama_lengkap,
                form.asal_smp,
                form.kode_bayar,
                form.nominal_formulir,
                form.metode_pembayaran || '-',
                form.nama_pengirim || '-',
                form.status,
                form.verifikator
            ]);

            // Set row height
            row.height = 25;

            // Alternate row colors (starting after header)
            if ((index + 1) % 2 === 0) {
                row.eachCell((cell) => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFD9E1F2' }
                    };
                });
            }

            // Add borders to each cell
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
            });
        });
        
        // Add total row
        const totalRow = worksheet.addRow(['Total', '', '', '', '', formulir.reduce((sum, form) => sum + parseFloat(form.nominal_formulir), 0), '', '', '', '']);
        totalRow.height = 25;
        totalRow.font = { bold: true };
        totalRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
        totalRow.getCell(6).numFmt = '"Rp"#,##0.00';
        
        // Style total row
        totalRow.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE2F0D9' }
            };
        });

        // Format and auto-fit columns
        worksheet.columns.forEach((column, index) => {
            // Set column alignments
            const alignments = {
                0: 'center', // No Formulir
                1: 'center', // Tanggal
                2: 'left',   // Nama CPDB
                3: 'left',   // Asal SMP
                4: 'center', // Kode Bayar
                5: 'right',  // Nominal
                6: 'center', // Metode Bayar
                7: 'left',   // Nama Pengirim
                8: 'center', // Status
                9: 'center'  // Verifikator
            };
            
            column.alignment = { 
                horizontal: alignments[index], 
                vertical: 'middle' 
            };

            // Set special formatting for nominal column
            if (index === 5) {
                column.numFmt = '"Rp"#,##0.00';
            }

            // Auto-fit column width
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, cell => {
                let cellLength = cell.value ? cell.value.toString().length : 10;
                maxLength = Math.max(maxLength, cellLength);
            });
            column.width = Math.min(maxLength + 2, 30);
        });
        
        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Laporan_Formulir_PPDB.xlsx');
        
        // Write to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengekspor data' });
    }
});

// Export today's formulir to Excel
router.get('/export/today', async (req, res) => {
    try {
        const formulir = await Formulir.getToday();
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Laporan Formulir Hari Ini');

        // Set worksheet properties
        worksheet.properties.defaultRowHeight = 30;
        worksheet.properties.outlineLevelRow = 1;

        // Get formatted date
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = today.toLocaleDateString('id-ID', options);

        // Merge and style title cells
        const todayTitles = [
            'Laporan Pembelian Formulir',
            'SPMB - SMK Jakarta Pusat 1',
            'Tahun 2026/2027',
            formattedDate
        ];

        todayTitles.forEach((title, index) => {
            const rowNum = index + 1;
            worksheet.mergeCells(`A${rowNum}:J${rowNum}`);
            const titleRow = worksheet.getRow(rowNum);
            titleRow.height = 30;
            
            const cell = worksheet.getCell(`A${rowNum}`);
            cell.value = title;
            cell.font = { bold: true, size: 16 };
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE2F0D9' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        // Add headers with styling
        const headers = ['No Formulir', 'Tanggal', 'Nama CPDB', 'Asal SMP', 'Kode Bayar', 'Nominal', 'Metode Bayar', 'Nama Pengirim', 'Status', 'Verifikator'];
        const headerRow = worksheet.addRow(headers);
        headerRow.height = 30;

        // Style header row
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4472C4' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
        
        // Add data
        formulir.forEach((form, index) => {
            const row = worksheet.addRow([
                form.no_formulir,
                new Date(form.tanggal).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                }),
                form.nama_lengkap,
                form.asal_smp,
                form.kode_bayar,
                form.nominal_formulir,
                form.metode_pembayaran || '-',
                form.nama_pengirim || '-',
                form.status,
                form.verifikator
            ]);

            // Set row height
            row.height = 25;

            // Alternate row colors (starting after header)
            if ((index + 1) % 2 === 0) {
                row.eachCell((cell) => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFD9E1F2' }
                    };
                });
            }

            // Add borders to each cell
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
            });
        });
        
        // Add total row
        const totalRow = worksheet.addRow(['Total', '', '', '', '', formulir.reduce((sum, form) => sum + parseFloat(form.nominal_formulir), 0), '', '', '', '']);
        totalRow.height = 25;
        totalRow.font = { bold: true };
        totalRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
        totalRow.getCell(6).numFmt = '"Rp"#,##0.00';
        
        // Style total row
        totalRow.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE2F0D9' }
            };
        });

        // Format and auto-fit columns
        worksheet.columns.forEach((column, index) => {
            // Set column alignments
            const alignments = {
                0: 'center', // No Formulir
                1: 'center', // Tanggal
                2: 'left',   // Nama CPDB
                3: 'left',   // Asal SMP
                4: 'center', // Kode Bayar
                5: 'right',  // Nominal
                6: 'center', // Metode Bayar
                7: 'left',   // Nama Pengirim
                8: 'center', // Status
                9: 'center'  // Verifikator
            };
            
            column.alignment = { 
                horizontal: alignments[index], 
                vertical: 'middle' 
            };

            // Set special formatting for nominal column
            if (index === 5) {
                column.numFmt = '"Rp"#,##0.00';
            }

            // Auto-fit column width
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, cell => {
                let cellLength = cell.value ? cell.value.toString().length : 10;
                maxLength = Math.max(maxLength, cellLength);
            });
            column.width = Math.min(maxLength + 2, 30);
        });
        
        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Laporan_Formulir_PPDB_Harian.xlsx');

        // Write to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengekspor data' });
    }
});

module.exports = router;
