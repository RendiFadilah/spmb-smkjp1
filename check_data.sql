-- Cek periode mana yang active
SELECT id_periode, nama_periode, status FROM periode_pendaftaran WHERE status = 'active';

-- Cek biaya untuk jurusan 14
SELECT id_biaya, id_jurusan, tahun_ajaran, total_biaya, minimal_pembayaran 
FROM master_biaya_jurusan 
WHERE id_jurusan = 14;

-- Cek relasi yang ada untuk periode active
SELECT pmb.*, pp.nama_periode, pp.status, mbj.id_jurusan, mbj.tahun_ajaran
FROM periode_master_biaya pmb
INNER JOIN periode_pendaftaran pp ON pmb.id_periode = pp.id_periode
LEFT JOIN master_biaya_jurusan mbj ON pmb.id_biaya = mbj.id_biaya
WHERE pp.status = 'active';
