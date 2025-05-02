-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id_user INT PRIMARY KEY AUTO_INCREMENT,
  nama_lengkap VARCHAR(255) NOT NULL,
  nomor_whatsapp VARCHAR(20) NOT NULL UNIQUE,
  nisn VARCHAR(10) NOT NULL UNIQUE,
  asal_smp VARCHAR(255) NOT NULL,
  jenis_kelamin ENUM('Laki-laki', 'Perempuan') NOT NULL,
  password VARCHAR(255) NOT NULL,
  roles ENUM('Admin', 'Bendahara', 'Petugas', 'CPDB') NOT NULL DEFAULT 'CPDB',
  tanggal_daftar DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status_wawancara ENUM('Sudah', 'Belum') NOT NULL DEFAULT 'Belum'
);

-- Insert default admin user
INSERT INTO users (
  nama_lengkap,
  nomor_whatsapp,
  nisn,
  asal_smp,
  jenis_kelamin,
  password,
  roles,
  status_wawancara
) VALUES (
  'Administrator',
  '081234567890',
  '0000000000',
  'Admin',
  'Laki-laki',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LHd.qR3nFGNgQO4Gu', -- Password: Admin123
  'Admin',
  'Sudah'
);

-- Create kode_pembayaran table
CREATE TABLE IF NOT EXISTS kode_pembayaran (
  id_kode INT PRIMARY KEY AUTO_INCREMENT,
  kode VARCHAR(10) NOT NULL UNIQUE,
  status ENUM('Aktif', 'Terpakai') NOT NULL DEFAULT 'Aktif',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create formulir table with registration progress tracking
CREATE TABLE IF NOT EXISTS formulir (
  id_formulir INT PRIMARY KEY AUTO_INCREMENT,
  id_user INT NOT NULL,
  id_kode INT NOT NULL,
  nominal_formulir INT NOT NULL,
  bukti_bayar VARCHAR(255),
  data_diri_completed BOOLEAN DEFAULT FALSE,
  berkas_completed BOOLEAN DEFAULT FALSE,
  preview_completed BOOLEAN DEFAULT FALSE,
  pembayaran_completed BOOLEAN DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES users(id_user),
  FOREIGN KEY (id_kode) REFERENCES kode_pembayaran(id_kode)
);

-- Create data_diri table for storing form data
CREATE TABLE IF NOT EXISTS data_diri (
  id_data INT PRIMARY KEY AUTO_INCREMENT,
  id_formulir INT NOT NULL,
  tempat_lahir VARCHAR(255) NOT NULL,
  tanggal_lahir DATE NOT NULL,
  email VARCHAR(255) NOT NULL,
  no_hp VARCHAR(20) NOT NULL,
  jurusan VARCHAR(50) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_formulir) REFERENCES formulir(id_formulir)
);

-- Create berkas table for storing uploaded documents
CREATE TABLE IF NOT EXISTS berkas (
  id_berkas INT PRIMARY KEY AUTO_INCREMENT,
  id_formulir INT NOT NULL,
  ijazah_path VARCHAR(255) NOT NULL,
  skhun_path VARCHAR(255) NOT NULL,
  kk_path VARCHAR(255) NOT NULL,
  sertifikat_paths TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_formulir) REFERENCES formulir(id_formulir)
);

-- Create rewards table for SPMB rewards
CREATE TABLE IF NOT EXISTS rewards (
  id_reward INT PRIMARY KEY AUTO_INCREMENT,
  tanggal_reward DATETIME NOT NULL,
  id_pembayaran INT NOT NULL,
  nama_pembawa VARCHAR(100) NOT NULL,
  keterangan_pembawa VARCHAR(100) NOT NULL,
  no_wa_pembawa BIGINT NOT NULL,
  nominal INT NOT NULL,
  nama_petugas VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_pembayaran) REFERENCES pembayaran_pendaftaran(id_pembayaran) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
