const express = require('express');
const router = express.Router();
const pdf = require('html-pdf');
const path = require('path');
const { isAuthenticated } = require('../../../middleware/auth');
const Formulir = require('../../../models/Formulir');
const moment = require('moment-timezone');
moment.locale('id');

// Helper function to convert number to words in Indonesian
function numberToWords(num) {
    const units = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan'];
    const teens = ['Sepuluh', 'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas', 'Enam Belas', 'Tujuh Belas', 'Delapan Belas', 'Sembilan Belas'];
    const tens = ['', '', 'Dua Puluh', 'Tiga Puluh', 'Empat Puluh', 'Lima Puluh', 'Enam Puluh', 'Tujuh Puluh', 'Delapan Puluh', 'Sembilan Puluh'];
    
    if (num === 0) return 'Nol';
    
    function convertLessThanOneThousand(n) {
        if (n === 0) return '';
        if (n < 10) return units[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '');
        return units[Math.floor(n / 100)] + ' Ratus' + (n % 100 !== 0 ? ' ' + convertLessThanOneThousand(n % 100) : '');
    }
    
    let words = '';
    let billions = Math.floor(num / 1000000000);
    let millions = Math.floor((num % 1000000000) / 1000000);
    let thousands = Math.floor((num % 1000000) / 1000);
    let remainder = num % 1000;
    
    if (billions) words += convertLessThanOneThousand(billions) + ' Milyar ';
    if (millions) words += convertLessThanOneThousand(millions) + ' Juta ';
    if (thousands) words += convertLessThanOneThousand(thousands) + ' Ribu ';
    if (remainder) words += convertLessThanOneThousand(remainder);
    
    return words.trim();
}

router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const formulir = await Formulir.getById(req.params.id);

        if (!formulir) {
            return res.status(404).send('Formulir tidak ditemukan');
        }

        const logoPath = path.join(__dirname, '../../../public/images/logo-jp1.png');
        const logoBase64 = Buffer.from(require('fs').readFileSync(logoPath)).toString('base64');

        // Generate HTML content
        const html = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Poppins', sans-serif;
                }
                
                @page {
                    size: A4 landscape;
                    margin: 0;
                }
                
                body {
                    background: #f0fdf4;
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 210mm;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                }

                .page-container {
                    width: 100%;
                    max-width: 1024px;
                    margin: 30px auto;
                    padding: 0 30px;
                }
                
                .receipt-container {
                    width: 100%;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    position: relative;
                }

                .receipt-header {
                    background: linear-gradient(135deg, #15803d, #22c55e);
                    padding: 20px 24px;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .school-info {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .logo {
                    width: 56px;
                    height: 56px;
                    object-fit: contain;
                    background: white;
                    padding: 6px;
                    border-radius: 10px;
                }

                .school-details h1 {
                    font-size: 22px;
                    font-weight: 700;
                    margin: 0;
                }

                .school-details p {
                    font-size: 13px;
                    opacity: 0.9;
                    margin: 2px 0 0 0;
                }

                .receipt-title {
                    text-align: right;
                }

                .receipt-title h2 {
                    font-size: 26px;
                    font-weight: 700;
                    margin: 0;
                }

                .receipt-title p {
                    font-size: 15px;
                    opacity: 0.9;
                    margin: 2px 0 0 0;
                }

                .receipt-content {
                    padding: 24px;
                }

                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .info-item {
                    background: #f0fdf4;
                    padding: 14px 18px;
                    border-radius: 10px;
                }

                .info-label {
                    font-size: 13px;
                    color: #166534;
                    margin-bottom: 6px;
                }

                .info-value {
                    font-size: 15px;
                    color: #15803d;
                    font-weight: 600;
                }

                .amount-section {
                    background: linear-gradient(135deg, #15803d, #22c55e);
                    border-radius: 12px;
                    padding: 20px;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 20px;
                    position: relative;
                }

                .amount-info {
                    flex: 1;
                }

                .amount-info h3 {
                    font-size: 15px;
                    opacity: 0.9;
                    margin: 0;
                }

                .amount-value {
                    font-size: 28px;
                    font-weight: 700;
                    margin: 6px 0;
                }

                .amount-words {
                    font-size: 13px;
                    opacity: 0.9;
                    font-style: italic;
                }

                .paid-badge {
                    display: flex;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.2);
                    padding: 10px 20px;
                    border-radius: 30px;
                    margin-left: 20px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                }

                .badge-icon {
                    width: 24px;
                    height: 24px;
                    margin-right: 8px;
                }

                .badge-text {
                    font-size: 16px;
                    font-weight: 600;
                    color: white;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .pattern {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0.05;
                    pointer-events: none;
                    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23166534' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
                }
            </style>
        </head>
        <body>
            <div class="page-container">
                <div class="receipt-container">
                    <div class="pattern"></div>
                    <div class="receipt-header">
                        <div class="school-info">
                            <img src="data:image/png;base64,${logoBase64}" alt="Logo SMK JT1" class="logo">
                            <div class="school-details">
                                <h1>SMK Jakarta Pusat 1</h1>
                                <p>Jl. Cipinang Muara I No.1, Jakarta Timur | Telp: (021) 8194466</p>
                            </div>
                        </div>
                        <div class="receipt-title">
                            <h2>KUITANSI PEMBAYARAN</h2>
                            <p>FORMULIR SPMB 2026/2027</p>
                        </div>
                    </div>

                    <div class="receipt-content">
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-label">Nomor Kuitansi</div>
                                <div class="info-value">${formulir.no_formulir}</div>
                            </div>
                            
                            <div class="info-item">
                                <div class="info-label">Telah Terima Dari</div>
                                <div class="info-value">${formulir.nama_lengkap} - ${formulir.asal_smp}</div>
                            </div>
                        </div>

                        <div class="info-item" style="margin-bottom: 20px;">
                            <div class="info-label">Untuk Pembayaran</div>
                            <div class="info-value">Formulir SPMB SMK Jakarta Pusat 1 Tahun 2026/2027</div>
                        </div>

                        <div class="amount-section">
                            <div class="amount-info">
                                <h3>Nominal Pembayaran</h3>
                                <div class="amount-value">Rp ${parseInt(formulir.nominal_formulir).toLocaleString('id-ID')}</div>
                                <div class="amount-words">${numberToWords(parseInt(formulir.nominal_formulir))} Rupiah</div>
                            </div>
                            <div class="paid-badge">
                                <svg class="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span class="badge-text">Sudah Lunas</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>`;

        // PDF options
        const options = {
            format: 'A4',
            orientation: 'landscape',
            border: {
                top: '10mm',
                right: '15mm',
                bottom: '10mm',
                left: '15mm'
            },
            timeout: 30000
        };

        // Generate PDF
        pdf.create(html, options).toBuffer((err, buffer) => {
            if (err) {
                console.error('Error generating PDF:', err);
                return res.status(500).send('Error generating PDF');
            }

            // Set response headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=kuitansi-${formulir.no_formulir}.pdf`);
            
            // Send PDF
            res.send(buffer);
        });

    } catch (error) {
        console.error('Error generating kuitansi:', error);
        res.status(500).send('Terjadi kesalahan saat membuat kuitansi');
    }
});

module.exports = router;
