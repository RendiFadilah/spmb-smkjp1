-- Debug script untuk cek data biaya

-- 1. Cek master biaya untuk jurusan 14
SELECT 'Master Biaya Jurusan 14:' as info;
SELECT * FROM master_biaya_jurusan WHERE id_jurusan = 14;

-- 2. Cek semua periode
SELECT 'Semua Periode:' as info;
SELECT * FROM periode_pendaftaran;

-- 3. Cek periode aktif
SELECT 'Periode Aktif:' as info;
SELECT * FROM periode_pendaftaran WHERE status = 'active';

-- 4. Cek semua relasi periode-biaya
SELECT 'Relasi Periode-Biaya:' as info;
SELECT * FROM periode_master_biaya;

-- 5. Cek query JOIN lengkap untuk jurusan 14
SELECT 'Query JOIN untuk Jurusan 14:' as info;
SELECT 
    mbj.id_biaya,
    mbj.id_jurusan,
    mbj.tahun_ajaran,
    mbj.total_biaya,
    mbj.minimal_pembayaran,
    pp.id_periode,
    pp.nama_periode,
    pp.status,
    pmb.id as pmb_id
FROM master_biaya_jurusan mbj
INNER JOIN periode_master_biaya pmb ON mbj.id_biaya = pmb.id_biaya
INNER JOIN periode_pendaftaran pp ON pmb.id_periode = pp.id_periode
WHERE mbj.id_jurusan = 14 
AND pp.status = 'active';
