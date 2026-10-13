# CAE1ION ESPORTS — Website Komunitas Tim & Brand

Website statis: dark theme elegan (hitam hangat + aksen ember orange + emas), dengan section tim, komunitas, shop, dan kontak. Dibuat dengan HTML, CSS, dan JavaScript murni — **tanpa build tools, tanpa backend**. Mode terang krem tersedia via toggle.

## Cara Menjalankan

Cara paling cepat: buka `index.html` langsung di browser (double-click).

Atau jalankan server lokal (disarankan agar konsol bersih dari error `file://`):

```bash
npx serve cae1ion-site
# lalu buka http://localhost:3000
```

## Struktur

```
cae1ion-site/
├── index.html        Beranda (hero, divisi, referral, CTA komunitas)
├── teams.html        Tim & Divisi + roster pemain (filter per game)
├── community.html    Komunitas (benefit, form tryout, CAE1ION Cup, FAQ)
├── shop.html         Official Shop (produk + filter kategori)
├── contact.html      Contact (info partner, form pesan, FAQ)
└── assets/
    ├── css/style.css     Seluruh styling (tema ember + aksen emas)
    ├── js/main.js        Interaksi: nav, filter, countdown, animasi, form
    └── img/
        ├── logo-C1N.svg  Logo resmi: maskot orca + teks C1N (header & footer)
        ├── orca.svg      Maskot orca (dekorasi hero)
        └── favicon.svg   Ikon favicon (maskot orca)
```

## Kustomisasi Cepat

| Ingin mengubah... | Edit di... |
|---|---|
| Warna tema (ember → warna kamu) | `assets/css/style.css` → variabel `--accent` / `--bg` di `:root` (gelap default; `html.light` untuk mode terang) |
| Logo resmi (maskot orca + C1N) | Dipakai `assets/img/logo-C1N.svg` (hitam, transparan — otomatis dibalik putih di area/footer gelap). |
| Nama brand | Cari-ganti teks nama di semua `.html` |
| Roster pemain | Kartu `.player` di `teams.html` |
| Produk merchandise | Kartu `.product` di `shop.html` |
| Font | Link Google Fonts di `<head>` tiap halaman + `--font-head` / `--font-body` |

## Catatan Teknis

- **Animasi**: element dengan class `.reveal` muncul saat discroll (IntersectionObserver).
- **Filter tab**: bekerja lewat atribut `data-filter-group`, `data-filter-target`, dan `data-game` pada item.
- **Countdown**: hitung mundur otomatis ke tanggal di `data-countdown`.
- **Form** (tryout, contact, newsletter): demo saja — tampil pesan sukses tanpa mengirim data. Hubungkan ke backend (Formspree, Google Forms, atau API sendiri) bila perlu dipakai produksi.
- **Gambar**: placeholder digambar dengan CSS/SVG. Ganti dengan foto asli (roster, produk, artikel) dengan menambahkan `<img>` di dalam `.player-photo`, `.product-img`, atau `.article-img`.
- **Responsif**: layout menyesuaikan sampai lebar 360px; navigasi berubah jadi hamburger di bawah 900px.

