const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isAuthenticated } = require('../../../middleware/auth');
const Berkas = require('../../../models/Berkas');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'public/uploads/berkas';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'berkas-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Hanya file PDF yang diperbolehkan'));
        }
        cb(null, true);
    }
});

// Upload berkas
router.post('/upload', isAuthenticated, upload.single('berkas'), async (req, res) => {
    try {
        const id_formulir = req.body.id_formulir;
        if (!id_formulir) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: 'ID Formulir tidak ditemukan'
            });
        }

        // Check if berkas already exists
        const existingBerkas = await Berkas.findByFormulirId(id_formulir);
        
        if (existingBerkas) {
            // If there's a file being uploaded
            if (req.file) {
                // Delete old file if it exists
                if (existingBerkas.nama_file) {
                    const oldFilePath = path.join('public/uploads/berkas', existingBerkas.nama_file);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }
                
                // Update existing berkas with new file
                await Berkas.update({
                    id_berkas: existingBerkas.id_berkas,
                    nama_file: req.file.filename
                });
            }
        } else {
            // Create new berkas
            await Berkas.create({
                id_formulir: id_formulir,
                nama_file: req.file ? req.file.filename : null
            });
        }

        res.json({
            success: true,
            message: req.file ? 'Berkas berhasil diupload' : 'Data berkas berhasil disimpan'
        });
    } catch (error) {
        console.error('Error uploading berkas:', error);
        // Delete uploaded file if there's an error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat upload berkas'
        });
    }
});

// Delete berkas
router.delete('/:id_berkas', isAuthenticated, async (req, res) => {
    try {
        const berkas = await Berkas.findById(req.params.id_berkas);
        if (!berkas) {
            return res.status(404).json({
                success: false,
                message: 'Berkas tidak ditemukan'
            });
        }

        // Delete file from storage if it exists
        if (berkas.nama_file) {
            const filePath = path.join('public/uploads/berkas', berkas.nama_file);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Delete from database
        await Berkas.delete(req.params.id_berkas);

        res.json({
            success: true,
            message: 'Berkas berhasil dihapus'
        });
    } catch (error) {
        console.error('Error deleting berkas:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus berkas'
        });
    }
});

module.exports = router;
