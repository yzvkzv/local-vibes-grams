# Local Vibes Grams — Final Version

Media sosial warga komplek, dibangun ulang dari proyek PHP lama (KomplekGram)
menjadi aplikasi Next.js modern dengan tampilan semirip mungkin dengan Instagram.

## Fitur

- **Daftar & Masuk** — sesi login tersimpan di KV (bukan sesi file PHP), jadi tidak
  hilang sendiri; kata sandi di-hash dengan scrypt.
- **Beranda** — Stories, kartu postingan ala IG (like, komentar, bagikan),
  tombol "Muat postingan lagi", saran pengguna di kolom kanan (desktop).
- **Jelajahi** — grid foto/video 3 kolom ala IG.
- **Buat Postingan** — upload foto (maks 5MB) atau video MP4 (maks 12MB) +
  caption, dengan pratinjau sebelum posting.
- **Detail Postingan** — media besar + kolom komentar.
- **Profil** — avatar, jumlah postingan/pengikut/mengikuti, tombol Ikuti,
  grid postingan ala IG.
- **DM** — daftar percakapan + chat, diperbarui otomatis tiap 7 detik.
- **Cari** — cari pengguna (username/nama) dan postingan (caption).

## Arsitektur

| Kebutuhan | Teknologi |
| --- | --- |
| Framework | Next.js 14 (App Router) + Tailwind CSS |
| Database teks (pengguna, post, like, komentar, follow, DM, sesi) | Vercel KV / Upstash Redis — satu dokumen JSON di kunci `lvg:data`, sesi di `lvg:sessions` |
| Foto & video | Vercel Blob |
| Hosting | Vercel |

Seluruh data teks disimpan sebagai satu dokumen JSON (pola yang sama dengan
aplikasi kasir Yusup Cell), jadi tidak ada lagi tabel MySQL yang tidak cocok
dengan kode — itu penyebab login di versi lama sering kacau.

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000 — tanpa KV/Blob, aplikasi jalan dalam mode lokal
(data contoh di memori server).

Akun contoh (kata sandi semuanya `demo1234`): `@yusup`, `@sari`, `@budi`,
`@dewi`, `@agus`.

## Deploy ke Vercel

1. Import repo ini ke Vercel (framework terdeteksi otomatis: Next.js).
2. Di dashboard Vercel, menu **Storage → Create Database**:
   - Buat **Upstash for Redis**, hubungkan ke project ini (env
     `UPSTASH_REDIS_REST_URL` dan `UPSTASH_REDIS_REST_TOKEN` terisi otomatis).
   - Buat **Blob**, hubungkan ke project ini (env `BLOB_READ_WRITE_TOKEN`
     terisi otomatis).
   - Satu store Upstash yang sama boleh dipakai bersama aplikasi kasir —
     kuncinya beda (`lvg:data` vs `yusup-cell:data`).
3. **Redeploy** sekali supaya env var terbaca.

## Catatan

- Foto contoh di `public/seed/` adalah kartu gradien bawaan aplikasi (bukan foto
  warga asli) — foto-foto dari folder `uploads/` lama tidak dipakai sebagai
  data contoh karena isinya acak (tangkapan layar, logo, dan foto orang).
- File upload lama lainnya (folder `uploads/` di zip asli) tidak ikut dibawa;
  bila ingin memindahkan postingan lama, unggah ulang lewat aplikasi atau
  hubungi pengembang.
- Batas paket gratis (Hobby): Blob 1 GB penyimpanan & 10 GB transfer/bulan.
  Video menghabiskan kuota lebih cepat daripada foto.
