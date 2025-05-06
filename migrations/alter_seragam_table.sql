-- Drop existing columns
ALTER TABLE seragam
DROP COLUMN topi,
DROP COLUMN dasi,
DROP COLUMN bet,
DROP COLUMN lokasi;

-- Add new columns
ALTER TABLE seragam
ADD COLUMN al_quran enum('Sudah','Belum') DEFAULT 'Belum' AFTER seragam_muslim,
ADD COLUMN tempat_makan enum('Sudah','Belum') DEFAULT 'Belum' AFTER al_quran,
ADD COLUMN kartu_pelajar enum('Sudah','Belum') DEFAULT 'Belum' AFTER tempat_makan,
ADD COLUMN kerudung enum('Sudah','Belum') DEFAULT 'Belum' AFTER gesper;
