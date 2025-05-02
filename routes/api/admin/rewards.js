const express = require('express');
const router = express.Router();
const { isAdmin } = require('../../../middleware/auth');
const Reward = require('../../../models/Reward');
const ExcelJS = require('exceljs');

// Apply admin middleware to all routes
router.use(isAdmin);

// GET /api/admin/rewards - Get all rewards
router.get('/', async (req, res) => {
    try {
        const rewards = await Reward.getAll();
        res.json(rewards);
    } catch (error) {
        console.error('Error fetching rewards:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data reward' });
    }
});

// GET /api/admin/rewards/today - Get today's rewards
router.get('/today', async (req, res) => {
    try {
        const rewards = await Reward.getToday();
        res.json(rewards);
    } catch (error) {
        console.error('Error fetching today\'s rewards:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data reward hari ini' });
    }
});

// GET /api/admin/rewards/stats - Get all rewards statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await Reward.getStats();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil statistik' });
    }
});

// GET /api/admin/rewards/stats/today - Get today's rewards statistics
router.get('/stats/today', async (req, res) => {
    try {
        const stats = await Reward.getStatsToday();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching today\'s stats:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil statistik hari ini' });
    }
});

// GET /api/admin/rewards/export/today - Export today's rewards to Excel
router.get('/export/today', async (req, res) => {
    try {
        const rewards = await Reward.getToday();
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reward Hari Ini');

        // Define columns
        worksheet.columns = [
            { header: 'No', key: 'no', width: 5 },
            { header: 'Tanggal', key: 'tanggal_reward', width: 20 },
            { header: 'Nama CPDB', key: 'nama_cpdb', width: 40 },
            { header: 'Nama Pembawa', key: 'nama_pembawa', width: 30 },
            { header: 'Keterangan', key: 'keterangan_pembawa', width: 30 },
            { header: 'Nomor WhatsApp', key: 'no_wa_pembawa', width: 20 },
            { header: 'Nominal', key: 'nominal', width: 15 },
            { header: 'Petugas', key: 'nama_petugas', width: 25 },
        ];

        // Add rows
        let totalNominal = 0;
        rewards.forEach((reward, index) => {
            worksheet.addRow({
                no: index + 1,
                tanggal_reward: new Date(reward.tanggal_reward).toLocaleDateString('id-ID'),
                nama_cpdb: `${reward.no_formulir} - ${reward.nama_cpdb}`,
                nama_pembawa: reward.nama_pembawa,
                keterangan_pembawa: reward.keterangan_pembawa,
                no_wa_pembawa: reward.no_wa_pembawa,
                nominal: reward.nominal,
                nama_petugas: reward.nama_petugas,
            });
            totalNominal += Number(reward.nominal);
        });

        // Add total row with merged cells
        const totalRow = worksheet.addRow([
            '', '', '', '', '', 'Total Nominal', totalNominal, ''
        ]);
        worksheet.mergeCells(`A${totalRow.number}:E${totalRow.number}`);
        totalRow.getCell(6).alignment = { horizontal: 'right' };
        totalRow.font = { bold: true };

        // Format nominal column as currency
        worksheet.getColumn('nominal').numFmt = '"Rp"#,##0;[Red]\-"Rp"#,##0';

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reward_hari_ini.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting today\'s rewards:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengekspor data reward hari ini' });
    }
});

// GET /api/admin/rewards/export/all - Export all rewards to Excel
router.get('/export/all', async (req, res) => {
    try {
        const rewards = await Reward.getAll();
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reward Keseluruhan');

        // Define columns
        worksheet.columns = [
            { header: 'No', key: 'no', width: 5 },
            { header: 'Tanggal', key: 'tanggal_reward', width: 20 },
            { header: 'Nama CPDB', key: 'nama_cpdb', width: 40 },
            { header: 'Nama Pembawa', key: 'nama_pembawa', width: 30 },
            { header: 'Keterangan', key: 'keterangan_pembawa', width: 30 },
            { header: 'Nomor WhatsApp', key: 'no_wa_pembawa', width: 20 },
            { header: 'Nominal', key: 'nominal', width: 15 },
            { header: 'Petugas', key: 'nama_petugas', width: 25 },
        ];

        // Add rows
        let totalNominal = 0;
        rewards.forEach((reward, index) => {
            worksheet.addRow({
                no: index + 1,
                tanggal_reward: new Date(reward.tanggal_reward).toLocaleDateString('id-ID'),
                nama_cpdb: `${reward.no_formulir} - ${reward.nama_cpdb}`,
                nama_pembawa: reward.nama_pembawa,
                keterangan_pembawa: reward.keterangan_pembawa,
                no_wa_pembawa: reward.no_wa_pembawa,
                nominal: reward.nominal,
                nama_petugas: reward.nama_petugas,
            });
            totalNominal += Number(reward.nominal);
        });

        // Add total row with merged cells
        const totalRow = worksheet.addRow([
            '', '', '', '', '', 'Total Nominal', totalNominal, ''
        ]);
        worksheet.mergeCells(`A${totalRow.number}:E${totalRow.number}`);
        totalRow.getCell(6).alignment = { horizontal: 'right' };
        totalRow.font = { bold: true };

        // Format nominal column as currency
        worksheet.getColumn('nominal').numFmt = '"Rp"#,##0;[Red]\-"Rp"#,##0';

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reward_keseluruhan.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting all rewards:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengekspor data reward keseluruhan' });
    }
});

// GET /api/admin/rewards/eligible-payments - Get eligible payments for rewards
router.get('/eligible-payments', async (req, res) => {
    try {
        const payments = await Reward.getEligiblePayments();
        res.json(payments);
    } catch (error) {
        console.error('Error fetching eligible payments:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data pembayaran yang eligible' });
    }
});

// GET /api/admin/rewards/:id - Get a specific reward
router.get('/:id', async (req, res) => {
    try {
        const reward = await Reward.getById(req.params.id);
        if (!reward) {
            return res.status(404).json({ message: 'Reward tidak ditemukan' });
        }
        res.json(reward);
    } catch (error) {
        console.error('Error fetching reward:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data reward' });
    }
});

// POST /api/admin/rewards - Create a new reward
router.post('/', async (req, res) => {
    try {
        const rewardId = await Reward.create(req.body, req.user);
        res.status(201).json({ 
            message: 'Reward berhasil ditambahkan',
            id: rewardId
        });
    } catch (error) {
        console.error('Error creating reward:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan reward' });
    }
});

// PUT /api/admin/rewards/:id - Update a reward
router.put('/:id', async (req, res) => {
    try {
        const success = await Reward.update(req.params.id, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Reward tidak ditemukan' });
        }
        res.json({ message: 'Reward berhasil diperbarui' });
    } catch (error) {
        console.error('Error updating reward:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui reward' });
    }
});

// DELETE /api/admin/rewards/:id - Delete a reward
router.delete('/:id', async (req, res) => {
    try {
        const success = await Reward.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Reward tidak ditemukan' });
        }
        res.json({ message: 'Reward berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting reward:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus reward' });
    }
});

module.exports = router;
