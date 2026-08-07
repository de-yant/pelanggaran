# Pelanggaran App

Aplikasi frontend pencatatan pelanggaran siswa (Vue 3 + Vite) — **tampilan/UI saja, belum terhubung database**. Data memakai mock (contoh) yang tersimpan dalam memori saat aplikasi berjalan.

Gaya UI mengikuti **PWA Absensi** (mode gelap/terang otomatis, glassmorphism, mobile-first).

## Fitur

**Guru / Staf**
- Dashboard & ringkasan pelanggaran
- Data pelanggaran (daftar, cari, filter, tambah, edit, hapus)
- Master kategori pelanggaran (ringan / sedang / berat + poin)
- Form pencatatan pelanggaran
- Rekap / laporan per siswa + unduh CSV

**Siswa**
- Verifikasi NISN (10 digit) untuk masuk
- Lihat catatan & akumulasi poin pelanggaran sendiri
- Rekap dan profil

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:5175`.

- **Guru**: klik *Masuk Guru*, isi nama & sandi apa saja (demo).
- **Siswa**: masukkan NISN contoh, misal `0089123456` (Ahmad Fauzan Ramadhan) atau `0089123467` (Lukman Hakim).

## Struktur

```
src/
  assets/css/      base, components, guru, siswa, auth
  components/      AppLayout, Sidebar, Header, Footer, BottomNav, Modal, Toast, Pagination, LoadingPage, ui/Icons
  layouts/         GuruLayout, SiswaLayout, AuthLayout
  router/          route + guard role/NISN
  services/        authService (session demo) & mockData (data contoh)
  stores/ui.js     toast & modal global
  views/           landing, auth, guru/*, siswa/*, error
```

## Koneksi Database (nanti)

Ganti data di `src/services/mockData.js` dengan pemanggilan API pada langkah integrasi berikutnya.
