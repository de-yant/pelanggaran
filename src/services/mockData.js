import { reactive } from "vue";

/* =========================================================
   MOCK DATA — UI DEMO (belum terhubung database)
   ========================================================= */

function iso(daysAgo, hour, minute) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function tanggalLocal(daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export const siswaList = reactive([
  { id: "s1", nama: "Ahmad Fauzan Ramadhan", nisn: "0089123456", kelas: "X TKJ 1", rombel: "X TKJ 1" },
  { id: "s2", nama: "Bella Kartika Sari", nisn: "0089123457", kelas: "X TKJ 1", rombel: "X TKJ 1" },
  { id: "s3", nama: "Candra Wijaya", nisn: "0089123458", kelas: "X TKJ 2", rombel: "X TKJ 2" },
  { id: "s4", nama: "Dewi Anggraini", nisn: "0089123459", kelas: "X TKJ 2", rombel: "X TKJ 2" },
  { id: "s5", nama: "Eka Prasetyo", nisn: "0089123460", kelas: "XI RPL 1", rombel: "XI RPL 1" },
  { id: "s6", nama: "Fajar Nugroho", nisn: "0089123461", kelas: "XI RPL 1", rombel: "XI RPL 1" },
  { id: "s7", nama: "Gita Permata", nisn: "0089123462", kelas: "XI RPL 2", rombel: "XI RPL 2" },
  { id: "s8", nama: "Hendra Saputra", nisn: "0089123463", kelas: "XI RPL 2", rombel: "XI RPL 2" },
  { id: "s9", nama: "Intan Permatasari", nisn: "0089123464", kelas: "XII TKJ 1", rombel: "XII TKJ 1" },
  { id: "s10", nama: "Joko Susilo", nisn: "0089123465", kelas: "XII TKJ 1", rombel: "XII TKJ 1" },
  { id: "s11", nama: "Kurnia Ayu Lestari", nisn: "0089123466", kelas: "XII RPL 1", rombel: "XII RPL 1" },
  { id: "s12", nama: "Lukman Hakim", nisn: "0089123467", kelas: "XII RPL 1", rombel: "XII RPL 1" },
]);

export const kategoriList = reactive([
  { id: "k1", nama: "Terlambat masuk sekolah", level: "RINGAN", poin: 5, deskripsi: "Datang melebihi batas waktu masuk." },
  { id: "k2", nama: "Tidak memakai seragam lengkap", level: "RINGAN", poin: 5, deskripsi: "Seragam tidak sesuai ketentuan sekolah." },
  { id: "k3", nama: "Membuang sampah sembarangan", level: "RINGAN", poin: 5, deskripsi: "Menjaga kebersihan lingkungan sekolah." },
  { id: "k4", nama: "Berbicara kurang sopan", level: "SEDANG", poin: 10, deskripsi: "Menggunakan kata-kata tidak pantas kepada guru/teman." },
  { id: "k5", nama: "Meninggalkan kelas tanpa izin", level: "SEDANG", poin: 10, deskripsi: "Meninggalkan jam pelajaran tanpa keterangan." },
  { id: "k6", nama: "Membawa handphone saat jam pelajaran", level: "SEDANG", poin: 10, deskripsi: "HP digunakan di luar kepentingan pembelajaran." },
  { id: "k7", nama: "Terlibat perkelahian", level: "BERAT", poin: 25, deskripsi: "Berkelahi di lingkungan sekolah maupun luar." },
  { id: "k8", nama: "Membawa rokok / barang terlarang", level: "BERAT", poin: 25, deskripsi: "Barang terlarang sesuai tata tertib sekolah." },
]);

export const pelanggaranList = reactive([
  { id: "p1", siswa_id: "s1", kategori_id: "k1", tanggal: tanggalLocal(0), waktu: "07:05", keterangan: "Datang jam 07.05, keterlambatan 5 menit", pencatat: "Budi Santoso", status: "MENUNGGU" },
  { id: "p2", siswa_id: "s2", kategori_id: "k3", tanggal: tanggalLocal(0), waktu: "10:20", keterangan: "Membuang bungkus snack di koridor", pencatat: "Budi Santoso", status: "DIPROSES" },
  { id: "p3", siswa_id: "s3", kategori_id: "k4", tanggal: tanggalLocal(1), waktu: "08:15", keterangan: "Berkata kasar saat jam pelajaran", pencatat: "Dewi Lestari", status: "SELESAI" },
  { id: "p4", siswa_id: "s5", kategori_id: "k6", tanggal: tanggalLocal(1), waktu: "09:30", keterangan: "HP aktif saat ulangan", pencatat: "Dewi Lestari", status: "DIPROSES" },
  { id: "p5", siswa_id: "s8", kategori_id: "k1", tanggal: tanggalLocal(2), waktu: "06:58", keterangan: "Terlambat 8 menit", pencatat: "Budi Santoso", status: "SELESAI" },
  { id: "p6", siswa_id: "s4", kategori_id: "k5", tanggal: tanggalLocal(2), waktu: "11:00", keterangan: "Keluar kelas tanpa izin saat jam ke-4", pencatat: "Dewi Lestari", status: "MENUNGGU" },
  { id: "p7", siswa_id: "s6", kategori_id: "k2", tanggal: tanggalLocal(3), waktu: "07:10", keterangan: "Tidak memakai dasi", pencatat: "Budi Santoso", status: "SELESAI" },
  { id: "p8", siswa_id: "s9", kategori_id: "k7", tanggal: tanggalLocal(3), waktu: "13:40", keterangan: "Terlibat cekcok fisik di lapangan", pencatat: "Dewi Lestari", status: "DIPROSES" },
  { id: "p9", siswa_id: "s10", kategori_id: "k1", tanggal: tanggalLocal(4), waktu: "07:12", keterangan: "Terlambat 12 menit", pencatat: "Budi Santoso", status: "SELESAI" },
  { id: "p10", siswa_id: "s11", kategori_id: "k8", tanggal: tanggalLocal(5), waktu: "09:00", keterangan: "Kedapatan membawa rokok", pencatat: "Dewi Lestari", status: "MENUNGGU" },
  { id: "p11", siswa_id: "s12", kategori_id: "k4", tanggal: tanggalLocal(6), waktu: "08:45", keterangan: "Menjawab guru dengan nada tinggi", pencatat: "Budi Santoso", status: "SELESAI" },
  { id: "p12", siswa_id: "s2", kategori_id: "k6", tanggal: tanggalLocal(7), waktu: "10:00", keterangan: "Bermain HP saat jam pelajaran", pencatat: "Dewi Lestari", status: "DIPROSES" },
  { id: "p13", siswa_id: "s7", kategori_id: "k1", tanggal: tanggalLocal(7), waktu: "07:02", keterangan: "Terlambat 2 menit", pencatat: "Budi Santoso", status: "SELESAI" },
  { id: "p14", siswa_id: "s1", kategori_id: "k6", tanggal: tanggalLocal(8), waktu: "09:10", keterangan: "HP berdering di dalam kelas", pencatat: "Dewi Lestari", status: "SELESAI" },
  { id: "p15", siswa_id: "s3", kategori_id: "k7", tanggal: tanggalLocal(10), waktu: "14:00", keterangan: "Beradu fisik dengan siswa kelas lain", pencatat: "Budi Santoso", status: "SELESAI" },
]);

const notifikasi = reactive([
  { id: "n1", title: "Pelanggaran baru", message: "Ahmad Fauzan Ramadhan: Terlambat masuk sekolah", time: "Baru saja", read: false },
  { id: "n2", title: "Menunggu tindak lanjut", message: "Intan Permatasari: Terlibat perkelahian", time: "1 jam lalu", read: false },
  { id: "n3", title: "Poin siswa hampir batas", message: "Candra Wijaya sudah mencapai 30 poin", time: "3 jam lalu", read: true },
  { id: "n4", title: "Laporan selesai", message: "Rekap pelanggaran mingguan tersedia", time: "Kemarin", read: true },
]);

let seq = 1000;
export function nextId(prefix) {
  return `${prefix}${++seq}`;
}

export function getSiswa() {
  return siswaList.map((s) => ({ ...s }));
}

export function getSiswaById(id) {
  return siswaList.find((s) => s.id === id) || null;
}

export function getSiswaByNisn(nisn) {
  const val = String(nisn || "").trim();
  return siswaList.find((s) => s.nisn === val) || null;
}

export function getKategori() {
  return kategoriList.map((k) => ({ ...k }));
}

export function getKategoriById(id) {
  return kategoriList.find((k) => k.id === id) || null;
}

export function getPelanggaran() {
  return pelanggaranList.map((p) => {
    const siswa = getSiswaById(p.siswa_id);
    const kategori = getKategoriById(p.kategori_id);
    return {
      ...p,
      siswa_nama: siswa?.nama || "-",
      siswa_nisn: siswa?.nisn || "-",
      siswa_kelas: siswa?.kelas || "-",
      kategori_nama: kategori?.nama || "-",
      kategori_level: kategori?.level || "-",
      poin: kategori?.poin || 0,
    };
  });
}

export function getPelanggaranBySiswa(siswaId) {
  return getPelanggaran().filter((p) => p.siswa_id === siswaId);
}

export function addPelanggaran({ siswa_id, kategori_id, tanggal, waktu, keterangan, pencatat = "Budi Santoso", status = "MENUNGGU" }) {
  const id = nextId("p");
  pelanggaranList.unshift({ id, siswa_id, kategori_id, tanggal, waktu, keterangan, pencatat, status });
  return id;
}

export function updatePelanggaran(id, patch) {
  const idx = pelanggaranList.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  Object.assign(pelanggaranList[idx], patch);
  return true;
}

export function deletePelanggaran(id) {
  const idx = pelanggaranList.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  pelanggaranList.splice(idx, 1);
  return true;
}

export function addKategori({ nama, level, poin, deskripsi }) {
  const id = nextId("k");
  kategoriList.push({ id, nama, level, poin, deskripsi });
  return id;
}

export function updateKategori(id, patch) {
  const idx = kategoriList.findIndex((k) => k.id === id);
  if (idx === -1) return false;
  Object.assign(kategoriList[idx], patch);
  return true;
}

export function deleteKategori(id) {
  const idx = kategoriList.findIndex((k) => k.id === id);
  if (idx === -1) return false;
  const used = pelanggaranList.some((p) => p.kategori_id === id);
  if (used) return false;
  kategoriList.splice(idx, 1);
  return true;
}

export function getMockNotifikasi() {
  return notifikasi.map((n) => ({ ...n }));
}

export function markAllNotifRead() {
  notifikasi.forEach((n) => { n.read = true; });
}

export function getPoinSiswa(siswaId) {
  return getPelanggaranBySiswa(siswaId).reduce((sum, p) => sum + p.poin, 0);
}

export function getStatistik() {
  const rows = getPelanggaran();
  const total = rows.length;
  const poinTotal = rows.reduce((s, r) => s + r.poin, 0);
  const perLevel = {
    RINGAN: rows.filter((r) => r.kategori_level === "RINGAN").length,
    SEDANG: rows.filter((r) => r.kategori_level === "SEDANG").length,
    BERAT: rows.filter((r) => r.kategori_level === "BERAT").length,
  };
  const perStatus = {
    MENUNGGU: rows.filter((r) => r.status === "MENUNGGU").length,
    DIPROSES: rows.filter((r) => r.status === "DIPROSES").length,
    SELESAI: rows.filter((r) => r.status === "SELESAI").length,
  };
  return { total, poinTotal, perLevel, perStatus };
}
