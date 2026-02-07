-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 05 Bulan Mei 2025 pada 09.54
-- Versi server: 5.7.24
-- Versi PHP: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spmb-smkjp1`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `berkas`
--

CREATE TABLE `berkas` (
  `id_berkas` int(11) NOT NULL,
  `id_formulir` int(11) NOT NULL,
  `nama_file` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data untuk tabel `berkas`
--

INSERT INTO `berkas` (`id_berkas`, `id_formulir`, `nama_file`, `created_at`, `updated_at`) VALUES
(2, 2, NULL, '2025-05-05 13:27:11', '2025-05-05 13:27:11');

-- --------------------------------------------------------

--
-- Struktur dari tabel `data_ayah`
--

CREATE TABLE `data_ayah` (
  `id` int(11) NOT NULL,
  `id_formulir` int(11) NOT NULL,
  `nama_ayah` varchar(255) NOT NULL,
  `nik_ayah` varchar(20) DEFAULT NULL,
  `tempat_lahir_ayah` varchar(100) NOT NULL,
  `tanggal_lahir_ayah` date NOT NULL,
  `nomor_telepon_ayah` varchar(20) NOT NULL,
  `pendidikan_terakhir` enum('Putus SD','Paket A','SD /Sederajat','SMP / Sederajat','SMA / Sederajat','D1','D3','D4','S1','S2','S3','Tidak Sekolah') NOT NULL,
  `pekerjaan_ayah` enum('Buruh','Karyawan Swasta','Pedagang Besar','Pedagang Kecil','Petani','PNS/TNI/Polri','Sudah Meninggal','Wiraswasta','Wirausaha','Tidak Bekerja','Lainnya') NOT NULL,
  `penghasilan_perbulan_ayah` enum('Kurang dari Rp. 500,000','Rp. 500,000 - Rp. 999,999','Rp. 1,000,000 - Rp. 1,999,999','Rp. 2,000,000 - Rp. 4,999,999','Rp. 5,000,000 - Rp 20,000,000','Tidak Berpenghasilan') NOT NULL,
  `berkebutuhan_khusus_ayah` enum('Iya','Tidak') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data untuk tabel `data_ayah`
--

INSERT INTO `data_ayah` (`id`, `id_formulir`, `nama_ayah`, `nik_ayah`, `tempat_lahir_ayah`, `tanggal_lahir_ayah`, `nomor_telepon_ayah`, `pendidikan_terakhir`, `pekerjaan_ayah`, `penghasilan_perbulan_ayah`, `berkebutuhan_khusus_ayah`) VALUES
(2, 2, 'Sukandar', '31717101230', '1', '2025-05-05', '1', 'SD /Sederajat', 'Wirausaha', 'Rp. 1,000,000 - Rp. 1,999,999', 'Tidak');

-- --------------------------------------------------------

--
-- Struktur dari tabel `data_ibu`
--

CREATE TABLE `data_ibu` (
  `id` int(11) NOT NULL,
  `id_formulir` int(11) NOT NULL,
  `nama_ibu` varchar(255) NOT NULL,
  `nik_ibu` varchar(20) DEFAULT NULL,
  `tempat_lahir_ibu` varchar(100) NOT NULL,
  `tanggal_lahir_ibu` date NOT NULL,
  `nomor_telepon_ibu` varchar(20) NOT NULL,
  `pendidikan_terakhir_ibu` enum('Putus SD','Paket A','SD /Sederajat','SMP / Sederajat','SMA / Sederajat','D1','D3','D4','S1','S2','S3','Tidak Sekolah') NOT NULL,
  `pekerjaan_ibu` enum('Buruh','Karyawan Swasta','Pedagang Besar','Pedagang Kecil','Petani','PNS/TNI/Polri','Sudah Meninggal','Wiraswasta','Wirausaha','Tidak Bekerja','Lainnya') NOT NULL,
  `penghasilan_perbulan_ibu` enum('Kurang dari Rp. 500,000','Rp. 500,000 - Rp. 999,999','Rp. 1,000,000 - Rp. 1,999,999','Rp. 2,000,000 - Rp. 4,999,999','Rp. 5,000,000 - Rp 20,000,000','Tidak Berpenghasilan') NOT NULL,
  `berkebutuhan_khusus_ibu` enum('Iya','Tidak') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data untuk tabel `data_ibu`
--

INSERT INTO `data_ibu` (`id`, `id_formulir`, `nama_ibu`, `nik_ibu`, `tempat_lahir_ibu`, `tanggal_lahir_ibu`, `nomor_telepon_ibu`, `pendidikan_terakhir_ibu`, `pekerjaan_ibu`, `penghasilan_perbulan_ibu`, `berkebutuhan_khusus_ibu`) VALUES
(2, 2, '1', '1', '1', '2025-05-05', '1', 'D1', 'Wiraswasta', 'Rp. 500,000 - Rp. 999,999', 'Tidak');

-- --------------------------------------------------------

--
-- Struktur dari tabel `data_periodik`
--

CREATE TABLE `data_periodik` (
  `id` int(11) NOT NULL,
  `id_formulir` int(11) NOT NULL,
  `tinggi_badan` int(11) DEFAULT NULL,
  `berat_badan` int(11) DEFAULT NULL,
  `jarak_tempuh_ke_sekolah` decimal(5,2) DEFAULT NULL,
  `waktu_tempuh_ke_sekolah` varchar(20) DEFAULT NULL,
  `jumlah_saudara_kandung` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data untuk tabel `data_periodik`
--

INSERT INTO `data_periodik` (`id`, `id_formulir`, `tinggi_badan`, `berat_badan`, `jarak_tempuh_ke_sekolah`, `waktu_tempuh_ke_sekolah`, `jumlah_saudara_kandung`) VALUES
(2, 2, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `data_pribadi`
--

CREATE TABLE `data_pribadi` (
  `id` int(11) NOT NULL,
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
  `anak_keberapa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data untuk tabel `data_pribadi`
--

INSERT INTO `data_pribadi` (`id`, `id_formulir`, `nama_lengkap`, `jenis_kelamin`, `nisn`, `nik`, `tempat_lahir`, `tanggal_lahir`, `no_registrasi_akta_lahir`, `agama`, `kewarganegaraan`, `berkebutuhan_khusus`, `alamat_jalan`, `rt`, `rw`, `nama_dusun`, `nama_kelurahan`, `kecamatan`, `kode_pos`, `nomor_telepon`, `email`, `mode_transportasi`, `nomor_kks`, `anak_keberapa`) VALUES
(2, 2, 'Rendi Fadilahahahaha', 'Laki-laki', '0031654632', '31710100505030004', 'Jekardah', '2003-05-05', '1', 'Islam', 'Indonesia', 'Iya', 'Jl. Petojo Utara V No. 13', '002', '003', 'Jakarta Pusat', 'Petojo Utara', 'Gambir', '10130', '081806673639', 'rendifdl@gmail.com', 'Jalan Kaki', '1', 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `data_wali`
--

CREATE TABLE `data_wali` (
  `id` int(11) NOT NULL,
  `id_formulir` int(11) NOT NULL,
  `nama_wali` varchar(255) DEFAULT NULL,
  `nik_wali` varchar(20) DEFAULT NULL,
  `tempat_lahir_wali` varchar(100) DEFAULT NULL,
  `tanggal_lahir_wali` date DEFAULT NULL,
  `nomor_telepon_wali` varchar(20) DEFAULT NULL,
  `pendidikan_terakhir_wali` enum('Putus SD','Paket A','SD /Sederajat','SMP / Sederajat','SMA / Sederajat','D1','D3','D4','S1','S2','S3','Tidak Sekolah') DEFAULT NULL,
  `pekerjaan_wali` enum('Buruh','Karyawan Swasta','Pedagang Besar','Pedagang Kecil','Petani','PNS/TNI/Polri','Sudah Meninggal','Wiraswasta','Wirausaha','Tidak Bekerja','Lainnya') DEFAULT NULL,
  `penghasilan_perbulan_wali` enum('Kurang dari Rp. 500,000','Rp. 500,000 - Rp. 999,999','Rp. 1,000,000 - Rp. 1,999,999','Rp. 2,000,000 - Rp. 4,999,999','Rp. 5,000,000 - Rp 20,000,000','Tidak Berpenghasilan') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data untuk tabel `data_wali`
--

INSERT INTO `data_wali` (`id`, `id_formulir`, `nama_wali`, `nik_wali`, `tempat_lahir_wali`, `tanggal_lahir_wali`, `nomor_telepon_wali`, `pendidikan_terakhir_wali`, `pekerjaan_wali`, `penghasilan_perbulan_wali`) VALUES
(2, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `detail_pembayaran_pendaftaran`
--

CREATE TABLE `detail_pembayaran_pendaftaran` (
  `id_detail` int(11) NOT NULL,
  `id_pembayaran` int(11) NOT NULL,
  `id_periode_bayar` int(11) NOT NULL,
  `tanggal_pembayaran` datetime NOT NULL,
  `metode_pembayaran` enum('TRANSFER','TUNAI') NOT NULL,
  `nama_pengirim` varchar(255) DEFAULT NULL,
  `nominal_pembayaran` decimal(10,2) NOT NULL,
  `bukti_pembayaran` varchar(255) DEFAULT NULL,
  `status_verifikasi` enum('PENDING','VERIFIED','REJECTED') DEFAULT 'PENDING',
  `nama_verifikator` varchar(255) DEFAULT NULL,
  `catatan_verifikasi` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktur dari tabel `diskon_periode`
--

CREATE TABLE `diskon_periode` (
  `id_diskon` int(11) NOT NULL,
  `id_periode` int(11) NOT NULL,
  `id_jurusan` int(11) NOT NULL,
  `nominal_diskon` decimal(10,2) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data untuk tabel `diskon_periode`
--

INSERT INTO `diskon_periode` (`id_diskon`, `id_periode`, `id_jurusan`, `nominal_diskon`, `created_at`, `updated_at`) VALUES
(5, 7, 15, 750000.00, '2025-05-05 11:49:35', '2025-05-05 11:49:35'),
(6, 7, 17, 750000.00, '2025-05-05 11:49:35', '2025-05-05 11:49:35'),
(7, 7, 16, 750000.00, '2025-05-05 11:49:35', '2025-05-05 11:49:35'),
(8, 7, 14, 750000.00, '2025-05-05 11:49:35', '2025-05-05 11:49:35'),
(9, 6, 15, 1000000.00, '2025-05-05 11:52:37', '2025-05-05 11:52:37'),
(10, 6, 17, 1000000.00, '2025-05-05 11:52:37', '2025-05-05 11:52:37'),
(11, 6, 16, 1000000.00, '2025-05-05 11:52:37', '2025-05-05 11:52:37'),
(12, 6, 14, 1000000.00, '2025-05-05 11:52:37', '2025-05-05 11:52:37'),
(13, 8, 15, 500000.00, '2025-05-05 11:52:58', '2025-05-05 11:52:58'),
(14, 8, 17, 500000.00, '2025-05-05 11:52:58', '2025-05-05 11:52:58'),
(15, 8, 16, 500000.00, '2025-05-05 11:52:58', '2025-05-05 11:52:58'),
(16, 8, 14, 500000.00, '2025-05-05 11:52:58', '2025-05-05 11:52:58'),
(17, 9, 15, 0.00, '2025-05-05 11:53:10', '2025-05-05 11:53:10'),
(18, 9, 17, 0.00, '2025-05-05 11:53:10', '2025-05-05 11:53:10'),
(19, 9, 16, 0.00, '2025-05-05 11:53:10', '2025-05-05 11:53:10'),
(20, 9, 14, 0.00, '2025-05-05 11:53:10', '2025-05-05 11:53:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `formulir`
--

CREATE TABLE `formulir` (
  `id_formulir` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_kode_pembayaran` int(11) NOT NULL,
  `no_formulir` int(11) NOT NULL,
  `tanggal` datetime NOT NULL,
  `metode_pembayaran` enum('Tunai','Transfer') DEFAULT NULL,
  `nama_pengirim` varchar(100) DEFAULT NULL,
  `nominal_formulir` decimal(10,2) NOT NULL,
  `bukti_bayar` varchar(255) DEFAULT NULL,
  `status` enum('Proses','Terverifikasi') NOT NULL DEFAULT 'Proses',
  `verifikator` varchar(100) DEFAULT NULL,
  `status_formulir` enum('Belum Lengkap','Sudah Lengkap') DEFAULT 'Belum Lengkap',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data untuk tabel `formulir`
--

INSERT INTO `formulir` (`id_formulir`, `id_user`, `id_kode_pembayaran`, `no_formulir`, `tanggal`, `metode_pembayaran`, `nama_pengirim`, `nominal_formulir`, `bukti_bayar`, `status`, `verifikator`, `status_formulir`, `created_at`, `updated_at`) VALUES
(2, 21, 9, 101, '2025-05-05 13:05:35', 'Transfer', 'Renday', 100000.00, NULL, 'Terverifikasi', 'Renday Banget Ini', 'Sudah Lengkap', '2025-05-05 06:27:08', '2025-05-05 06:27:08');

-- --------------------------------------------------------

--
-- Struktur dari tabel `jurusan`
--

CREATE TABLE `jurusan` (
  `id_jurusan` int(11) NOT NULL,
  `jurusan` varchar(100) NOT NULL,
  `kode` varchar(100) NOT NULL,
  `kapasitas` int(11) NOT NULL,
  `sisa_kapasitas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data untuk tabel `jurusan`
--

INSERT INTO `jurusan` (`id_jurusan`, `jurusan`, `kode`, `kapasitas`, `sisa_kapasitas`) VALUES
(14, 'Rekayasa Perangkat Lunak', 'RPL', 70, 70),
(15, 'Akuntansi', 'AK', 35, 35),
(16, 'Manajemen Perkantoran', 'MP', 112, 112),
(17, 'Bisnis Retail', 'BR', 73, 73);

-- --------------------------------------------------------

--
-- Struktur dari tabel `kode_pembayaran`
--

CREATE TABLE `kode_pembayaran` (
  `id_kode_pembayaran` int(11) NOT NULL,
  `kode_bayar` varchar(15) NOT NULL,
  `status` enum('Belum Terpakai','Sudah Terpakai') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data untuk tabel `kode_pembayaran`
--

INSERT INTO `kode_pembayaran` (`id_kode_pembayaran`, `kode_bayar`, `status`) VALUES
(8, '9N9KDF', 'Sudah Terpakai'),
(9, 'OIFC8T', 'Sudah Terpakai'),
(10, 'A1BXRR', 'Belum Terpakai'),
(11, 'D46K15', 'Belum Terpakai'),
(12, 'MG96ON', 'Belum Terpakai'),
(13, 'FDWN9F', 'Belum Terpakai'),
(14, 'OMO9BH', 'Belum Terpakai'),
(15, '1KICVY', 'Belum Terpakai'),
(16, 'S7BD49', 'Belum Terpakai'),
(17, 'L4Q1QS', 'Belum Terpakai'),
(18, '05XL75', 'Belum Terpakai'),
(19, 'FOF0CP', 'Belum Terpakai'),
(20, 'G1EHL9', 'Belum Terpakai'),
(21, '87QWVJ', 'Belum Terpakai'),
(22, '4BYVHW', 'Belum Terpakai'),
(23, 'HL7272', 'Belum Terpakai'),
(24, 'TQ5UIQ', 'Belum Terpakai'),
(25, '1Q05NT', 'Belum Terpakai'),
(26, 'JC0LE8', 'Belum Terpakai'),
(27, '9OBKUM', 'Belum Terpakai'),
(28, '9Q2FEG', 'Belum Terpakai'),
(29, 'CHX5RP', 'Belum Terpakai'),
(30, 'ILBPQC', 'Belum Terpakai'),
(31, 'C1AH0B', 'Belum Terpakai'),
(32, '45BLA7', 'Belum Terpakai'),
(33, 'FEOFJG', 'Belum Terpakai'),
(34, 'BE3W11', 'Belum Terpakai'),
(35, '4Q7DVE', 'Belum Terpakai'),
(36, 'S7C2P8', 'Belum Terpakai'),
(37, '3S599P', 'Belum Terpakai'),
(38, 'MSK1NT', 'Belum Terpakai'),
(39, '9MOW2V', 'Belum Terpakai'),
(40, 'HX7K6D', 'Belum Terpakai'),
(41, 'XEPIG5', 'Belum Terpakai'),
(42, 'UH770E', 'Belum Terpakai'),
(43, '5CS766', 'Belum Terpakai'),
(44, 'VSEP9S', 'Belum Terpakai'),
(45, 'QEUU4A', 'Belum Terpakai'),
(46, 'ESHEOQ', 'Belum Terpakai'),
(47, 'KMJWKS', 'Belum Terpakai'),
(48, '9NEDQJ', 'Belum Terpakai'),
(49, '5F73YH', 'Belum Terpakai'),
(50, 'R2HM6P', 'Belum Terpakai'),
(51, '3K4LF7', 'Belum Terpakai'),
(52, 'PTV6XG', 'Belum Terpakai'),
(53, 'K76T4M', 'Belum Terpakai'),
(54, 'CN0AM9', 'Belum Terpakai'),
(55, '4TK2PN', 'Belum Terpakai'),
(56, 'MFR2XQ', 'Belum Terpakai'),
(57, 'V6MSX7', 'Belum Terpakai'),
(58, '18AXT6', 'Belum Terpakai'),
(59, 'ILPVML', 'Belum Terpakai'),
(60, '6ZKF4D', 'Belum Terpakai'),
(61, 'YJRSG2', 'Belum Terpakai'),
(62, '541VUK', 'Belum Terpakai'),
(63, 'TW8VPT', 'Belum Terpakai'),
(64, '86WELX', 'Belum Terpakai'),
(65, 'V26G14', 'Belum Terpakai'),
(66, '6M3ZX6', 'Belum Terpakai'),
(67, 'Q9PANN', 'Belum Terpakai'),
(68, 'RY1NLT', 'Belum Terpakai'),
(69, 'ZQUTIC', 'Belum Terpakai'),
(70, '4P74W9', 'Belum Terpakai'),
(71, '06OQ67', 'Belum Terpakai'),
(72, '1B896F', 'Belum Terpakai'),
(73, 'VG6VWY', 'Belum Terpakai'),
(74, 'B46DLR', 'Belum Terpakai'),
(75, '0N2KWC', 'Belum Terpakai'),
(76, '2NRIT9', 'Belum Terpakai'),
(77, 'XXL5JG', 'Belum Terpakai'),
(78, 'VOARJV', 'Belum Terpakai'),
(79, '3DJ7EK', 'Belum Terpakai'),
(80, 'BDFOWP', 'Belum Terpakai'),
(81, 'H53IUA', 'Belum Terpakai'),
(82, 'EBLRTQ', 'Belum Terpakai'),
(83, '3B1ZCE', 'Belum Terpakai'),
(84, '7KFCM4', 'Belum Terpakai'),
(85, 'R75Q78', 'Belum Terpakai'),
(86, '1HKYVW', 'Belum Terpakai'),
(87, 'GIUFRC', 'Belum Terpakai'),
(88, 'IKHN9H', 'Belum Terpakai'),
(89, 'JLHT3X', 'Belum Terpakai'),
(90, 'F2MCFS', 'Belum Terpakai'),
(91, '9OB017', 'Belum Terpakai'),
(92, 'X99WP9', 'Belum Terpakai'),
(93, 'AZWXGI', 'Belum Terpakai'),
(94, 'AS8Y9C', 'Belum Terpakai'),
(95, 'BTWGO4', 'Belum Terpakai'),
(96, 'T6EHGQ', 'Belum Terpakai'),
(97, '79DP7J', 'Belum Terpakai'),
(98, 'I2B3WF', 'Belum Terpakai'),
(99, 'KVBEZK', 'Belum Terpakai'),
(100, 'IHJWA2', 'Belum Terpakai'),
(101, '4GKENO', 'Belum Terpakai'),
(102, 'UGM9RZ', 'Belum Terpakai'),
(103, '31CLCW', 'Belum Terpakai'),
(104, 'MX09RB', 'Belum Terpakai'),
(105, 'ZBZ7W2', 'Belum Terpakai'),
(106, 'HS35RU', 'Belum Terpakai'),
(107, 'JGSDFX', 'Belum Terpakai'),
(108, 'MUSZEZ', 'Belum Terpakai'),
(109, '08NALF', 'Belum Terpakai'),
(110, 'YCGRNQ', 'Belum Terpakai'),
(111, 'TFC7IF', 'Belum Terpakai'),
(112, 'OZRZGW', 'Belum Terpakai'),
(113, 'UAVEXW', 'Belum Terpakai'),
(114, 'LAPUM9', 'Belum Terpakai'),
(115, 'I8JPVQ', 'Belum Terpakai'),
(116, '05VI4H', 'Belum Terpakai'),
(117, 'QVQI8K', 'Belum Terpakai'),
(118, 'JTGV6G', 'Belum Terpakai'),
(119, 'SOXH5M', 'Belum Terpakai'),
(120, 'JB1K26', 'Belum Terpakai'),
(121, 'NCN3IV', 'Belum Terpakai'),
(122, 'LCCXY1', 'Belum Terpakai'),
(123, 'R521ZS', 'Belum Terpakai'),
(124, 'R0V72R', 'Belum Terpakai'),
(125, 'GGBHND', 'Belum Terpakai'),
(126, '10GC7M', 'Belum Terpakai'),
(127, 'HHP0NI', 'Belum Terpakai'),
(128, 'NCA2ZB', 'Belum Terpakai'),
(129, '535RZE', 'Belum Terpakai'),
(130, 'NIN106', 'Belum Terpakai'),
(131, 'MWQSMK', 'Belum Terpakai'),
(132, 'OJ7C1O', 'Belum Terpakai'),
(133, 'RPUXXN', 'Belum Terpakai'),
(134, 'IVFX06', 'Belum Terpakai'),
(135, 'JUGHZ2', 'Belum Terpakai'),
(136, '5UIILM', 'Belum Terpakai'),
(137, 'FPWEFK', 'Belum Terpakai'),
(138, '0TWEJP', 'Belum Terpakai'),
(139, '2P8QWV', 'Belum Terpakai'),
(140, '70NDOM', 'Belum Terpakai'),
(141, 'GZ3AO0', 'Belum Terpakai'),
(142, 'QHZAVT', 'Belum Terpakai'),
(143, '5SIHIM', 'Belum Terpakai'),
(144, 'EYMQLF', 'Belum Terpakai'),
(145, 'QUHT51', 'Belum Terpakai'),
(146, 'XQA9N5', 'Belum Terpakai'),
(147, 'UH3T97', 'Belum Terpakai'),
(148, '8Q994S', 'Belum Terpakai'),
(149, 'AKQFNS', 'Belum Terpakai'),
(150, 'SLEUSL', 'Belum Terpakai'),
(151, 'R040SZ', 'Belum Terpakai'),
(152, 'WD7POP', 'Belum Terpakai'),
(153, 'JHLDNI', 'Belum Terpakai'),
(154, 'SP5S8V', 'Belum Terpakai'),
(155, '5ZKLHU', 'Belum Terpakai'),
(156, 'O4I3LM', 'Belum Terpakai'),
(157, '8K08DO', 'Belum Terpakai'),
(158, 'DVSFR4', 'Belum Terpakai'),
(159, '4GZQPU', 'Belum Terpakai'),
(160, 'A22EAH', 'Belum Terpakai'),
(161, 'XQDOJD', 'Belum Terpakai'),
(162, '9AZ0LC', 'Belum Terpakai'),
(163, '41YJQD', 'Belum Terpakai'),
(164, 'DN4MLT', 'Belum Terpakai'),
(165, 'CSNNWO', 'Belum Terpakai'),
(166, 'BWSTI8', 'Belum Terpakai'),
(167, 'S4GVAW', 'Belum Terpakai'),
(168, '994L2P', 'Belum Terpakai'),
(169, 'RNAVQL', 'Belum Terpakai'),
(170, 'M1BEZF', 'Belum Terpakai'),
(171, '6GT8WI', 'Belum Terpakai'),
(172, 'BBD6V7', 'Belum Terpakai'),
(173, 'HO2VX4', 'Belum Terpakai'),
(174, 'ODWHN3', 'Belum Terpakai'),
(175, '59SR4T', 'Belum Terpakai'),
(176, '6P7Z7M', 'Belum Terpakai'),
(177, 'PIC71U', 'Belum Terpakai'),
(178, 'FLUT1W', 'Belum Terpakai'),
(179, '7R6BGS', 'Belum Terpakai'),
(180, 'OML6PR', 'Belum Terpakai'),
(181, '6ITUFA', 'Belum Terpakai'),
(182, 'I6LLK9', 'Belum Terpakai'),
(183, 'MG0QIJ', 'Belum Terpakai'),
(184, '5L3QC9', 'Belum Terpakai'),
(185, '2HF52B', 'Belum Terpakai'),
(186, '9TUATY', 'Belum Terpakai'),
(187, 'NDJDDV', 'Belum Terpakai'),
(188, 'BD0E8M', 'Belum Terpakai'),
(189, 'G4LCSX', 'Belum Terpakai'),
(190, 'UNIOM6', 'Belum Terpakai'),
(191, 'ZE191P', 'Belum Terpakai'),
(192, '0ZYR1P', 'Belum Terpakai'),
(193, '2WA9YQ', 'Belum Terpakai'),
(194, 'SMN5Q9', 'Belum Terpakai'),
(195, 'UFAMB8', 'Belum Terpakai'),
(196, '8IT8UB', 'Belum Terpakai'),
(197, 'M0131V', 'Belum Terpakai'),
(198, 'Q53TZH', 'Belum Terpakai'),
(199, 'V251WD', 'Belum Terpakai'),
(200, '0OGSWB', 'Belum Terpakai'),
(201, '0SAJ5I', 'Belum Terpakai'),
(202, '4EU49L', 'Belum Terpakai'),
(203, '4E53SS', 'Belum Terpakai'),
(204, '25A4O3', 'Belum Terpakai'),
(205, '4SC31P', 'Belum Terpakai'),
(206, 'GS1XHI', 'Belum Terpakai'),
(207, 'Z5GV0P', 'Belum Terpakai'),
(208, 'J6DTO0', 'Belum Terpakai'),
(209, 'QWB3RZ', 'Belum Terpakai'),
(210, 'H2SLEQ', 'Belum Terpakai'),
(211, 'DN63DG', 'Belum Terpakai'),
(212, 'M57HD5', 'Belum Terpakai'),
(213, 'I4EMTK', 'Belum Terpakai'),
(214, 'KUJB3R', 'Belum Terpakai'),
(215, 'CF0TLJ', 'Belum Terpakai'),
(216, '5I8J4P', 'Belum Terpakai'),
(217, '5NG5WG', 'Belum Terpakai'),
(218, 'SPII6X', 'Belum Terpakai'),
(219, 'TBWFCI', 'Belum Terpakai'),
(220, 'ETWP0X', 'Belum Terpakai'),
(221, '6HNVLB', 'Belum Terpakai'),
(222, '6YBFUJ', 'Belum Terpakai'),
(223, '3RZARN', 'Belum Terpakai'),
(224, 'MJ4F15', 'Belum Terpakai'),
(225, 'X0GUJ8', 'Belum Terpakai'),
(226, '2GP536', 'Belum Terpakai'),
(227, '88P41K', 'Belum Terpakai'),
(228, 'VUDW1H', 'Belum Terpakai'),
(229, '5EP5Z0', 'Belum Terpakai'),
(230, 'CE7CVX', 'Belum Terpakai'),
(231, 'YX4HH3', 'Belum Terpakai'),
(232, '5J1NWI', 'Belum Terpakai'),
(233, 'KOB44V', 'Belum Terpakai'),
(234, 'SBT9AL', 'Belum Terpakai'),
(235, 'EPF7WT', 'Belum Terpakai'),
(236, 'DC7GWZ', 'Belum Terpakai'),
(237, 'XTBBIJ', 'Belum Terpakai'),
(238, 'C99NOM', 'Belum Terpakai'),
(239, 'Q1OD9E', 'Belum Terpakai'),
(240, 'TV9S5Q', 'Belum Terpakai'),
(241, 'I73EXW', 'Belum Terpakai'),
(242, 'KPZLG8', 'Belum Terpakai'),
(243, 'TNET1B', 'Belum Terpakai'),
(244, 'G9YXXW', 'Belum Terpakai'),
(245, 'KCDJOF', 'Belum Terpakai'),
(246, 'CIP2OU', 'Belum Terpakai'),
(247, 'L2VIDG', 'Belum Terpakai'),
(248, 'PI4XAL', 'Belum Terpakai'),
(249, '0A4G15', 'Belum Terpakai'),
(250, 'IJN9Y5', 'Belum Terpakai'),
(251, '9Q4MOL', 'Belum Terpakai'),
(252, 'S67XU6', 'Belum Terpakai'),
(253, 'K4ROR3', 'Belum Terpakai'),
(254, 'W03UJI', 'Belum Terpakai'),
(255, 'O2A0M8', 'Belum Terpakai'),
(256, 'C35YSG', 'Belum Terpakai'),
(257, 'WVOSI4', 'Belum Terpakai'),
(258, 'ZHDUOP', 'Belum Terpakai'),
(259, '3LSF4T', 'Belum Terpakai'),
(260, 'JDHG1Y', 'Belum Terpakai'),
(261, 'P1B7QB', 'Belum Terpakai'),
(262, 'DCID5H', 'Belum Terpakai'),
(263, 'RK9M0B', 'Belum Terpakai'),
(264, '8XLG4H', 'Belum Terpakai'),
(265, 'KTO8DE', 'Belum Terpakai'),
(266, '0VZP64', 'Belum Terpakai'),
(267, 'ASAKKI', 'Belum Terpakai'),
(268, '6PHG3D', 'Belum Terpakai'),
(269, 'FJOB4T', 'Belum Terpakai'),
(270, 'OHI5OE', 'Belum Terpakai'),
(271, '6SJBYS', 'Belum Terpakai'),
(272, '1QMGRX', 'Belum Terpakai'),
(273, 'G7BLLD', 'Belum Terpakai'),
(274, '5LM3RB', 'Belum Terpakai'),
(275, 'B8HZK9', 'Belum Terpakai'),
(276, 'DE4IB7', 'Belum Terpakai'),
(277, 'D8Y7RL', 'Belum Terpakai'),
(278, 'Z29TEQ', 'Belum Terpakai'),
(279, 'U6GQRK', 'Belum Terpakai'),
(280, 'LKYXHK', 'Belum Terpakai'),
(281, 'Y4Y1V8', 'Belum Terpakai'),
(282, 'JOJN51', 'Belum Terpakai'),
(283, '6682M0', 'Belum Terpakai'),
(284, 'ETOBPS', 'Belum Terpakai'),
(285, 'R8XRWJ', 'Belum Terpakai'),
(286, '6K97AF', 'Belum Terpakai'),
(287, 'SM33JB', 'Belum Terpakai'),
(288, 'HQKU9K', 'Belum Terpakai'),
(289, '0NLE74', 'Belum Terpakai'),
(290, '3FNTWM', 'Belum Terpakai'),
(291, 'XWCBOY', 'Belum Terpakai'),
(292, 'A9WBO8', 'Belum Terpakai'),
(293, 'L71U7D', 'Belum Terpakai'),
(294, 'L1O56J', 'Belum Terpakai'),
(295, 'RD30AD', 'Belum Terpakai'),
(296, 'OCVK3A', 'Belum Terpakai'),
(297, '7BEYEM', 'Belum Terpakai'),
(298, 'Y0AL61', 'Belum Terpakai'),
(299, 'K00BWN', 'Belum Terpakai'),
(300, 'WP03AC', 'Belum Terpakai'),
(301, '5ZZD72', 'Belum Terpakai'),
(302, '1LEYXJ', 'Belum Terpakai'),
(303, 'UE99HD', 'Belum Terpakai'),
(304, '1YDZVL', 'Belum Terpakai'),
(305, 'H11S1Z', 'Belum Terpakai'),
(306, 'OPS2UY', 'Belum Terpakai'),
(307, 'NXWFJ7', 'Belum Terpakai'),
(308, 'U9Q8H5', 'Belum Terpakai'),
(309, '2PU2C8', 'Belum Terpakai'),
(310, '1A4S8K', 'Belum Terpakai'),
(311, 'YVKG0K', 'Belum Terpakai'),
(312, 'D7OTNW', 'Belum Terpakai'),
(313, 'BD0Y32', 'Belum Terpakai'),
(314, '7YTSTG', 'Belum Terpakai'),
(315, '8XDIIR', 'Belum Terpakai'),
(316, 'IMMA9Z', 'Belum Terpakai'),
(317, '39N978', 'Belum Terpakai'),
(318, '4NYD9C', 'Belum Terpakai'),
(319, 'W870U1', 'Belum Terpakai'),
(320, '1UBYIT', 'Belum Terpakai'),
(321, 'E06CU7', 'Belum Terpakai'),
(322, 'ZGJTYC', 'Belum Terpakai'),
(323, '3Z439S', 'Belum Terpakai'),
(324, '03EBG2', 'Belum Terpakai'),
(325, 'W6GRDE', 'Belum Terpakai'),
(326, '5QLSYN', 'Belum Terpakai'),
(327, 'WO934P', 'Belum Terpakai'),
(328, 'K1WH56', 'Belum Terpakai'),
(329, '9HA2HD', 'Belum Terpakai'),
(330, 'T6X531', 'Belum Terpakai'),
(331, 'ISVS9K', 'Belum Terpakai'),
(332, 'MCRKBG', 'Belum Terpakai'),
(333, '7YYXGT', 'Belum Terpakai'),
(334, 'JD0W26', 'Belum Terpakai'),
(335, 'C7QJMO', 'Belum Terpakai'),
(336, '9L4NJ2', 'Belum Terpakai'),
(337, 'XX42X2', 'Belum Terpakai'),
(338, '7EJXHU', 'Belum Terpakai'),
(339, 'YVXF7O', 'Belum Terpakai'),
(340, 'DI67Q8', 'Belum Terpakai'),
(341, 'EHZ4OP', 'Belum Terpakai'),
(342, 'ZQ62F1', 'Belum Terpakai'),
(343, 'YH190N', 'Belum Terpakai'),
(344, 'J0K228', 'Belum Terpakai'),
(345, 'FS5XVI', 'Belum Terpakai'),
(346, 'W0QQDV', 'Belum Terpakai'),
(347, 'U21JOC', 'Belum Terpakai'),
(348, 'UG33NF', 'Belum Terpakai'),
(349, 'KQ2RCP', 'Belum Terpakai'),
(350, 'Y09WEP', 'Belum Terpakai'),
(351, 'QPF8X3', 'Belum Terpakai'),
(352, 'X3USWM', 'Belum Terpakai'),
(353, 'KAJZJV', 'Belum Terpakai'),
(354, 'KYXXFL', 'Belum Terpakai'),
(355, 'ZEXBH6', 'Belum Terpakai'),
(356, 'W3P4WJ', 'Belum Terpakai'),
(357, 'VZEGKV', 'Belum Terpakai'),
(358, 'HERUA4', 'Belum Terpakai'),
(359, 'OHQ3AS', 'Belum Terpakai'),
(360, 'Y70DCO', 'Belum Terpakai'),
(361, 'VEP8HL', 'Belum Terpakai'),
(362, 'X2K62T', 'Belum Terpakai'),
(363, 'HVYJNL', 'Belum Terpakai'),
(364, 'HCPCD5', 'Belum Terpakai'),
(365, 'TIIMLE', 'Belum Terpakai'),
(366, 'BH9RHU', 'Belum Terpakai'),
(367, 'COT1T4', 'Belum Terpakai'),
(368, 'V1Z980', 'Belum Terpakai'),
(369, 'HZ9Q83', 'Belum Terpakai'),
(370, 'X26CJT', 'Belum Terpakai'),
(371, 'CECXDG', 'Belum Terpakai'),
(372, 'ESDMPH', 'Belum Terpakai'),
(373, 'LZYNRV', 'Belum Terpakai'),
(374, '57OY59', 'Belum Terpakai'),
(375, 'NOWOIH', 'Belum Terpakai'),
(376, '6DWPGH', 'Belum Terpakai'),
(377, '7XUJPT', 'Belum Terpakai'),
(378, '7HT3IL', 'Belum Terpakai'),
(379, '90799D', 'Belum Terpakai'),
(380, 'OADK2T', 'Belum Terpakai'),
(381, 'NQAMDG', 'Belum Terpakai'),
(382, '84Q10C', 'Belum Terpakai'),
(383, 'DFOI29', 'Belum Terpakai'),
(384, 'CI3TH4', 'Belum Terpakai'),
(385, 'YRH4IY', 'Belum Terpakai'),
(386, 'DD15MQ', 'Belum Terpakai'),
(387, 'MFAL4A', 'Belum Terpakai'),
(388, '8IH2ZC', 'Belum Terpakai'),
(389, 'FR2NNL', 'Belum Terpakai'),
(390, 'UVZZHZ', 'Belum Terpakai'),
(391, '53BYBJ', 'Belum Terpakai'),
(392, '514TYR', 'Belum Terpakai'),
(393, 'ZAI6VA', 'Belum Terpakai'),
(394, 'BP66CZ', 'Belum Terpakai'),
(395, 'STDI9P', 'Belum Terpakai'),
(396, '6RBF43', 'Belum Terpakai'),
(397, 'E9IL9I', 'Belum Terpakai'),
(398, 'TIKZ6N', 'Belum Terpakai'),
(399, 'KZX4KT', 'Belum Terpakai'),
(400, 'XWMM4W', 'Belum Terpakai'),
(401, '2N6Q74', 'Belum Terpakai'),
(402, 'XG8VYG', 'Belum Terpakai'),
(403, 'Q3YJTR', 'Belum Terpakai'),
(404, '7I62W7', 'Belum Terpakai'),
(405, 'HKAACJ', 'Belum Terpakai'),
(406, 'WXA2AP', 'Belum Terpakai'),
(407, '2SC4ZJ', 'Belum Terpakai'),
(408, 'ERTIC9', 'Belum Terpakai'),
(409, 'IE0YGP', 'Belum Terpakai'),
(410, 'MYHRYL', 'Belum Terpakai'),
(411, 'PCXO0C', 'Belum Terpakai'),
(412, 'V12B8E', 'Belum Terpakai'),
(413, 'E8A5MG', 'Belum Terpakai'),
(414, 'A4NQQJ', 'Belum Terpakai'),
(415, '4KKQ40', 'Belum Terpakai'),
(416, '1AD65L', 'Belum Terpakai'),
(417, 'H2SWCV', 'Belum Terpakai'),
(418, 'QHH6DX', 'Belum Terpakai'),
(419, 'CHREZL', 'Belum Terpakai'),
(420, '4CGAHF', 'Belum Terpakai'),
(421, '580573', 'Belum Terpakai'),
(422, '88GXMT', 'Belum Terpakai'),
(423, '46J0LY', 'Belum Terpakai'),
(424, '900N1L', 'Belum Terpakai'),
(425, 'CAP0MP', 'Belum Terpakai'),
(426, 'VPNAR1', 'Belum Terpakai'),
(427, '0TR5Z3', 'Belum Terpakai'),
(428, '2MPR1N', 'Belum Terpakai'),
(429, '9Y9FWZ', 'Belum Terpakai'),
(430, 'BZ4K6B', 'Belum Terpakai'),
(431, 'LLYRIP', 'Belum Terpakai'),
(432, '9VDBWK', 'Belum Terpakai'),
(433, 'GR3O34', 'Belum Terpakai'),
(434, 'DNNP27', 'Belum Terpakai'),
(435, '6CU2FL', 'Belum Terpakai'),
(436, '7E3R43', 'Belum Terpakai'),
(437, 'S7X13W', 'Belum Terpakai'),
(438, '9S45N6', 'Belum Terpakai'),
(439, 'XQDHBU', 'Belum Terpakai'),
(440, '2XDC54', 'Belum Terpakai'),
(441, '9H3LLM', 'Belum Terpakai'),
(442, '5J33Y3', 'Belum Terpakai'),
(443, 'MMSHI5', 'Belum Terpakai'),
(444, '4OFETV', 'Belum Terpakai'),
(445, '5PKIVG', 'Belum Terpakai'),
(446, '0RQNPI', 'Belum Terpakai'),
(447, '5HS8ZY', 'Belum Terpakai'),
(448, 'G9NPEP', 'Belum Terpakai'),
(449, '4KJ6LY', 'Belum Terpakai'),
(450, '0BKKHJ', 'Belum Terpakai'),
(451, 'JKNBSB', 'Belum Terpakai'),
(452, 'SJ32KE', 'Belum Terpakai'),
(453, '95JU63', 'Belum Terpakai'),
(454, '8DNW5Q', 'Belum Terpakai'),
(455, '4GB54I', 'Belum Terpakai'),
(456, 'HZXIRY', 'Belum Terpakai'),
(457, '3I1VJD', 'Belum Terpakai'),
(458, 'ST4NEH', 'Belum Terpakai'),
(459, 'NIDO1B', 'Belum Terpakai'),
(460, 'WGZLIG', 'Belum Terpakai'),
(461, '6PJD5J', 'Belum Terpakai'),
(462, '7OTEP6', 'Belum Terpakai'),
(463, 'T5NOPA', 'Belum Terpakai'),
(464, 'BYYKTA', 'Belum Terpakai'),
(465, 'BOY5HE', 'Belum Terpakai'),
(466, 'ZSUQFR', 'Belum Terpakai'),
(467, 'HNGOOI', 'Belum Terpakai'),
(468, 'QZDWZ2', 'Belum Terpakai'),
(469, 'TX7UI1', 'Belum Terpakai'),
(470, 'CQQK34', 'Belum Terpakai'),
(471, '0F43Y8', 'Belum Terpakai'),
(472, '3IFDD9', 'Belum Terpakai'),
(473, 'MVYNYE', 'Belum Terpakai'),
(474, '6AAS3M', 'Belum Terpakai'),
(475, 'D06OXF', 'Belum Terpakai'),
(476, 'EXE39S', 'Belum Terpakai'),
(477, 'RWBBSS', 'Belum Terpakai'),
(478, 'UYZXE4', 'Belum Terpakai'),
(479, 'HQM777', 'Belum Terpakai'),
(480, 'HZ5AEZ', 'Belum Terpakai'),
(481, 'RK6DAQ', 'Belum Terpakai'),
(482, 'T5Y0VG', 'Belum Terpakai'),
(483, 'GJRE67', 'Belum Terpakai'),
(484, 'X9C334', 'Belum Terpakai'),
(485, 'F8KD2G', 'Belum Terpakai'),
(486, 'RWZGR9', 'Belum Terpakai'),
(487, '9FNTYA', 'Belum Terpakai'),
(488, 'LA4JU0', 'Belum Terpakai'),
(489, 'LD9SWK', 'Belum Terpakai'),
(490, 'A981AF', 'Belum Terpakai'),
(491, '55ZRMX', 'Belum Terpakai'),
(492, 'RO62LS', 'Belum Terpakai'),
(493, '2X4S3E', 'Belum Terpakai'),
(494, '14NXQI', 'Belum Terpakai'),
(495, 'XU37OV', 'Belum Terpakai'),
(496, 'CRL4JN', 'Belum Terpakai'),
(497, 'JIV5VV', 'Belum Terpakai'),
(498, '395T5W', 'Belum Terpakai'),
(499, 'HVQ84P', 'Belum Terpakai'),
(500, 'B9JYTV', 'Belum Terpakai'),
(501, '97VPYW', 'Belum Terpakai'),
(502, 'ILTZDD', 'Belum Terpakai'),
(503, 'JL7CD5', 'Belum Terpakai'),
(504, 'F4171L', 'Belum Terpakai'),
(505, 'PRUW0D', 'Belum Terpakai'),
(506, 'PSII3O', 'Belum Terpakai'),
(507, 'ERLB66', 'Belum Terpakai'),
(508, 'UYY5AR', 'Belum Terpakai'),
(509, 'FRMFX4', 'Belum Terpakai'),
(510, '89U69M', 'Belum Terpakai'),
(511, '8LMFGN', 'Belum Terpakai'),
(512, 'YO8K4Z', 'Belum Terpakai'),
(513, 'CVJ39J', 'Belum Terpakai'),
(514, 'VNQFWA', 'Belum Terpakai'),
(515, 'NYH9ZI', 'Belum Terpakai'),
(516, 'K89KQ1', 'Belum Terpakai'),
(517, 'Y0BMZA', 'Belum Terpakai'),
(518, '2MYFDN', 'Belum Terpakai'),
(519, 'NCYJ2V', 'Belum Terpakai'),
(520, '5OUF1J', 'Belum Terpakai'),
(521, 'SKAVO7', 'Belum Terpakai'),
(522, 'K5LT96', 'Belum Terpakai'),
(523, 'Y0FBQX', 'Belum Terpakai'),
(524, 'LE2VKN', 'Belum Terpakai'),
(525, 'MOC0LW', 'Belum Terpakai'),
(526, '60ACK1', 'Belum Terpakai'),
(527, '64CHW2', 'Belum Terpakai'),
(528, 'L6KQCW', 'Belum Terpakai'),
(529, '2BV9M7', 'Belum Terpakai'),
(530, 'IZSZ3O', 'Belum Terpakai'),
(531, 'Y58EXO', 'Belum Terpakai'),
(532, 'K54CJF', 'Belum Terpakai'),
(533, '73BEH4', 'Belum Terpakai'),
(534, 'PK7UPL', 'Belum Terpakai'),
(535, '6D7M3O', 'Belum Terpakai'),
(536, 'TQPLLW', 'Belum Terpakai'),
(537, 'PRRZ2D', 'Belum Terpakai'),
(538, 'GZCJXT', 'Belum Terpakai'),
(539, 'DSK8PN', 'Belum Terpakai'),
(540, 'IMNKB8', 'Belum Terpakai'),
(541, '18SHE6', 'Belum Terpakai'),
(542, '5BRUCI', 'Belum Terpakai'),
(543, '85PPW0', 'Belum Terpakai'),
(544, '0LD30L', 'Belum Terpakai'),
(545, '1AKBBK', 'Belum Terpakai'),
(546, 'UIDG01', 'Belum Terpakai'),
(547, 'N3Y416', 'Belum Terpakai'),
(548, 'PSM6HV', 'Belum Terpakai'),
(549, 'MAAJ9V', 'Belum Terpakai'),
(550, '0SOL52', 'Belum Terpakai'),
(551, 'E8NIXI', 'Belum Terpakai'),
(552, '0TL0HA', 'Belum Terpakai'),
(553, 'EHZEIP', 'Belum Terpakai'),
(554, 'JGNZR8', 'Belum Terpakai'),
(555, 'SF3ZX7', 'Belum Terpakai'),
(556, 'X9MPTA', 'Belum Terpakai'),
(557, 'DZFA2C', 'Belum Terpakai'),
(558, 'FKPC31', 'Belum Terpakai'),
(559, '11SSVV', 'Belum Terpakai'),
(560, 'RYOT2D', 'Belum Terpakai'),
(561, 'IS69X1', 'Belum Terpakai'),
(562, 'GLZ1CZ', 'Belum Terpakai'),
(563, 'Q2IDJF', 'Belum Terpakai'),
(564, 'U96D2H', 'Belum Terpakai'),
(565, 'BBGQH1', 'Belum Terpakai'),
(566, 'QC6721', 'Belum Terpakai'),
(567, 'MZI1II', 'Belum Terpakai'),
(568, '9YL9JN', 'Belum Terpakai'),
(569, 'YYHM6B', 'Belum Terpakai'),
(570, 'E00KCN', 'Belum Terpakai'),
(571, 'GEMV0U', 'Belum Terpakai'),
(572, '9L2EX0', 'Belum Terpakai'),
(573, '7SEBY5', 'Belum Terpakai'),
(574, 'AKA7KP', 'Belum Terpakai'),
(575, 'BVTEBT', 'Belum Terpakai'),
(576, 'TYBRWV', 'Belum Terpakai'),
(577, '2WMTZL', 'Belum Terpakai'),
(578, '84G7HK', 'Belum Terpakai'),
(579, 'XYY9TA', 'Belum Terpakai'),
(580, '5P62M9', 'Belum Terpakai'),
(581, 'VAZ23K', 'Belum Terpakai'),
(582, 'FMV49X', 'Belum Terpakai'),
(583, '4ZV2PF', 'Belum Terpakai'),
(584, 'P4NXM2', 'Belum Terpakai'),
(585, '42SAM6', 'Belum Terpakai'),
(586, '66BNIT', 'Belum Terpakai'),
(587, 'RY0JLN', 'Belum Terpakai'),
(588, 'TLNL7P', 'Belum Terpakai'),
(589, 'KCSB9B', 'Belum Terpakai'),
(590, 'XQD4HS', 'Belum Terpakai'),
(591, 'SEE41C', 'Belum Terpakai'),
(592, 'BSE82O', 'Belum Terpakai'),
(593, 'EQW5C9', 'Belum Terpakai'),
(594, 'M8ZXK9', 'Belum Terpakai'),
(595, 'W8C6UH', 'Belum Terpakai'),
(596, 'ODOW9X', 'Belum Terpakai'),
(597, 'XFGD1K', 'Belum Terpakai'),
(598, 'BLXAZ5', 'Belum Terpakai'),
(599, '44900T', 'Belum Terpakai'),
(600, 'I0RFNJ', 'Belum Terpakai'),
(601, 'QX9T5D', 'Belum Terpakai'),
(602, '8LH3ZX', 'Belum Terpakai'),
(603, 'M13Y02', 'Belum Terpakai'),
(604, '5LFYZ4', 'Belum Terpakai'),
(605, 'AFUAYV', 'Belum Terpakai'),
(606, '7CI2A1', 'Belum Terpakai'),
(607, '7C3ZZZ', 'Belum Terpakai'),
(608, 'D3TMWA', 'Belum Terpakai'),
(609, 'BF97W7', 'Belum Terpakai'),
(610, '5JXRA5', 'Belum Terpakai'),
(611, 'WJPJUF', 'Belum Terpakai'),
(612, '9D087X', 'Belum Terpakai'),
(613, '9HUP0U', 'Belum Terpakai'),
(614, 'IWUP8X', 'Belum Terpakai'),
(615, '5F588E', 'Belum Terpakai'),
(616, 'T1IKTF', 'Belum Terpakai'),
(617, '3NFYN0', 'Belum Terpakai'),
(618, '91B0IU', 'Belum Terpakai'),
(619, '6JZYKI', 'Belum Terpakai'),
(620, 'M7Y5LP', 'Belum Terpakai'),
(621, '3SNI68', 'Belum Terpakai'),
(622, 'BO7QO1', 'Belum Terpakai'),
(623, 'OVWWDD', 'Belum Terpakai'),
(624, '04498L', 'Belum Terpakai'),
(625, '8O7V1B', 'Belum Terpakai'),
(626, '1PAK1U', 'Belum Terpakai'),
(627, '860OTT', 'Belum Terpakai'),
(628, '7FF0NV', 'Belum Terpakai'),
(629, 'KNCK2V', 'Belum Terpakai'),
(630, 'CW4349', 'Belum Terpakai'),
(631, 'NYIJCJ', 'Belum Terpakai'),
(632, 'PULUD9', 'Belum Terpakai'),
(633, 'XNW56T', 'Belum Terpakai'),
(634, '5WUKQZ', 'Belum Terpakai'),
(635, '4AJV3H', 'Belum Terpakai'),
(636, 'NIAM8X', 'Belum Terpakai'),
(637, 'SVJGUI', 'Belum Terpakai'),
(638, 'HMV05V', 'Belum Terpakai'),
(639, 'M5XL8F', 'Belum Terpakai'),
(640, 'R9IT4H', 'Belum Terpakai'),
(641, '662LVR', 'Belum Terpakai'),
(642, 'T8IZGX', 'Belum Terpakai'),
(643, 'TUN54N', 'Belum Terpakai'),
(644, 'IRI9H7', 'Belum Terpakai'),
(645, 'BWD31I', 'Belum Terpakai'),
(646, '524P1B', 'Belum Terpakai'),
(647, '75YBZV', 'Belum Terpakai'),
(648, 'KVGCG2', 'Belum Terpakai'),
(649, '3M9VWS', 'Belum Terpakai'),
(650, 'X5F1K4', 'Belum Terpakai'),
(651, 'XY9ULQ', 'Belum Terpakai'),
(652, 'KA3AYD', 'Belum Terpakai'),
(653, 'WRNO3L', 'Belum Terpakai'),
(654, 'VZ5PNO', 'Belum Terpakai'),
(655, '3SE4NK', 'Belum Terpakai'),
(656, 'ZUUEGK', 'Belum Terpakai'),
(657, 'JKWT1W', 'Belum Terpakai'),
(658, '4DU213', 'Belum Terpakai'),
(659, 'NO2896', 'Belum Terpakai'),
(660, 'C544K6', 'Belum Terpakai'),
(661, '2AKQ1M', 'Belum Terpakai'),
(662, '3WXN2G', 'Belum Terpakai'),
(663, 'R3U4E3', 'Belum Terpakai'),
(664, '0ZLNMU', 'Belum Terpakai'),
(665, 'CQ0KGL', 'Belum Terpakai'),
(666, 'OY7C88', 'Belum Terpakai'),
(667, '79BUJ5', 'Belum Terpakai'),
(668, 'BX0VR8', 'Belum Terpakai'),
(669, '7NJJJ6', 'Belum Terpakai'),
(670, 'ZKQVKW', 'Belum Terpakai'),
(671, '22649Y', 'Belum Terpakai'),
(672, '1WV9VE', 'Belum Terpakai'),
(673, 'SF0EEK', 'Belum Terpakai'),
(674, '6HI3WH', 'Belum Terpakai'),
(675, 'GZ16G1', 'Belum Terpakai'),
(676, 'T0EVB2', 'Belum Terpakai'),
(677, 'UEKFJE', 'Belum Terpakai'),
(678, 'TNZ98S', 'Belum Terpakai'),
(679, 'A703N6', 'Belum Terpakai'),
(680, 'QN2UNX', 'Belum Terpakai'),
(681, 'GPNG0B', 'Belum Terpakai'),
(682, 'J2ZXQE', 'Belum Terpakai'),
(683, 'RY4L05', 'Belum Terpakai'),
(684, 'K8M0EM', 'Belum Terpakai'),
(685, 'OUF1LT', 'Belum Terpakai'),
(686, '38EUY9', 'Belum Terpakai'),
(687, 'ZQIFJ6', 'Belum Terpakai'),
(688, 'C6Z4AP', 'Belum Terpakai'),
(689, 'GSMVIT', 'Belum Terpakai'),
(690, '8RUX03', 'Belum Terpakai'),
(691, 'TWZL23', 'Belum Terpakai'),
(692, '6HG9N1', 'Belum Terpakai'),
(693, 'KDJ74I', 'Belum Terpakai'),
(694, 'DAMAZI', 'Belum Terpakai'),
(695, '3BQONE', 'Belum Terpakai'),
(696, 'VPSBFN', 'Belum Terpakai'),
(697, 'YJQI0S', 'Belum Terpakai'),
(698, '2H5GQB', 'Belum Terpakai'),
(699, '0ILHB9', 'Belum Terpakai'),
(700, 'LI8SNE', 'Belum Terpakai'),
(701, 'YSOJIJ', 'Belum Terpakai'),
(702, 'EJP5NE', 'Belum Terpakai'),
(703, 'F81NG0', 'Belum Terpakai'),
(704, 'HUOAO4', 'Belum Terpakai'),
(705, 'DQ3X81', 'Belum Terpakai'),
(706, 'ZD88X5', 'Belum Terpakai'),
(707, '2SAXHY', 'Belum Terpakai'),
(708, '11', 'Belum Terpakai'),
(709, '1232131', 'Belum Terpakai');

-- --------------------------------------------------------

--
-- Struktur dari tabel `master_biaya_jurusan`
--

CREATE TABLE `master_biaya_jurusan` (
  `id_biaya` int(11) NOT NULL,
  `id_jurusan` int(11) NOT NULL,
  `tahun_ajaran` varchar(10) NOT NULL,
  `total_biaya` decimal(10,2) NOT NULL,
  `minimal_pembayaran` decimal(10,2) NOT NULL,
  `keterangan` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data untuk tabel `master_biaya_jurusan`
--

INSERT INTO `master_biaya_jurusan` (`id_biaya`, `id_jurusan`, `tahun_ajaran`, `total_biaya`, `minimal_pembayaran`, `keterangan`, `created_at`, `updated_at`) VALUES
(7, 14, '2026/2027', 5545000.00, 2750000.00, '', '2025-05-05 10:29:17', '2025-05-05 10:29:26'),
(8, 15, '2026/2027', 4405000.00, 2500000.00, '\n', '2025-05-05 10:29:42', '2025-05-05 10:29:42'),
(9, 16, '2026/2027', 4405000.00, 2500000.00, '', '2025-05-05 10:29:54', '2025-05-05 10:29:54'),
(10, 17, '2026/2027', 4405000.00, 2500000.00, '', '2025-05-05 10:30:06', '2025-05-05 10:30:06');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pembayaran_pendaftaran`
--

CREATE TABLE `pembayaran_pendaftaran` (
  `id_pembayaran` int(11) NOT NULL,
  `id_formulir` int(11) NOT NULL,
  `id_jurusan` int(11) NOT NULL,
  `id_periode_daftar` int(11) NOT NULL,
  `total_biaya` decimal(10,2) NOT NULL,
  `sisa_pembayaran` decimal(10,2) NOT NULL,
  `status_pelunasan` enum('BELUM_LUNAS','LUNAS') DEFAULT 'BELUM_LUNAS',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktur dari tabel `periode_master_biaya`
--

CREATE TABLE `periode_master_biaya` (
  `id` int(11) NOT NULL,
  `id_periode` int(11) NOT NULL,
  `id_biaya` int(11) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data untuk tabel `periode_master_biaya`
--

INSERT INTO `periode_master_biaya` (`id`, `id_periode`, `id_biaya`, `created_at`) VALUES
(1, 6, 10, '2025-05-05 11:20:03'),
(2, 6, 9, '2025-05-05 11:20:03'),
(3, 6, 8, '2025-05-05 11:20:03'),
(4, 6, 7, '2025-05-05 11:20:03'),
(5, 7, 10, '2025-05-05 11:23:44'),
(6, 7, 9, '2025-05-05 11:23:44'),
(7, 7, 8, '2025-05-05 11:23:44'),
(8, 7, 7, '2025-05-05 11:23:44'),
(9, 8, 10, '2025-05-05 11:24:07'),
(10, 8, 9, '2025-05-05 11:24:07'),
(11, 8, 8, '2025-05-05 11:24:07'),
(12, 8, 7, '2025-05-05 11:24:07'),
(13, 9, 10, '2025-05-05 11:24:24'),
(14, 9, 9, '2025-05-05 11:24:24'),
(15, 9, 8, '2025-05-05 11:24:24'),
(16, 9, 7, '2025-05-05 11:24:24');

-- --------------------------------------------------------

--
-- Struktur dari tabel `periode_pendaftaran`
--

CREATE TABLE `periode_pendaftaran` (
  `id_periode` int(11) NOT NULL,
  `nama_periode` varchar(50) NOT NULL,
  `urutan_periode` tinyint(4) NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_selesai` date NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'inactive',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data untuk tabel `periode_pendaftaran`
--

INSERT INTO `periode_pendaftaran` (`id_periode`, `nama_periode`, `urutan_periode`, `tanggal_mulai`, `tanggal_selesai`, `status`, `created_at`, `updated_at`) VALUES
(6, 'Periode 1', 1, '2025-01-13', '2025-02-28', 'inactive', '2025-05-05 11:20:03', '2025-05-05 11:20:03'),
(7, 'Periode 2', 2, '2025-03-01', '2025-04-30', 'inactive', '2025-05-05 11:23:44', '2025-05-05 11:23:44'),
(8, 'Periode 3', 3, '2025-05-01', '2025-06-30', 'active', '2025-05-05 11:24:07', '2025-05-05 13:15:05'),
(9, 'Periode 4', 4, '2025-07-01', '2025-07-10', 'inactive', '2025-05-05 11:24:24', '2025-05-05 11:24:24');

-- --------------------------------------------------------

--
-- Struktur dari tabel `registrasi_peserta_didik`
--

CREATE TABLE `registrasi_peserta_didik` (
  `id` int(11) NOT NULL,
  `id_formulir` int(11) NOT NULL,
  `jurusan` int(11) NOT NULL,
  `jenis_pendaftaran` enum('Siswa Baru','Pindahan','Kembali Bersekolah') NOT NULL,
  `tanggal_masuk_sekolah` date NOT NULL,
  `asal_sekolah` varchar(255) NOT NULL,
  `nomor_peserta_ujian` varchar(20) DEFAULT NULL,
  `no_seri_ijazah` varchar(20) DEFAULT NULL,
  `no_seri_skhus` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data untuk tabel `registrasi_peserta_didik`
--

INSERT INTO `registrasi_peserta_didik` (`id`, `id_formulir`, `jurusan`, `jenis_pendaftaran`, `tanggal_masuk_sekolah`, `asal_sekolah`, `nomor_peserta_ujian`, `no_seri_ijazah`, `no_seri_skhus`) VALUES
(2, 2, 14, 'Siswa Baru', '2025-05-05', 'SMP Negeri 39 Jakarta', '', '', '');

-- --------------------------------------------------------

--
-- Struktur dari tabel `rewards`
--

CREATE TABLE `rewards` (
  `id_reward` int(11) NOT NULL,
  `tanggal_reward` datetime NOT NULL,
  `id_pembayaran` int(11) NOT NULL,
  `nama_pembawa` varchar(100) NOT NULL,
  `keterangan_pembawa` varchar(100) NOT NULL,
  `no_wa_pembawa` bigint(20) NOT NULL,
  `nominal` int(11) NOT NULL,
  `nama_petugas` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `seragam`
--

CREATE TABLE `seragam` (
  `id_seragam` int(11) NOT NULL,
  `tanggal_pemberian` date NOT NULL,
  `id_pembayaran` int(11) NOT NULL,
  `seragam_batik` enum('Belum','Batik (XS)','Batik (S)','Batik (M)','Batik (L)','Batik (XL)','Batik (XXL)','Batik (XXXL)','Batik (4XL)','Batik (5XL)','Batik (6XL)','Batik (7XL)') DEFAULT 'Belum',
  `seragam_olahraga` enum('Belum','Olahraga (XS)','Olahraga (S)','Olahraga (M)','Olahraga (L)','Olahraga (XL)','Olahraga (XXL)','Olahraga (XXXL)','Olahraga (4XL)','Olahraga (5XL)','Olahraga (6XL)','Olahraga (7XL)') DEFAULT 'Belum',
  `seragam_muslim` enum('Belum','Muslim (XS)','Muslim (S)','Muslim (M)','Muslim (L)','Muslim (XL)','Muslim (XXL)','Muslim (XXXL)','Muslim (4XL)','Muslim (5XL)','Muslim (6XL)','Muslim (7XL)') DEFAULT 'Belum',
  `al_quran` enum('Sudah','Belum') DEFAULT 'Belum',
  `tempat_makan` enum('Sudah','Belum') DEFAULT 'Belum',
  `kartu_pelajar` enum('Sudah','Belum') DEFAULT 'Belum',
  `gesper` enum('Sudah','Belum') DEFAULT NULL,
  `kerudung` enum('Sudah','Belum') DEFAULT 'Belum',
  `nama_petugas` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `seragam`
--

INSERT INTO `seragam` (`id_seragam`, `tanggal_pemberian`, `id_pembayaran`, `seragam_batik`, `seragam_olahraga`, `seragam_muslim`, `topi`, `dasi`, `gesper`, `bet`, `lokasi`, `nama_petugas`, `created_at`, `updated_at`) VALUES
(2, '2025-04-27', 1, 'Batik (XXL)', 'Olahraga (M)', 'Muslim (XS)', 'Belum', 'Sudah', 'Sudah', 'Belum', 'Sudah', 'Renday Banget Ini', '2025-04-27 14:29:26', '2025-04-27 14:29:40');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data untuk tabel `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('AbCjpHcYBIGlTbwm0APldXMD0BhEwkcM', 1746525247, '{\"cookie\":{\"originalMaxAge\":86399999,\"expires\":\"2025-05-06T06:03:40.995Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZXMiOiJBZG1pbiIsIm5hbWEiOiJSZW5kYXkgQmFuZ2V0IEluaSIsImlhdCI6MTc0NjQyNTAyMCwiZXhwIjoxNzQ2NTExNDIwfQ.hVF26Czh_2AdeZdIJnvsDEQdw4H_SjvtTG7Nq2PQg0s\"}'),
('UWTmrLLRdcPW2zfDRytd6kPe3lnXPy6G', 1746512838, '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-05-06T06:24:50.623Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsInJvbGVzIjoiQ1BEQiIsIm5hbWEiOiJSZW5kaSBGYWRpbGFoYWhhaGFoYSIsImlhdCI6MTc0NjQyNjI5MCwiZXhwIjoxNzQ2NTEyNjkwfQ.h57Ljl27cQWT2qmnocKyye3x2w1L4eU_0y9NepxuF6A\"}');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
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
  `status_wawancara` enum('Sudah','Belum') NOT NULL DEFAULT 'Belum'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id_user`, `nama_lengkap`, `nomor_whatsapp`, `nisn`, `nik`, `asal_smp`, `jenis_kelamin`, `password`, `raw_password`, `roles`, `tanggal_daftar`, `status_wawancara`) VALUES
(1, 'Administrator', '081234567890', '0000000000', NULL, 'Admin', 'Laki-laki', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LHd.qR3nFGNgQO4Gu', 'RendiMihawk12305', 'Admin', '2025-03-27 20:19:49', 'Sudah'),
(2, 'Renday Banget Ini', '08823947715', '0031567893', '31710505030029', 'SMP JP 1', 'Laki-laki', '$2b$10$EXU8ZDRh7mcc0hThPxbRB./slvqoDpn/DUAYAwu/3zwNfWrZVMh/a', 'Rendi12305', 'Admin', '2025-04-05 11:30:07', 'Belum'),
(20, 'Rendi Fadilah', '081806673638', NULL, NULL, NULL, 'Laki-laki', '$2b$12$ID5Sib2h5Ppbcg1Rg/vHG.q91VCzUlDfLcjFpiongjvwgcKM3r2bC', NULL, 'Petugas', '2025-05-05 09:01:37', 'Belum'),
(21, 'Rendi Fadilahahahaha', '081806673639', '0031654632', '31710100505030004', 'SMP Negeri 39 Jakarta', 'Laki-laki', '$2b$12$DnTOuOoJVuqnjkQ1liwdq.wlx9sj.2NHGKeuWEcidc0zMYT1MqCYS', 'RF0212849', 'CPDB', '2025-05-05 13:04:46', 'Sudah');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `berkas`
--
ALTER TABLE `berkas`
  ADD PRIMARY KEY (`id_berkas`),
  ADD KEY `id_formulir` (`id_formulir`);

--
-- Indeks untuk tabel `data_ayah`
--
ALTER TABLE `data_ayah`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_formulir` (`id_formulir`);

--
-- Indeks untuk tabel `data_ibu`
--
ALTER TABLE `data_ibu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_formulir` (`id_formulir`);

--
-- Indeks untuk tabel `data_periodik`
--
ALTER TABLE `data_periodik`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_formulir` (`id_formulir`);

--
-- Indeks untuk tabel `data_pribadi`
--
ALTER TABLE `data_pribadi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_formulir` (`id_formulir`);

--
-- Indeks untuk tabel `data_wali`
--
ALTER TABLE `data_wali`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_formulir` (`id_formulir`);

--
-- Indeks untuk tabel `detail_pembayaran_pendaftaran`
--
ALTER TABLE `detail_pembayaran_pendaftaran`
  ADD PRIMARY KEY (`id_detail`),
  ADD KEY `id_pembayaran` (`id_pembayaran`),
  ADD KEY `id_periode_bayar` (`id_periode_bayar`);

--
-- Indeks untuk tabel `diskon_periode`
--
ALTER TABLE `diskon_periode`
  ADD PRIMARY KEY (`id_diskon`),
  ADD KEY `id_periode` (`id_periode`),
  ADD KEY `id_jurusan` (`id_jurusan`);

--
-- Indeks untuk tabel `formulir`
--
ALTER TABLE `formulir`
  ADD PRIMARY KEY (`id_formulir`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_kode_pembayaran` (`id_kode_pembayaran`);

--
-- Indeks untuk tabel `jurusan`
--
ALTER TABLE `jurusan`
  ADD PRIMARY KEY (`id_jurusan`);

--
-- Indeks untuk tabel `kode_pembayaran`
--
ALTER TABLE `kode_pembayaran`
  ADD PRIMARY KEY (`id_kode_pembayaran`);

--
-- Indeks untuk tabel `master_biaya_jurusan`
--
ALTER TABLE `master_biaya_jurusan`
  ADD PRIMARY KEY (`id_biaya`),
  ADD KEY `id_jurusan` (`id_jurusan`);

--
-- Indeks untuk tabel `pembayaran_pendaftaran`
--
ALTER TABLE `pembayaran_pendaftaran`
  ADD PRIMARY KEY (`id_pembayaran`),
  ADD KEY `pembayaran_pendaftaran_ibfk_3` (`id_jurusan`),
  ADD KEY `id_formulir` (`id_formulir`),
  ADD KEY `id_periode_daftar` (`id_periode_daftar`);

--
-- Indeks untuk tabel `periode_master_biaya`
--
ALTER TABLE `periode_master_biaya`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `periode_biaya_unique` (`id_periode`,`id_biaya`),
  ADD KEY `id_periode` (`id_periode`),
  ADD KEY `id_biaya` (`id_biaya`);

--
-- Indeks untuk tabel `periode_pendaftaran`
--
ALTER TABLE `periode_pendaftaran`
  ADD PRIMARY KEY (`id_periode`);

--
-- Indeks untuk tabel `registrasi_peserta_didik`
--
ALTER TABLE `registrasi_peserta_didik`
  ADD PRIMARY KEY (`id`),
  ADD KEY `registrasi_peserta_didik_ibfk_2` (`jurusan`),
  ADD KEY `id_formulir` (`id_formulir`);

--
-- Indeks untuk tabel `rewards`
--
ALTER TABLE `rewards`
  ADD PRIMARY KEY (`id_reward`),
  ADD KEY `id_pembayaran` (`id_pembayaran`);

--
-- Indeks untuk tabel `seragam`
--
ALTER TABLE `seragam`
  ADD PRIMARY KEY (`id_seragam`);

--
-- Indeks untuk tabel `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `nomor_whatsapp` (`nomor_whatsapp`),
  ADD UNIQUE KEY `nisn` (`nisn`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `berkas`
--
ALTER TABLE `berkas`
  MODIFY `id_berkas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `data_ayah`
--
ALTER TABLE `data_ayah`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `data_ibu`
--
ALTER TABLE `data_ibu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `data_periodik`
--
ALTER TABLE `data_periodik`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `data_pribadi`
--
ALTER TABLE `data_pribadi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `data_wali`
--
ALTER TABLE `data_wali`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `detail_pembayaran_pendaftaran`
--
ALTER TABLE `detail_pembayaran_pendaftaran`
  MODIFY `id_detail` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `diskon_periode`
--
ALTER TABLE `diskon_periode`
  MODIFY `id_diskon` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT untuk tabel `formulir`
--
ALTER TABLE `formulir`
  MODIFY `id_formulir` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `jurusan`
--
ALTER TABLE `jurusan`
  MODIFY `id_jurusan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT untuk tabel `kode_pembayaran`
--
ALTER TABLE `kode_pembayaran`
  MODIFY `id_kode_pembayaran` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=710;

--
-- AUTO_INCREMENT untuk tabel `master_biaya_jurusan`
--
ALTER TABLE `master_biaya_jurusan`
  MODIFY `id_biaya` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `pembayaran_pendaftaran`
--
ALTER TABLE `pembayaran_pendaftaran`
  MODIFY `id_pembayaran` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `periode_master_biaya`
--
ALTER TABLE `periode_master_biaya`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT untuk tabel `periode_pendaftaran`
--
ALTER TABLE `periode_pendaftaran`
  MODIFY `id_periode` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `registrasi_peserta_didik`
--
ALTER TABLE `registrasi_peserta_didik`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `rewards`
--
ALTER TABLE `rewards`
  MODIFY `id_reward` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `seragam`
--
ALTER TABLE `seragam`
  MODIFY `id_seragam` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `berkas`
--
ALTER TABLE `berkas`
  ADD CONSTRAINT `berkas_ibfk_1` FOREIGN KEY (`id_formulir`) REFERENCES `formulir` (`id_formulir`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `data_ayah`
--
ALTER TABLE `data_ayah`
  ADD CONSTRAINT `data_ayah_ibfk_1` FOREIGN KEY (`id_formulir`) REFERENCES `formulir` (`id_formulir`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `data_ibu`
--
ALTER TABLE `data_ibu`
  ADD CONSTRAINT `data_ibu_ibfk_1` FOREIGN KEY (`id_formulir`) REFERENCES `formulir` (`id_formulir`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `data_periodik`
--
ALTER TABLE `data_periodik`
  ADD CONSTRAINT `data_periodik_ibfk_1` FOREIGN KEY (`id_formulir`) REFERENCES `formulir` (`id_formulir`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `data_pribadi`
--
ALTER TABLE `data_pribadi`
  ADD CONSTRAINT `data_pribadi_ibfk_1` FOREIGN KEY (`id_formulir`) REFERENCES `formulir` (`id_formulir`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `data_wali`
--
ALTER TABLE `data_wali`
  ADD CONSTRAINT `data_wali_ibfk_1` FOREIGN KEY (`id_formulir`) REFERENCES `formulir` (`id_formulir`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `detail_pembayaran_pendaftaran`
--
ALTER TABLE `detail_pembayaran_pendaftaran`
  ADD CONSTRAINT `detail_pembayaran_pendaftaran_ibfk_1` FOREIGN KEY (`id_pembayaran`) REFERENCES `pembayaran_pendaftaran` (`id_pembayaran`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detail_pembayaran_pendaftaran_ibfk_2` FOREIGN KEY (`id_periode_bayar`) REFERENCES `periode_pendaftaran` (`id_periode`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `diskon_periode`
--
ALTER TABLE `diskon_periode`
  ADD CONSTRAINT `diskon_periode_ibfk_1` FOREIGN KEY (`id_periode`) REFERENCES `periode_pendaftaran` (`id_periode`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `diskon_periode_ibfk_2` FOREIGN KEY (`id_jurusan`) REFERENCES `jurusan` (`id_jurusan`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `formulir`
--
ALTER TABLE `formulir`
  ADD CONSTRAINT `formulir_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `formulir_ibfk_2` FOREIGN KEY (`id_kode_pembayaran`) REFERENCES `kode_pembayaran` (`id_kode_pembayaran`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `master_biaya_jurusan`
--
ALTER TABLE `master_biaya_jurusan`
  ADD CONSTRAINT `master_biaya_jurusan_ibfk_1` FOREIGN KEY (`id_jurusan`) REFERENCES `jurusan` (`id_jurusan`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pembayaran_pendaftaran`
--
ALTER TABLE `pembayaran_pendaftaran`
  ADD CONSTRAINT `pembayaran_pendaftaran_ibfk_3` FOREIGN KEY (`id_jurusan`) REFERENCES `jurusan` (`id_jurusan`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pembayaran_pendaftaran_ibfk_4` FOREIGN KEY (`id_formulir`) REFERENCES `formulir` (`id_formulir`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pembayaran_pendaftaran_ibfk_5` FOREIGN KEY (`id_periode_daftar`) REFERENCES `periode_pendaftaran` (`id_periode`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `periode_master_biaya`
--
ALTER TABLE `periode_master_biaya`
  ADD CONSTRAINT `periode_master_biaya_ibfk_1` FOREIGN KEY (`id_periode`) REFERENCES `periode_pendaftaran` (`id_periode`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `periode_master_biaya_ibfk_2` FOREIGN KEY (`id_biaya`) REFERENCES `master_biaya_jurusan` (`id_biaya`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `registrasi_peserta_didik`
--
ALTER TABLE `registrasi_peserta_didik`
  ADD CONSTRAINT `registrasi_peserta_didik_ibfk_2` FOREIGN KEY (`jurusan`) REFERENCES `jurusan` (`id_jurusan`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registrasi_peserta_didik_ibfk_3` FOREIGN KEY (`id_formulir`) REFERENCES `formulir` (`id_formulir`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `rewards`
--
ALTER TABLE `rewards`
  ADD CONSTRAINT `rewards_ibfk_1` FOREIGN KEY (`id_pembayaran`) REFERENCES `pembayaran_pendaftaran` (`id_pembayaran`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
