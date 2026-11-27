# Fitri Novia — A Birthday Story Made With Love ♡

Website hadiah ulang tahun ke-23 yang dibuat seperti karya studio desain
editorial: warm ivory, champagne gold, dusty rose, deep mocha. Tanpa
framework, tanpa build step — cukup folder ini di-hosting atau dibuka
langsung.

## Isi website (12 bagian)

1. **Opening film pendek** — hitung mundur **3 · 2 · 1** (angka serif besar,
   glow + cincin emas), lalu **REVEAL 1**: tulisan raksasa **HAPPY
   BIRTHDAY!** sendirian di layar (script *Happy* + serif besar, sapuan
   cahaya emas, kelopak jatuh), memudar dengan blur — baru **REVEAL 2**:
   **Fitri Novia**, garis emas, *23rd Birthday* dan *27 November 2026*.
   Urutan ini dijamin: nama tidak pernah muncul sebelum HAPPY BIRTHDAY
   selesai. Tombol *Buka Cerita & Putar Musik* membuka "pintu album".
   Ada tombol **lewati** di pojok kanan atas.
2. **Birthday Cover** — sampul majalah premium: *Happy 23rd Birthday*,
   Fitri Novia, 27 November 2026, foto sampul.
3. **Memory Gallery — album kenangan** — **satu scene untuk satu foto**,
   dibuka satu per satu (bukan grid, bukan semua sekaligus):
   (1) scrapbook dengan washi tape, (2) bingkai **hati** sungguhan
   (clipping mask + outline champagne), (3) editorial Pinterest,
   (4) polaroid premium, (5) arch dengan bunga kecil, (6) sinematik gelap
   penutup — *"A memory I'll always keep ♡"*. Navigasi **Previous / Next**,
   indikator **01/06**, titik pilih, **swipe di HP**, panah keyboard;
   bingkai muncul dulu dan **caption menyusul sesudahnya**.
4. **Video Memory** — "A Little Memory to Keep": video asli dalam bingkai
   sinematik, poster + tombol putar elegan, kontrol lengkap (putar, jeda,
   volume, progress, fullscreen). Musik otomatis mereda saat video jalan.
5. **A Letter For You** — amplop terbuka sendiri menjadi surat lengkap
   dengan prangko foto, cap pos, dan paragraf yang muncul perlahan.
6. **Memory Timeline** — kerangka kenangan yang bisa kamu isi sendiri
   (tanpa tanggal/cerita karangan — lihat *KENANGAN EDITABLE* di index.html).
7. **Why You're Special** — empat alasan bergaya editorial.
8. **A Little Reminder** — lima pengingat lembut.
9. **A Birthday Gift** — hadiah virtual (kotak utuh, tutup terpisah,
   pita satin champagne): klik pitanya → isi melayang naik + pesan khusus.
10. **Chapter 23** — angka 23 besar dengan gema outline + pesan bab baru.
11. **My Wishes For You** — tujuh doa dengan animasi lembut.
12. **Grand Finale** — tiga kalimat penutup + **kartu hati mawar**:
    panel gelap berisi **hati dari mawar merah berpita satin merah**
    (seperti buket love) di samping kartu QR putih "SCAN ME ♡" (QR
    otomatis menuju URL halaman ini — tujuan sama dengan
    `tools/qr-generator.html`) + tombol *Ulangi dari Awal* (musik tidak
    berhenti saat mengulang, countdown ikut diulang).

Navigasi titik di sisi kanan (desktop) + garis progres di atas.
**Pemutar musik** minimalis menempel di pojok kiri-bawah: tombol
putar/jeda, judul lagu, visualizer, dan tombol volume.

## Cara membuka / hosting

**Buka langsung:** ekstrak seluruh folder, lalu buka `index.html`.
Folder harus tetap utuh (foto, video, latar, musik menempel di folder).

**Hosting (disarankan — untuk QR):**
- [Netlify Drop](https://app.netlify.com/drop): seret folder ini ke halaman
  itu → langsung online, tanpa konfigurasi.
- Alternatif: Vercel, GitHub Pages, Cloudflare Pages.
- Local test: `python3 -m http.server 8000` di dalam folder ini.

## Musik — file pilihan sendiri (sudah TERPASANG & TERUJI)

Musik utama adalah **file yang diunggah sendiri**:
`assets/audio/Download (5).mp4` (audio track AAC, ±88 detik) — sudah
diuji langsung di browser: **benar-benar bersuara**, tidak mute, volume
normal. File diputar lewat elemen video tersembunyi 1px (cara paling
kompatibel untuk MP4 di semua browser).

Urutan sumber otomatis:
1. **`assets/audio/Download (5).mp4`** — musik pilihan sendiri (utama).
2. **Pink Matter via YouTube** (kanal resmi *Blonded*) — cadangan kalau
   file utama gagal dimuat.
3. **Piano generatif lembut** — dibuat langsung oleh browser, selalu
   berbunyi, jadi website tidak pernah hening.

Autoplay: website mencoba memutar otomatis saat dibuka; kalau browser
memblokir, muncul chip **"♪ Tap to play music"** — satu ketukan, musik
langsung jalan (juga lewat tombol *Buka Cerita & Putar Musik*).

**Pemutar vinyl floating** di pojok kiri-bawah: piringan hitam yang
**berputar hanya saat musik benar-benar berputar** (berhenti saat
dijeda), tombol putar/jeda, equalizer animasi, status *berputar lembut ♪ /
dijeda*, judul, dan tombol volume (slider). Musik otomatis mereda saat
video kenangan diputar. Penjelasan singkat juga tersedia di
`assets/audio/LETAKKAN-MUSIK-DI-SINI.txt`.

## QR Code love

QR **sungguhan dan teruji terbaca** (error correction H, quiet zone penuh,
desain: modul deep mocha di atas ivory, bingkai champagne, ornamen hati
dusty rose di luar pola — tidak menutup satu modul pun).

URL final belum ada sebelum di-hosting, jadi QRnya dibuat SETELAH deploy:

- **Di dalam website (otomatis):** bagian *Grand Finale* memuat QR yang
  otomatis mengarah ke URL halaman itu sendiri — setelah deploy, QR di
  sana langsung benar tanpa disetel.
- **Cara termudah untuk cetak:** buka `tools/qr-generator.html` di browser
  (klik dua kali), tempel URL Netlify, klik *Buat QR Love*, unduh **PNG**
  (±1764 px, siap cetak) dan **SVG** (vektor).
- **Dengan Python:** `python tools/generate_qr.py "https://nama-kamu.netlify.app"`
  → hasil di folder `qr/`.
- Uji: pindai PNG dengan kamera HP sebelum dicetak/dikirim.

## Struktur file

```
birthday-fitrinovia/
├── index.html          ← seluruh isi website (12 bagian)
├── styles.css          ← desain editorial (palet di :root, mudah diubah)
├── app.js              ← interaksi: musik, galeri, hadiah, navigasi…
├── assets/
│   ├── images/         ← 6 foto asli (photo-1.jpg … photo-6.jpg)
│   ├── video/          ← birthday-video.mp4 + poster.jpg
│   ├── audio/          ← (opsional) letakkan background-music.mp3 di sini
│   └── env/            ← 12 latar fotografi suasana, satu per bagian
├── tools/
│   ├── qr-generator.html     ← generator QR love (buka di browser)
│   ├── generate_qr.py        ← alternatif CLI (butuh: pip install qrcode pillow)
│   └── qrcode-generator.js   ← pustaka QR (MIT) untuk halaman generator
└── qr/                 ← hasil QR akan tersimpan di sini
```

## Mengedit isi

Cari komentar `<!-- EDITABLE: ... -->` di `index.html`: foto & caption,
surat, timeline kenangan, alasan istimewa, pengingat, pesan hadiah, doa.
Warna: blok `:root` paling atas di `styles.css`.

## Catatan teknis

- Responsif 360–430 px, tablet, laptop, desktop; tanpa scroll horizontal.
- Hormati `prefers-reduced-motion` (animasi otomatis diredakan).
- Semua foto asli dipakai apa adanya; wajah dan identitas tidak diubah.
- Lazy loading untuk latar; foto sampul & galeri tetap responsif.
- Tanpa dependensi eksternal selain Google Fonts (ada fallback serif/sans).
