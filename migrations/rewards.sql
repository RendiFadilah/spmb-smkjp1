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
