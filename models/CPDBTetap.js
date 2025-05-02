const db = require('../config/database');

class CPDBTetap {
    static async findAll() {
        try {
            const query = `
                SELECT DISTINCT
                    u.*,
                    f.no_formulir,
                    p.id_jurusan,
                    j.jurusan,
                    j.kode,
                    p.status_pelunasan,
                    COALESCE(SUM(d.nominal_pembayaran), 0) as nominal_pembayaran,
                    
                    -- Data Pribadi
                    dp.tempat_lahir,
                    dp.tanggal_lahir,
                    dp.no_registrasi_akta_lahir,
                    dp.agama,
                    dp.kewarganegaraan,
                    dp.berkebutuhan_khusus,
                    dp.alamat_jalan,
                    dp.rt,
                    dp.rw,
                    dp.nama_dusun,
                    dp.nama_kelurahan,
                    dp.kecamatan,
                    dp.kode_pos,
                    dp.nomor_telepon,
                    dp.email,
                    dp.mode_transportasi,
                    dp.nomor_kks,
                    dp.anak_keberapa,
                    
                    -- Data Ayah
                    da.nama_ayah,
                    da.nik_ayah,
                    da.tempat_lahir_ayah,
                    da.tanggal_lahir_ayah,
                    da.nomor_telepon_ayah,
                    da.pendidikan_terakhir as pendidikan_ayah,
                    da.pekerjaan_ayah,
                    da.penghasilan_perbulan_ayah,
                    da.berkebutuhan_khusus_ayah,
                    
                    -- Data Ibu
                    di.nama_ibu,
                    di.nik_ibu,
                    di.tempat_lahir_ibu,
                    di.tanggal_lahir_ibu,
                    di.nomor_telepon_ibu,
                    di.pendidikan_terakhir_ibu,
                    di.pekerjaan_ibu,
                    di.penghasilan_perbulan_ibu,
                    di.berkebutuhan_khusus_ibu,
                    
                    -- Data Wali
                    dw.nama_wali,
                    dw.nik_wali,
                    dw.tempat_lahir_wali,
                    dw.tanggal_lahir_wali,
                    dw.nomor_telepon_wali,
                    dw.pendidikan_terakhir_wali,
                    dw.pekerjaan_wali,
                    dw.penghasilan_perbulan_wali,
                    
                    -- Data Periodik
                    dpe.tinggi_badan,
                    dpe.berat_badan,
                    dpe.jarak_tempuh_ke_sekolah,
                    dpe.waktu_tempuh_ke_sekolah,
                    dpe.jumlah_saudara_kandung,
                    
                    -- Registrasi Peserta Didik
                    rpd.jenis_pendaftaran,
                    rpd.tanggal_masuk_sekolah,
                    rpd.asal_sekolah,
                    rpd.nomor_peserta_ujian,
                    rpd.no_seri_ijazah,
                    rpd.no_seri_skhus

                FROM users u
                JOIN formulir f ON u.id_user = f.id_user
                JOIN pembayaran_pendaftaran p ON f.id_formulir = p.id_formulir
                JOIN jurusan j ON p.id_jurusan = j.id_jurusan
                JOIN detail_pembayaran_pendaftaran d ON p.id_pembayaran = d.id_pembayaran
                LEFT JOIN data_pribadi dp ON f.id_formulir = dp.id_formulir
                LEFT JOIN data_ayah da ON f.id_formulir = da.id_formulir
                LEFT JOIN data_ibu di ON f.id_formulir = di.id_formulir
                LEFT JOIN data_wali dw ON f.id_formulir = dw.id_formulir
                LEFT JOIN data_periodik dpe ON f.id_formulir = dpe.id_formulir
                LEFT JOIN registrasi_peserta_didik rpd ON f.id_formulir = rpd.id_formulir
                WHERE u.roles = 'CPDB'
                AND EXISTS (
                    SELECT 1 
                    FROM detail_pembayaran_pendaftaran d2 
                    WHERE d2.id_pembayaran = p.id_pembayaran 
                    AND d2.status_verifikasi = 'VERIFIED'
                )
                GROUP BY 
                    u.id_user, 
                    f.no_formulir,
                    p.id_jurusan,
                    j.jurusan,
                    j.kode,
                    p.status_pelunasan,
                    dp.tempat_lahir,
                    dp.tanggal_lahir,
                    dp.no_registrasi_akta_lahir,
                    dp.agama,
                    dp.kewarganegaraan,
                    dp.berkebutuhan_khusus,
                    dp.alamat_jalan,
                    dp.rt,
                    dp.rw,
                    dp.nama_dusun,
                    dp.nama_kelurahan,
                    dp.kecamatan,
                    dp.kode_pos,
                    dp.nomor_telepon,
                    dp.email,
                    dp.mode_transportasi,
                    dp.nomor_kks,
                    dp.anak_keberapa,
                    da.nama_ayah,
                    da.nik_ayah,
                    da.tempat_lahir_ayah,
                    da.tanggal_lahir_ayah,
                    da.nomor_telepon_ayah,
                    da.pendidikan_terakhir,
                    da.pekerjaan_ayah,
                    da.penghasilan_perbulan_ayah,
                    da.berkebutuhan_khusus_ayah,
                    di.nama_ibu,
                    di.nik_ibu,
                    di.tempat_lahir_ibu,
                    di.tanggal_lahir_ibu,
                    di.nomor_telepon_ibu,
                    di.pendidikan_terakhir_ibu,
                    di.pekerjaan_ibu,
                    di.penghasilan_perbulan_ibu,
                    di.berkebutuhan_khusus_ibu,
                    dw.nama_wali,
                    dw.nik_wali,
                    dw.tempat_lahir_wali,
                    dw.tanggal_lahir_wali,
                    dw.nomor_telepon_wali,
                    dw.pendidikan_terakhir_wali,
                    dw.pekerjaan_wali,
                    dw.penghasilan_perbulan_wali,
                    dpe.tinggi_badan,
                    dpe.berat_badan,
                    dpe.jarak_tempuh_ke_sekolah,
                    dpe.waktu_tempuh_ke_sekolah,
                    dpe.jumlah_saudara_kandung,
                    rpd.jenis_pendaftaran,
                    rpd.tanggal_masuk_sekolah,
                    rpd.asal_sekolah,
                    rpd.nomor_peserta_ujian,
                    rpd.no_seri_ijazah,
                    rpd.no_seri_skhus
                ORDER BY f.no_formulir ASC
            `;
            const [rows] = await db.execute(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getJurusanStats() {
        try {
            const query = `
                SELECT 
                    j.id_jurusan,
                    j.jurusan,
                    j.kode,
                    f.no_formulir,
                    COUNT(DISTINCT u.id_user) as total_cpdb
                FROM jurusan j
                LEFT JOIN pembayaran_pendaftaran p ON j.id_jurusan = p.id_jurusan
                LEFT JOIN formulir f ON p.id_formulir = f.id_formulir
                LEFT JOIN users u ON f.id_user = u.id_user
                LEFT JOIN detail_pembayaran_pendaftaran d ON p.id_pembayaran = d.id_pembayaran
                WHERE u.roles = 'CPDB'
                AND EXISTS (
                    SELECT 1 
                    FROM detail_pembayaran_pendaftaran d2 
                    WHERE d2.id_pembayaran = p.id_pembayaran 
                    AND d2.status_verifikasi = 'VERIFIED'
                )
                GROUP BY j.id_jurusan, j.jurusan, j.kode, f.no_formulir
                ORDER BY j.jurusan
            `;
            const [rows] = await db.execute(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async exportToExcel() {
        try {
            const query = `
                SELECT DISTINCT
                    u.nama_lengkap,
                    u.nisn,
                    u.nik,
                    f.no_formulir,
                    u.asal_smp,
                    u.nomor_whatsapp,
                    u.jenis_kelamin,
                    j.jurusan,
                    j.kode,
                    COALESCE(SUM(d.nominal_pembayaran), 0) as nominal_pembayaran,
                    p.status_pelunasan,
                    DATE_FORMAT(u.tanggal_daftar, '%d/%m/%Y') as tanggal_daftar,
                    
                    -- Data Pribadi
                    dp.tempat_lahir,
                    dp.tanggal_lahir,
                    dp.no_registrasi_akta_lahir,
                    dp.agama,
                    dp.kewarganegaraan,
                    dp.berkebutuhan_khusus,
                    dp.alamat_jalan,
                    dp.rt,
                    dp.rw,
                    dp.nama_dusun,
                    dp.nama_kelurahan,
                    dp.kecamatan,
                    dp.kode_pos,
                    dp.nomor_telepon,
                    dp.email,
                    dp.mode_transportasi,
                    dp.nomor_kks,
                    dp.anak_keberapa,
                    
                    -- Data Ayah
                    da.nama_ayah,
                    da.nik_ayah,
                    da.tempat_lahir_ayah,
                    da.tanggal_lahir_ayah,
                    da.nomor_telepon_ayah,
                    da.pendidikan_terakhir as pendidikan_ayah,
                    da.pekerjaan_ayah,
                    da.penghasilan_perbulan_ayah,
                    da.berkebutuhan_khusus_ayah,
                    
                    -- Data Ibu
                    di.nama_ibu,
                    di.nik_ibu,
                    di.tempat_lahir_ibu,
                    di.tanggal_lahir_ibu,
                    di.nomor_telepon_ibu,
                    di.pendidikan_terakhir_ibu,
                    di.pekerjaan_ibu,
                    di.penghasilan_perbulan_ibu,
                    di.berkebutuhan_khusus_ibu,
                    
                    -- Data Wali
                    dw.nama_wali,
                    dw.nik_wali,
                    dw.tempat_lahir_wali,
                    dw.tanggal_lahir_wali,
                    dw.nomor_telepon_wali,
                    dw.pendidikan_terakhir_wali,
                    dw.pekerjaan_wali,
                    dw.penghasilan_perbulan_wali,
                    
                    -- Data Periodik
                    dpe.tinggi_badan,
                    dpe.berat_badan,
                    dpe.jarak_tempuh_ke_sekolah,
                    dpe.waktu_tempuh_ke_sekolah,
                    dpe.jumlah_saudara_kandung,
                    
                    -- Registrasi Peserta Didik
                    rpd.jenis_pendaftaran,
                    rpd.tanggal_masuk_sekolah,
                    rpd.asal_sekolah,
                    rpd.nomor_peserta_ujian,
                    rpd.no_seri_ijazah,
                    rpd.no_seri_skhus

                FROM users u
                JOIN formulir f ON u.id_user = f.id_user
                JOIN pembayaran_pendaftaran p ON f.id_formulir = p.id_formulir
                JOIN jurusan j ON p.id_jurusan = j.id_jurusan
                JOIN detail_pembayaran_pendaftaran d ON p.id_pembayaran = d.id_pembayaran
                LEFT JOIN data_pribadi dp ON f.id_formulir = dp.id_formulir
                LEFT JOIN data_ayah da ON f.id_formulir = da.id_formulir
                LEFT JOIN data_ibu di ON f.id_formulir = di.id_formulir
                LEFT JOIN data_wali dw ON f.id_formulir = dw.id_formulir
                LEFT JOIN data_periodik dpe ON f.id_formulir = dpe.id_formulir
                LEFT JOIN registrasi_peserta_didik rpd ON f.id_formulir = rpd.id_formulir
                WHERE u.roles = 'CPDB'
                AND EXISTS (
                    SELECT 1 
                    FROM detail_pembayaran_pendaftaran d2 
                    WHERE d2.id_pembayaran = p.id_pembayaran 
                    AND d2.status_verifikasi = 'VERIFIED'
                )
                GROUP BY 
                    u.id_user,
                    f.no_formulir,
                    j.jurusan,
                    j.kode,
                    p.status_pelunasan,
                    dp.tempat_lahir,
                    dp.tanggal_lahir,
                    dp.no_registrasi_akta_lahir,
                    dp.agama,
                    dp.kewarganegaraan,
                    dp.berkebutuhan_khusus,
                    dp.alamat_jalan,
                    dp.rt,
                    dp.rw,
                    dp.nama_dusun,
                    dp.nama_kelurahan,
                    dp.kecamatan,
                    dp.kode_pos,
                    dp.nomor_telepon,
                    dp.email,
                    dp.mode_transportasi,
                    dp.nomor_kks,
                    dp.anak_keberapa,
                    da.nama_ayah,
                    da.nik_ayah,
                    da.tempat_lahir_ayah,
                    da.tanggal_lahir_ayah,
                    da.nomor_telepon_ayah,
                    da.pendidikan_terakhir,
                    da.pekerjaan_ayah,
                    da.penghasilan_perbulan_ayah,
                    da.berkebutuhan_khusus_ayah,
                    di.nama_ibu,
                    di.nik_ibu,
                    di.tempat_lahir_ibu,
                    di.tanggal_lahir_ibu,
                    di.nomor_telepon_ibu,
                    di.pendidikan_terakhir_ibu,
                    di.pekerjaan_ibu,
                    di.penghasilan_perbulan_ibu,
                    di.berkebutuhan_khusus_ibu,
                    dw.nama_wali,
                    dw.nik_wali,
                    dw.tempat_lahir_wali,
                    dw.tanggal_lahir_wali,
                    dw.nomor_telepon_wali,
                    dw.pendidikan_terakhir_wali,
                    dw.pekerjaan_wali,
                    dw.penghasilan_perbulan_wali,
                    dpe.tinggi_badan,
                    dpe.berat_badan,
                    dpe.jarak_tempuh_ke_sekolah,
                    dpe.waktu_tempuh_ke_sekolah,
                    dpe.jumlah_saudara_kandung,
                    rpd.jenis_pendaftaran,
                    rpd.tanggal_masuk_sekolah,
                    rpd.asal_sekolah,
                    rpd.nomor_peserta_ujian,
                    rpd.no_seri_ijazah,
                    rpd.no_seri_skhus
                ORDER BY j.jurusan, u.nama_lengkap
            `;
            const [rows] = await db.execute(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CPDBTetap;
