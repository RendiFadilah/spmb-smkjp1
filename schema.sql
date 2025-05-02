-- Migration File: migration_ppdb.sql
-- Dibuat untuk aplikasi Node.js / EJS

-- db : ppdb-smkjt1

-- 1. Tabel Users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id_user` int(11) NOT NULL AUTO_INCREMENT,
    `nama_lengkap` varchar(255) NOT NULL,
    `nomor_whatsapp` varchar(20) NOT NULL,
    `nisn` varchar(10) DEFAULT NULL,
    `nik` varchar(20) DEFAULT NULL,
    `asal_smp` varchar(255) DEFAULT NULL,
    `jenis_kelamin` enum('Laki-laki','Perempuan') NOT NULL,
    `password` varchar(255) NOT NULL,
    `raw_password` varchar(255) DEFAULT NULL,
    `roles` enum('Admin','Bendahara','Petugas','CPDB') NOT NULL DEFAULT 'CPDB',
    `tanggal_daftar` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `status_wawancara` enum('Sudah','Belum') NOT NULL DEFAULT 'Belum',
    PRIMARY KEY (`id_user`),
    UNIQUE KEY `nomor_whatsapp` (`nomor_whatsapp`),
    UNIQUE KEY `nisn` (`nisn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 2. Tabel Kode Pembayaran
DROP TABLE IF EXISTS `kode_pembayaran`;
CREATE TABLE `kode_pembayaran` (
    `id_kode_pembayaran` int(11) NOT NULL AUTO_INCREMENT,
    `kode_bayar` varchar(15) NOT NULL,
    `status` enum('Belum Terpakai','Sudah Terpakai') NOT NULL,
    PRIMARY KEY (`id_kode_pembayaran`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 3. Tabel Formulir
DROP TABLE IF EXISTS `formulir`;
CREATE TABLE `formulir` (
    `id_formulir` int(11) NOT NULL AUTO_INCREMENT,
    `id_user` int(11) NOT NULL,
    `id_kode_pembayaran` int(11) NOT NULL,
    `no_formulir` int(11) NOT NULL,
    `tanggal` datetime NOT NULL,
    `nominal_formulir` decimal(10,2) NOT NULL,
    `bukti_bayar` varchar(255) DEFAULT NULL,
    `status` enum('Proses','Terverifikasi') NOT NULL DEFAULT 'Proses',
    `verifikator` varchar(100) DEFAULT NULL,
    `status_formulir` enum('Belum Lengkap','Sudah Lengkap') DEFAULT 'Belum Lengkap',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_formulir`),
    KEY `formulir_ibfk_1` (`id_user`),
    KEY `formulir_ibfk_2` (`id_kode_pembayaran`),
    CONSTRAINT `formulir_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `formulir_ibfk_2` FOREIGN KEY (`id_kode_pembayaran`) REFERENCES `kode_pembayaran` (`id_kode_pembayaran`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 4. Tabel Berkas
DROP TABLE IF EXISTS `berkas`;
CREATE TABLE `berkas` (
    `id_berkas` int(11) NOT NULL AUTO_INCREMENT,
    `id_formulir` int(11) NOT NULL,
    `nama_file` text,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_berkas`),
    KEY `berkas_ibfk_1` (`id_formulir`),
    CONSTRAINT `berkas_ibfk_1` FOREIGN KEY (`id_formulir`) REFERENCES `formulir` (`id_formulir`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 5. Tabel Data Ayah
DROP TABLE IF EXISTS `data_ayah`;
CREATE TABLE `data_ayah` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `id_formulir` int(11) NOT NULL,
    `nama_ayah` varchar(255) NOT NULL,
    `nik_ayah` varchar(20) DEFAULT NULL,
    `tempat_lahir_ayah` varchar(100) NOT NULL,
    `tanggal_lahir_ayah` date NOT NULL,
    `nomor_telepon_ayah` varchar(20) NOT NULL,
    `pendidikan_terakhir` enum('Putus SD','Paket A','SD /Sederajat','SMP / Sederajat','SMA / Sederajat','D1','D3','D4','S1','S2','S3','Tidak Sekolah') NOT NULL,
    `pekerjaan_ayah` enum('Buruh','Karyawan Swasta','Pedagang Besar','Pedagang Kecil','Petani','PNS/TNI/Polri','Sudah Meninggal','Wiraswasta','Wirausaha','Tidak Bekerja','Lainnya') NOT NULL,
    `penghasilan_perbulan_ayah` enum('Kurang dari Rp. 500,000','Rp. 500,000 - Rp. 999,999','Rp. 1,000,000 - Rp. 1,999,999','Rp. 2,000,000 - Rp. 4,999,999','Rp. 5,000,000 - Rp 20,000,000','Tidak Berpenghasilan') NOT NULL,
    `berkebutuhan_khusus_ayah` enum('Iya','Tidak') NOT NULL,
    PRIMARY KEY (`id`),
    KEY `data_ayah_ibfk_1` (`id_formulir`),
    CONSTRAINT `data_ayah_ibfk_1` FOREIGN KEY (`id_formulir`) REFERENCES `formulir` (`id_formulir`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 6. Tabel Data Ibu
DROP TABLE IF EXISTS `data_ibu`;
CREATE TABLE `data_ibu` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `id_formulir` int(11) NOT NULL,
    `nama_ibu` varchar(255) NOT NULL,
    `nik_ibu` varchar(20) DEFAULT NULL,
    `tempat_lahir_ibu` varchar(100) NOT NULL,
    `tanggal_lahir_ibu` date NOT NULL,
    `nomor_telepon_ibu` varchar(20) NOT NULL,
    `pendidikan_terakhir_ibu` enum('Putus SD','Paket A','SD /Sederajat','SMP / Sederajat','SMA / Sederajat','D1','D3','D4','S1','S2','S3','Tidak Sekolah') NOT NULL,
    `pekerjaan_ibu` enum('Buruh','Karyawan Swasta','Pedagang Besar','Pedagang Kecil','Petani','PNS/TNI/Polri','Sudah Meninggal','Wiraswasta','Wirausaha','Tidak Bekerja','Lainnya') NOT NULL,
    `penghasilan_perbulan_ibu` enum('Kurang dari Rp. 500,000','Rp. 500,000 - Rp. 999,999','Rp. 1,000,000 - Rp. 1,999,999','Rp. 2,000,000 - Rp. 4,999,999','Rp. 5,000,000 - Rp 20,000,000','Tidak Berpenghasilan') NOT NULL,
    `berkebutuhan_khusus_ibu` enum('Iya','Tidak') NOT NULL,
    PRIMARY KEY (`id`),
    KEY `data_ibu_ibfk_1` (`id_formulir`),
    CONSTRAINT `data_ibu_ibfk_1` FOREIGN KEY (`id_formulir`) REFERENCES `formulir` (`id_formulir`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 7. Tabel Data Periodik
DROP TABLE IF EXISTS `data_periodik`;
CREATE TABLE `data_periodik` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `id_formulir` int(11) NOT NULL,
    `tinggi_badan` int(11) DEFAULT NULL,
    `berat_badan` int(11) DEFAULT NULL,
    `jarak_tempuh_ke_sekolah` decimal(5,2) DEFAULT NULL,
    `waktu_tempuh_ke_sekolah` varchar(20) DEFAULT NULL,
    `jumlah_saudara_kandung` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `data_periodik_ibfk_1` (`id_formulir`),
    CONSTRAINT `data_periodik_ibfk_1` FOREIGN KEY (`id_formulir`) REFERENCES `formulir` (`id_formulir`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 8. Tabel Data Pribadi
DROP TABLE IF EXISTS `data_pribadi`;
CREATE TABLE `data_pribadi` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `id_formulir` int(11) NOT NULL,
    `nama_lengkap` varchar(255) NOT NULL,
    `jenis_kelamin` enum('Laki-laki','Perempuan') NOT NULL,
    `nisn` varchar(20) NOT NULL,
    `nik` varchar(20) DEFAULT NULL,
    `tempat_lahir` varchar(100) NOT NULL,
    `tanggal_lahir` date NOT NULL,
    `no_registrasi_akta_lahir` varchar(50) DEFAULT NULL,
    `agama` enum('Islam','Kristen Protestan','Katolik','Buddha','Hindu','Konghucu','Kepercayaan') NOT NULL,
    `kewarganegaraan` varchar(50) NOT NULL,
    `berkebutuhan_khusus` enum('Iya','Tidak') NOT NULL,
    `alamat_jalan` varchar(255) NOT NULL,
    `rt` varchar(10) NOT NULL,
    `rw` varchar(10) NOT NULL,
    `nama_dusun` varchar(100) NOT NULL,
    `nama_kelurahan` varchar(100) NOT NULL,
    `kecamatan` varchar(100) NOT NULL,
    `kode_pos` varchar(10) NOT NULL,
    `nomor_telepon` varchar(20) NOT NULL,
    `email` varchar(100) NOT NULL,
    `mode_transportasi` varchar(50) DEFAULT NULL,
    `nomor_kks` varchar(50) DEFAULT NULL,
    `anak_keberapa` int(11) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `data_pribadi_ibfk_1` (`id_formulir`),
    CONSTRAINT `data_pribadi_ibfk_1` FOREIGN KEY (`id_formulir`) REFERENCES `formulir` (`id_formulir`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 9. Tabel Data Wali
DROP TABLE IF EXISTS `data_wali`;
CREATE TABLE `data_wali` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `id_formulir` int(11) NOT NULL,
    `nama_wali` varchar(255) DEFAULT NULL,
    `nik_wali` varchar(20) DEFAULT NULL,
    `tempat_lahir_wali` varchar(100) DEFAULT NULL,
    `tanggal_lahir_wali` date DEFAULT NULL,
    `nomor_telepon_wali` varchar(20) DEFAULT NULL,
    `pendidikan_terakhir_wali` enum('Putus SD','Paket A','SD /Sederajat','SMP / Sederajat','SMA / Sederajat','D1','D3','D4','S1','S2','S3','Tidak Sekolah') DEFAULT NULL,
    `pekerjaan_wali` enum('Buruh','Karyawan Swasta','Pedagang Besar','Pedagang Kecil','Petani','PNS/TNI/Polri','Sudah Meninggal','Wiraswasta','Wirausaha','Tidak Bekerja','Lainnya') DEFAULT NULL,
    `penghasilan_perbulan_wali` enum('Kurang dari Rp. 500,000','Rp. 500,000 - Rp. 999,999','Rp. 1,000,000 - Rp. 1,999,999','Rp. 2,000,000 - Rp. 4,999,999','Rp. 5,000,000 - Rp 20,000,000','Tidak Berpenghasilan') DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `data_wali_ibfk_1` (`id_formulir`),
    CONSTRAINT `data_wali_ibfk_1` FOREIGN KEY (`id_formulir`) REFERENCES `formulir` (`id_formulir`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 10. Tabel Pembayaran Pendaftaran
DROP TABLE IF EXISTS `pembayaran_pendaftaran`;
CREATE TABLE `pembayaran_pendaftaran` (
    `id_pembayaran` int(11) NOT NULL AUTO_INCREMENT,
    `id_formulir` int(11) NOT NULL,
    `id_jurusan` int(11) NOT NULL,
    `total_biaya` decimal(10,2) NOT NULL,
    `sisa_pembayaran` decimal(10,2) NOT NULL,
    `status_pelunasan` enum('BELUM_LUNAS','LUNAS') DEFAULT 'BELUM_LUNAS',
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_pembayaran`),
    KEY `id_formulir` (`id_formulir`),
    KEY `id_jurusan` (`id_jurusan`),
    CONSTRAINT `pembayaran_pendaftaran_ibfk_1` FOREIGN KEY (`id_formulir`) REFERENCES `formulir` (`id_formulir`) ON DELETE CASCADE ON UPDATE CASCADE
    -- Constraint untuk id_jurusan akan ditambahkan setelah tabel jurusan dibuat
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 11. Tabel Jurusan
DROP TABLE IF EXISTS `jurusan`;
CREATE TABLE `jurusan` (
    `id_jurusan` int(11) NOT NULL AUTO_INCREMENT,
    `jurusan` varchar(100) NOT NULL,
    `kode` varchar(100) NOT NULL,
    `kapasitas` int(11) NOT NULL,
    PRIMARY KEY (`id_jurusan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Setelah pembuatan tabel jurusan, tambahkan constraint untuk id_jurusan pada tabel pembayaran_pendaftaran
ALTER TABLE `pembayaran_pendaftaran`
    ADD CONSTRAINT `pembayaran_pendaftaran_ibfk_3` FOREIGN KEY (`id_jurusan`) REFERENCES `jurusan` (`id_jurusan`);

-- 12. Tabel Master Biaya Jurusan
DROP TABLE IF EXISTS `master_biaya_jurusan`;
CREATE TABLE `master_biaya_jurusan` (
    `id_biaya` int(11) NOT NULL AUTO_INCREMENT,
    `id_jurusan` int(11) NOT NULL,
    `tahun_ajaran` varchar(10) NOT NULL,
    `total_biaya` decimal(10,2) NOT NULL,
    `minimal_pembayaran` decimal(10,2) NOT NULL,
    `keterangan` text,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_biaya`),
    KEY `id_jurusan` (`id_jurusan`),
    CONSTRAINT `master_biaya_jurusan_ibfk_1` FOREIGN KEY (`id_jurusan`) REFERENCES `jurusan` (`id_jurusan`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 13. Tabel Registrasi Peserta Didik
DROP TABLE IF EXISTS `registrasi_peserta_didik`;
CREATE TABLE `registrasi_peserta_didik` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `id_formulir` int(11) NOT NULL,
    `jurusan` int(11) NOT NULL,
    `jenis_pendaftaran` enum('Siswa Baru','Pindahan','Kembali Bersekolah') NOT NULL,
    `tanggal_masuk_sekolah` date NOT NULL,
    `asal_sekolah` varchar(255) NOT NULL,
    `nomor_peserta_ujian` varchar(20) DEFAULT NULL,
    `no_seri_ijazah` varchar(20) DEFAULT NULL,
    `no_seri_skhus` varchar(20) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `registrasi_peserta_didik_ibfk_1` (`id_formulir`),
    KEY `registrasi_peserta_didik_ibfk_2` (`jurusan`),
    CONSTRAINT `registrasi_peserta_didik_ibfk_1` FOREIGN KEY (`id_formulir`) REFERENCES `formulir` (`id_formulir`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `registrasi_peserta_didik_ibfk_2` FOREIGN KEY (`jurusan`) REFERENCES `jurusan` (`id_jurusan`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 14. Tabel Detail Pembayaran Pendaftaran
DROP TABLE IF EXISTS `detail_pembayaran_pendaftaran`;
CREATE TABLE `detail_pembayaran_pendaftaran` (
    `id_detail` int(11) NOT NULL AUTO_INCREMENT,
    `id_pembayaran` int(11) NOT NULL,
    `tanggal_pembayaran` datetime NOT NULL,
    `metode_pembayaran` enum('TRANSFER','TUNAI') NOT NULL,
    `nama_pengirim` varchar(255) DEFAULT NULL,
    `nominal_pembayaran` decimal(10,2) NOT NULL,
    `bukti_pembayaran` varchar(255) DEFAULT NULL,
    `status_verifikasi` enum('PENDING','VERIFIED','REJECTED') DEFAULT 'PENDING',
    `nama_verifikator` varchar(255) DEFAULT NULL,
    `catatan_verifikasi` text,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_detail`),
    KEY `id_pembayaran` (`id_pembayaran`),
    CONSTRAINT `detail_pembayaran_pendaftaran_ibfk_1` FOREIGN KEY (`id_pembayaran`) REFERENCES `pembayaran_pendaftaran` (`id_pembayaran`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 15. Tabel Rewards
DROP TABLE IF EXISTS `rewards`;
CREATE TABLE `rewards` (
    `id_reward` int(11) NOT NULL AUTO_INCREMENT,
    `tanggal_reward` datetime NOT NULL,
    `id_pembayaran` int(11) NOT NULL,
    `nama_pembawa` varchar(100) NOT NULL,
    `keterangan_pembawa` varchar(100) NOT NULL,
    `no_wa_pembawa` bigint(20) NOT NULL,
    `nominal` int(11) NOT NULL,
    `nama_petugas` varchar(50) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_reward`),
    KEY `id_pembayaran` (`id_pembayaran`),
    CONSTRAINT `rewards_ibfk_1` FOREIGN KEY (`id_pembayaran`) REFERENCES `pembayaran_pendaftaran` (`id_pembayaran`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. Tabel Seragam
DROP TABLE IF EXISTS `seragam`;
CREATE TABLE `seragam` (
    `id_seragam` int(11) NOT NULL AUTO_INCREMENT,
    `tanggal_pemberian` date NOT NULL,
    `id_pembayaran` int(11) NOT NULL,
    `seragam_batik` enum('Sudah','Belum') DEFAULT NULL,
    `seragam_olahraga` enum('Sudah','Belum') DEFAULT NULL,
    `seragam_muslim` enum('Sudah','Belum') DEFAULT NULL,
    `ukuran_baju` enum('S','M','L','XL','XXL','XXXL') DEFAULT NULL,
    `topi` enum('Sudah','Belum') DEFAULT NULL,
    `dasi` enum('Sudah','Belum') DEFAULT NULL,
    `kerudung` enum('Sudah','Belum') DEFAULT NULL,
    `bet` enum('Sudah','Belum') DEFAULT NULL,
    `lokasi` enum('Sudah','Belum') DEFAULT NULL,
    `nama_petugas` varchar(100) DEFAULT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_seragam`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
