const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const ExcelJS = require('exceljs');
const KodePembayaran = require('../../../models/KodePembayaran');

// Configure multer for excel file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/excel');
    },
    filename: function (req, file, cb) {
        cb(null, 'kode-pembayaran-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Check file extension
        const allowedExtensions = /\.(xlsx|xls)$/i;
        const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

        if (!extname) {
            return cb(new Error('File harus berformat Excel (.xlsx atau .xls)'));
        }

        // If validation passes
        cb(null, true);
    }
});


// Get all kode pembayaran
router.get('/', async (req, res) => {
    try {
        const kodes = await KodePembayaran.getAll();
        res.json(kodes);
    } catch (error) {
        console.error('Error getting kode pembayaran:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data kode pembayaran' });
    }
});

// Download template Excel - MUST be before /:id route
router.get('/template', async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Kode Pembayaran');

        // Add headers
        worksheet.columns = [
            { header: 'No', key: 'no', width: 5 },
            { header: 'Kode Bayar', key: 'kode_bayar', width: 20 },
            { header: 'Status', key: 'status', width: 15 }
        ];

        // Style the headers
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        
        // Add borders to header
        worksheet.getRow(1).eachCell((cell) => {
            cell.border = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            };
        });

        // Add sample data
        worksheet.addRow({ no: 1, kode_bayar: 'KB001', status: 'Belum Terpakai' });
        worksheet.addRow({ no: 2, kode_bayar: 'KB002', status: 'Belum Terpakai' });

        // Add data validation for status column
        worksheet.dataValidations.add('C2:C1000', {
            type: 'list',
            allowBlank: false,
            formulae: ['"Belum Terpakai,Sudah Terpakai"']
        });

        // Auto-fit columns
        worksheet.columns.forEach(column => {
            column.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=template-kode-pembayaran.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error generating template:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat membuat template' });
    }
});

// Get kode pembayaran by id
router.get('/:id', async (req, res) => {
    try {
        const kode = await KodePembayaran.getById(req.params.id);
        if (!kode) {
            return res.status(404).json({ message: 'Kode pembayaran tidak ditemukan' });
        }
        res.json(kode);
    } catch (error) {
        console.error('Error getting kode pembayaran:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data kode pembayaran' });
    }
});

// Create new kode pembayaran
router.post('/', async (req, res) => {
    try {
        const { kode_bayar } = req.body;
        
        // Validate input
        if (!kode_bayar) {
            return res.status(400).json({ message: 'Kode bayar harus diisi' });
        }

        // Create kode pembayaran
        const id = await KodePembayaran.create({ kode_bayar });
        const kode = await KodePembayaran.getById(id);
        
        res.status(201).json(kode);
    } catch (error) {
        console.error('Error creating kode pembayaran:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat membuat kode pembayaran' });
    }
});

// Update kode pembayaran
router.put('/:id', async (req, res) => {
    try {
        const { kode_bayar, status } = req.body;
        const id = req.params.id;

        // Get existing kode
        const existingKode = await KodePembayaran.getById(id);
        if (!existingKode) {
            return res.status(404).json({ message: 'Kode pembayaran tidak ditemukan' });
        }

        // Prevent editing if status is "Sudah Terpakai"
        if (existingKode.status === 'Sudah Terpakai') {
            return res.status(400).json({ message: 'Kode pembayaran yang sudah terpakai tidak dapat diedit' });
        }

        // Validate input
        if (!kode_bayar) {
            return res.status(400).json({ message: 'Kode bayar harus diisi' });
        }

        // Update kode pembayaran
        await KodePembayaran.update(id, { kode_bayar, status });
        const updatedKode = await KodePembayaran.getById(id);
        
        res.json(updatedKode);
    } catch (error) {
        console.error('Error updating kode pembayaran:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui kode pembayaran' });
    }
});

// Delete kode pembayaran
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Get existing kode
        const existingKode = await KodePembayaran.getById(id);
        if (!existingKode) {
            return res.status(404).json({ message: 'Kode pembayaran tidak ditemukan' });
        }

        // Prevent deletion if status is "Sudah Terpakai"
        if (existingKode.status === 'Sudah Terpakai') {
            return res.status(400).json({ message: 'Kode pembayaran yang sudah terpakai tidak dapat dihapus' });
        }

        // Delete kode pembayaran
        await KodePembayaran.delete(id);
        
        res.json({ message: 'Kode pembayaran berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting kode pembayaran:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus kode pembayaran' });
    }
});

// Reset all kode pembayaran status
router.post('/reset-status', async (req, res) => {
    try {
        // Get all kode pembayaran
        const kodes = await KodePembayaran.getAll();
        
        // Update each kode status to "Belum Terpakai"
        for (const kode of kodes) {
            await KodePembayaran.update(kode.id_kode_pembayaran, {
                kode_bayar: kode.kode_bayar,
                status: 'Belum Terpakai'
            });
        }
        
        res.json({ message: 'Status kode pembayaran berhasil direset' });
    } catch (error) {
        console.error('Error resetting kode pembayaran status:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mereset status kode pembayaran' });
    }
});

// Import kode pembayaran from Excel
router.post('/import', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'File Excel harus diunggah' });
        }

        const filePath = req.file.path;
        
        try {
            // Import data from Excel
            const importedCount = await KodePembayaran.importFromExcel(filePath);
            
            // Delete the temporary file
            await fs.unlink(filePath);
            
            res.json({ 
                message: `Berhasil mengimpor ${importedCount} kode pembayaran`,
                count: importedCount
            });
        } catch (error) {
            // Delete the temporary file in case of error
            await fs.unlink(filePath);
            throw error;
        }
    } catch (error) {
        console.error('Error importing kode pembayaran:', error);
        res.status(500).json({ 
            message: 'Terjadi kesalahan saat mengimpor kode pembayaran',
            error: error.message 
        });
    }
});

// Preview generated kode pembayaran
router.post('/preview-generate', async (req, res) => {
    try {
        const { jumlah, prefix } = req.body;
        
        // Validate input
        if (!jumlah || jumlah <= 0) {
            return res.status(400).json({ message: 'Jumlah harus lebih dari 0' });
        }

        if (jumlah > 1000) {
            return res.status(400).json({ message: 'Jumlah maksimal 1000 kode per generate' });
        }

        // Generate preview
        const kodeList = await KodePembayaran.generateKodeBatch(parseInt(jumlah), prefix || 'KB');
        
        res.json({ 
            preview: kodeList,
            total: kodeList.length
        });
    } catch (error) {
        console.error('Error previewing kode pembayaran:', error);
        res.status(500).json({ 
            message: 'Terjadi kesalahan saat membuat preview kode pembayaran',
            error: error.message 
        });
    }
});

// Generate and save kode pembayaran in batch
router.post('/generate', async (req, res) => {
    try {
        const { jumlah, prefix } = req.body;
        
        // Validate input
        if (!jumlah || jumlah <= 0) {
            return res.status(400).json({ message: 'Jumlah harus lebih dari 0' });
        }

        if (jumlah > 1000) {
            return res.status(400).json({ message: 'Jumlah maksimal 1000 kode per generate' });
        }

        // Generate kode list
        const kodeList = await KodePembayaran.generateKodeBatch(parseInt(jumlah), prefix || 'KB');
        
        // Save to database
        const totalInserted = await KodePembayaran.createBatch(kodeList);
        
        res.json({ 
            message: `Berhasil generate ${totalInserted} kode pembayaran`,
            count: totalInserted,
            kodes: kodeList
        });
    } catch (error) {
        console.error('Error generating kode pembayaran:', error);
        res.status(500).json({ 
            message: 'Terjadi kesalahan saat generate kode pembayaran',
            error: error.message 
        });
    }
});


module.exports = router;
