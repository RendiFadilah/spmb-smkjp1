-- Hapus constraint dan kolom id_biaya dari periode_pendaftaran
ALTER TABLE `periode_pendaftaran` 
DROP FOREIGN KEY `periode_pendaftaran_ibfk_1`,
DROP COLUMN `id_biaya`,
DROP INDEX `urutan_periode`;

-- Buat tabel junction untuk periode dan master biaya
CREATE TABLE `periode_master_biaya` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `id_periode` int(11) NOT NULL,
    `id_biaya` int(11) NOT NULL,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `periode_biaya_unique` (`id_periode`, `id_biaya`),
    KEY `id_periode` (`id_periode`),
    KEY `id_biaya` (`id_biaya`),
    CONSTRAINT `periode_master_biaya_ibfk_1` FOREIGN KEY (`id_periode`) REFERENCES `periode_pendaftaran` (`id_periode`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `periode_master_biaya_ibfk_2` FOREIGN KEY (`id_biaya`) REFERENCES `master_biaya_jurusan` (`id_biaya`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Tambah UNIQUE constraint baru untuk urutan_periode
ALTER TABLE `periode_pendaftaran` 
ADD UNIQUE KEY `urutan_periode` (`urutan_periode`);
