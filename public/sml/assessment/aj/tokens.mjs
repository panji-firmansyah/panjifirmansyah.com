// Sumber token tunggal Agent Jakarta, arah Warna Asli.
// Dari sini dibuat tokens.css (dipakai halaman fondasi) dan DESIGN.md (spec Google Labs).
// Palet diambil dari papan putaran 3 (median piksel), bukan ditebak, lalu disetel 30 Okt 2026.
// Palet B Disetel (DEC-47, dipilih Panji 30 Okt 2026): kunyit tetap; pandan, telang, secang disetel ke arah pewarna aslinya.
// Palet awal dari gambar logo: pandan #3CD670, telang #0F55FC, secang #FD4F86 (arsip). Warna tua diturunkan dari rona baru (tools/warna-tua.mjs).

export const meta = {
  name: 'Agent Jakarta',
  description: 'Kelas AI untuk kerja nyata. Arah visual Warna Asli: kupas warna dan gelombang.',
  concept: 'Kupas warnamu. Lapisan warna terkelupas dan memperlihatkan warna di bawahnya: AI mengupas kerja rutin, warna asli orangnya kelihatan.',
  // Prinsip inti (Panji, 31 Okt 2026; memory brand.md): saringan pertama untuk tiap pilihan desain, copy, dan produk.
  principle: 'Mudah dipahami, mudah dipakai, hangat dan menyambut. Yang rumit dibuat sederhana.',
  version: '2026-10-31',
};

// Warna palet: nama dari pewarna alami dan dapur Indonesia.
export const palette = {
  pandan: { hex: '#0CBD5D', on: 'tinta', role: 'Hijau daun pandan. Bidang, lapisan, ubin ikon. Tidak pernah untuk teks.' },
  telang: { hex: '#314DF5', on: 'kapur', role: 'Biru bunga telang. Bidang, tautan, cincin fokus.' },
  kunyit: { hex: '#FFD119', on: 'tinta', role: 'Kuning kunyit. Lencana Done Before Lunch, kartu sorotan. Tidak pernah untuk teks.' },
  secang: { hex: '#EF3F81', on: 'tinta', role: 'Merah muda kayu secang. Bidang dan stiker. Teks putih di atasnya hanya ukuran display.' },
  tinta: { hex: '#031130', on: 'kapur', role: 'Biru tinta. Semua teks, wordmark, tombol utama, lapisan paling bawah.' },
};

// Netral dan warna fungsi.
export const neutral = {
  kapur: { hex: '#FFFFFF', on: 'tinta', role: 'Putih kapur. Permukaan kartu dan layar.' },
  awan: { hex: '#F3F4F7', on: 'tinta', role: 'Latar halaman di bawah kartu putih.' },
  asap: { hex: '#5B6478', role: 'Teks pendukung dan keterangan. Kontras 5,9 di kapur, 5,4 di awan.' },
  benang: { hex: '#D9DCE3', role: 'Garis pemisah 1 px. Dekoratif, bukan batas kontrol.' },
  batas: { hex: '#8A93A8', role: 'Garis isian dan tombol garis saat diam. Kontras 3,1 di kapur.' },
  'telang-tua': { hex: '#293DE6', on: 'kapur', role: 'Cadangan. Dulu tombol utama saat ditekan; kontrol stiker kit menempel tanpa ganti warna (DEC-60), jadi belum ada komponen yang memakainya. Kontras 7,2 dengan kapur.' },
  'pandan-tua': { hex: '#0A793A', role: 'Teks berhasil (Tersimpan, Beres). Kontras 5,5 di kapur.' },
  'secang-tua': { hex: '#C30D60', role: 'Teks galat. Kontras 5,9 di kapur.' },
};

// Urutan lapisan kupas dan pita gelombang, atas ke bawah.
export const lapisan = ['pandan', 'telang', 'kunyit', 'secang', 'tinta'];

export const font = {
  display: { family: 'Anybody', weight: 900, variation: "'wdth' 80", fallback: '"Arial Black", system-ui, sans-serif' },
  teks: { family: 'Plus Jakarta Sans', weight: 400, fallback: 'system-ui, -apple-system, sans-serif' },
  googleFonts: 'https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@80,900&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap',
};

// Skala huruf. Tinggi baris selalu px (detail-komponen).
export const type = {
  display: { font: 'display', size: 96, line: 88, track: '-0.04em', use: 'Wordmark dan satu kalimat besar per halaman.' },
  'display-hp': { font: 'display', size: 56, line: 52, track: '-0.04em', use: 'Display di layar 390.' },
  judul: { font: 'display', size: 48, line: 48, track: '-0.03em', use: 'Judul seksi dan pesan penting.' },
  'judul-hp': { font: 'display', size: 36, line: 36, track: '-0.03em', use: 'Judul di layar 390.' },
  subjudul: { font: 'teks', weight: 700, size: 28, line: 36, track: '-0.01em', use: 'Subjudul dan penjelasan singkat.' },
  'teks-besar': { font: 'teks', weight: 400, size: 19, line: 28, track: '0em', use: 'Paragraf pembuka.' },
  teks: { font: 'teks', weight: 400, size: 17, line: 24, track: '0em', use: 'Teks paragraf utama.' },
  'teks-kecil': { font: 'teks', weight: 400, size: 15, line: 20, track: '0em', use: 'Isi kartu dan daftar.' },
  label: { font: 'teks', weight: 600, size: 15, line: 20, track: '0em', use: 'Label kontrol, chip, judul kartu kecil. Huruf kalimat, bukan kapital semua.' },
  tombol: { font: 'teks', weight: 700, size: 17, line: 24, track: '0em', use: 'Teks tombol.' },
  keterangan: { font: 'teks', weight: 400, size: 13, line: 16, track: '0em', use: 'Keterangan, waktu, meta. Batas bawah ukuran teks.' },
};

// Sistem ukuran (detail-komponen): satu radius per jenis, sudut konsentris.
export const radius = {
  pil: { px: 999, use: 'Yang ditekan dan berteks: tombol, chip, lencana, tombol Menu bilah. Keputusan brand dari papan rujukan.' },
  kartu: { px: 24, use: 'Kartu, panel, pulau bilah atas, notifikasi, sheet.' },
  ubin: { px: 16, use: 'Ubin ikon, tombol ikon 48, tombol Menu di pulau (sepusat: 24 - 8), gambar kecil. Di dalam kartu 24 dengan jarak 8.' },
  isian: { px: 12, use: 'Kolom isian, keterangan, tombol ikon kecil 32. Di dalam kartu 24 dengan jarak 12.' },
  kotak: { px: 8, use: 'Kotak pilihan 24.' },
  layar: { px: 44, use: 'Bingkai HP pada mockup.' },
};

export const garis = {
  tipis: { px: 1, use: 'Pemisah dan cincin.' },
  diam: { px: 1.5, use: 'Isian dan tombol garis saat diam (inset box-shadow, supaya tetap 1,5).' },
  aktif: { px: 2, use: 'Fokus, terpilih, berhasil, galat.' },
  'cincin-fokus': { px: 4, use: 'Token bernama: celah Kapur 2 lalu cincin Telang 2 di luar tombol yang difokus keyboard.' },
  'bingkai-hp': { px: 10, use: 'Token bernama: bezel mockup HP, bukan bagian produk.' },
};

export const jarak = {
  1: { px: 4, use: 'Judul ke keterangan.' },
  2: { px: 8, use: 'Label ke isian, ikon ke teks, jarak ubin di kartu daftar.' },
  3: { px: 12, use: 'Antar isian, antar chip, jarak isi pulau.' },
  4: { px: 16, use: 'Padding kontrol, antar kartu daftar.' },
  5: { px: 20, use: 'Padding kartu kecil.' },
  6: { px: 24, use: 'Padding kartu, tepi layar HP.' },
  8: { px: 32, use: 'Antar blok dalam seksi.' },
  12: { px: 48, use: 'Antar seksi di HP.' },
  16: { px: 64, use: 'Antar seksi di desktop.' },
};

export const tinggi = {
  tombol: { px: 48, use: 'Tombol bawaan.' },
  'tombol-besar': { px: 56, use: 'Tombol utama di bawah layar HP.' },
  chip: { px: 36, use: 'Chip filter.' },
  isian: { px: 48, use: 'Kolom isian.' },
  ubin: { px: 56, use: 'Ubin memuat (Pasang) dan ubin besar.' },
  'ubin-ikon': { px: 48, use: 'Ubin ikon stiker dan tombol ikon (kit).' },
};

export const gerak = {
  cepat: { ms: 160, use: 'Hover, tekan.' },
  sedang: { ms: 320, use: 'Ganti keadaan, notifikasi masuk.' },
  panjang: { ms: 720, use: 'Satu momen per halaman: lapisan terkelupas, gelombang mengalir.' },
  lentur: { ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)', use: 'Masuk dan menjawab aksi.' },
  kupas: { ease: 'cubic-bezier(0.65, 0, 0.35, 1)', use: 'Lapisan terkelupas.' },
};

export const bayang = {
  kupas: { css: '0 2px 6px rgba(3, 17, 48, 0.18)', use: 'Hanya di bawah lipatan kupas, stiker, dan Pita tempel. Kartu tidak berbayang.' },
};

// Kedalaman (putaran kedalaman 31 Okt 2026, DEC-51: agen C Melayang, gelombang Pita Tempel). Final, Oke Panji 31 Okt 2026 (DEC-52).
// Komponen agen (dsq/dsq.mjs), mesin gelombang (opsi stiker), dan mockup merek membaca angka ini; DESIGN.md ditulis dari sini juga.
export const kedalaman = {
  prinsip: 'Agen melayang, Pita ditempel, Pasang rata.',
  tepi: { warna: 'kapur', bagi: 14, min: 2, use: 'Tepi stiker agen = sisi wajah / 14, dibulatkan, paling tipis 2. Radius tepi = radius badan + tebal tepi, sudut kontinu yang sama.' },
  melayang: { tinggi: 0.14, ayun: 2, ayunDetik: 3.6, miring: 10, alas: { lebar: 0.84, tinggi: 0.14, alfa: 0.22 }, use: 'Agen mengambang sisi wajah x 0,14 di atas alasnya. Wajah mengayun 2 px tiap 3,6 detik dan miring sampai 10 derajat ke penunjuk atau arah seret; pulau dan kartu diam di ketinggiannya. Bayang alas elips Tinta, mengecil saat agen makin tinggi.' },
  takik: { judul: 12, use: 'Kepala agen persegi utuh di takik kiri atas kartu. Takik = kepala + tepi; celah putih = tepi; sudut cekung = radius kepala + tepi (sepusat); ujung takik = radius kepala; judul mulai takik + 12.' },
  pita: { bagi: 4, min: 2, tebalMin: 12, acuanMockup: 20, use: 'Tepi Kapur tebal pita / 4 (paling tipis 2) dan bayang kupas di layar; cetak bertepi tanpa bayang; pita di bawah 12 (garis bawah tab) tidak distiker.' },
};

// Kit detail: komponen kecil (gabungan pilihan Panji DEC-59; kit Oke Panji 31 Okt 2026, DEC-60; ikon A Padat, DEC-61).
// Final terukur, Oke Panji 31 Okt 2026 (DEC-62). kit/kit.css membaca stiker lewat tokens.css (--stiker-*); DESIGN.md ditulis dari sini.
export const kit = {
  prinsip: 'Kontrol adalah stiker bertepi Kapur: terangkat saat ditunjuk, menempel saat ditekan.',
  bahasaUI: 'Semua teks UI bahasa Inggris dengan kata paling umum (Panji 31 Okt 2026): menu, tombol, chip, lencana, notifikasi, sampai favicon.',
  stiker: {
    4: { css: '0 0 0 4px var(--kapur), 0 2px 6px 4px rgba(3, 17, 48, 0.18)', use: 'Tepi 4 untuk kontrol 48 ke atas: tombol, tombol ikon, ubin ikon, tombol kirim, notifikasi.' },
    '4-tunjuk': { css: '0 0 0 4px var(--kapur), 0 8px 16px 4px rgba(3, 17, 48, 0.2)', use: 'Ditunjuk: naik 2 px, bayang memanjang. Juga notifikasi yang melayang.' },
    '4-tekan': { css: '0 0 0 4px var(--kapur), 0 1px 2px 4px rgba(3, 17, 48, 0.12)', use: 'Ditekan: turun 1 px dan bayang hampir hilang, seperti stiker ditempel (80 ms).' },
    '4-mati': { css: '0 0 0 4px var(--kapur)', use: 'Nonaktif: bidang Benang, teks Asap, tepi tanpa bayang.' },
    3: { css: '0 0 0 3px var(--kapur), 0 2px 4px 3px rgba(3, 17, 48, 0.18)', use: 'Tepi 3 untuk kontrol 28 sampai 36: chip terpilih, lencana, tombol ikon kecil 32.' },
    '3-tepi': { css: '0 0 0 3px var(--kapur)', use: 'Keterangan: tepi box-shadow, bayangnya drop-shadow (stiker-jatuh) supaya ekornya ikut bertepi dan berbayang.' },
    2: { css: '0 0 0 2px var(--kapur), 0 1px 3px 2px rgba(3, 17, 48, 0.18)', use: 'Tepi 2 untuk tanda 24: kotak pilihan terpilih dan tanda isian.' },
    pulau: { css: '0 4px 12px rgba(3, 17, 48, 0.18)', use: 'Pulau bilah atas: Kapur di atas halaman Kapur, jadi bayang saja tanpa tepi.' },
    jatuh: { css: 'drop-shadow(0 3px 4px rgba(3, 17, 48, 0.2))', use: 'Bayang keterangan (filter), jatuh ke badan dan ekor sekaligus.' },
  },
  gerak: { tunjuk: 2, tekan: 1, tekanMs: 80, tempel: { skala: 1.06, naik: 6 }, use: 'Ditunjuk naik 2, ditekan turun 1 dalam 80 ms; chip yang dipilih menempel dari skala 1,06 dan naik 6 (sedang, lentur). Gerak dikurangi: tanpa naik, turun, dan tempel; perubahan terlihat lewat warna.' },
  bilah: { tinggi: 64, ambang: 24, merek: [64, 32], tombolMenu: 40, glifMenu: 20,
    pulau: { jarak: 12, tinggi: 56, kiri: 16, kanan: 8 },
    desktop: { tinggi: 72, tepi: 48, pulau: { atas: 16, sisi: 24, tinggi: 64, kiri: 24, kanan: 12 } },
    menu: { tautan: 32, baris: 56, atas: 88, sisi: 16 },
    use: 'Di atas langit: bilah Garis 64 tanpa wadah, logo Kapur, tombol Menu bergaris 1,5. Digulir lebih dari 24 px: pulau Kapur 56 yang melayang 12 dari tepi, radius 24, bayang pulau; logo Tinta, tombol Menu stiker Tinta radius 16 (24 - 8). Menu: layar Tinta, tautan Anybody 32 di baris 56, halaman aktif ditandai Pita Kunyit, tombol utama stiker Kunyit. Desktop: bilah 72 dengan tepi 48, pulau 64 melayang 16 dari atas dan 24 dari sisi.' },
  kaki: { pita: 24, padHp: [40, 16, 24], padDesktop: [64, 48, 32], merekHp: 48, merekDesktop: 64, garisTunjuk: 6,
    use: 'Kapur dengan Pita tiga lapis di tepi atas (Telang, Kunyit, Secang), logo Tinta, satu kalimat penutup 19/28, tautan dua kolom di HP dan empat di desktop, garis 1 Benang di atas baris hukum 13/16. Tautan ditunjuk: garis bawah Kunyit 6 seperti tautan stiker.' },
  ikon: { set: 'A Padat', sisi: 14, ubin: 48, jarak: 20, glif: { ubin: 28, tombol: 24, kecil: 20, tanda: 16 },
    use: 'Satu set 16 ikon (12 ikon tugas + Menu, Close, Info, Done), siluet penuh dengan detail dilubangi seperti stiker potong; lubangnya mask, jadi tembus ke warna di bawahnya. Lembar dari generator gambar, di-vector Quiver Arrow 2, dipecah per sel dengan kode (kit/ikon-gaya.mjs).' },
};

// Gelombang Warna final (DEC-49: Pita + Pasang). Oke Panji 31 Okt 2026 (DEC-50).
// Mesin situs/gelombang/gelombang.mjs membaca angka ini; DESIGN.md ditulis dari sini juga.
export const gelombang = {
  prinsip: 'Pasang untuk kerja, Pita untuk orang.',
  uji: 'Apakah ini menunjukkan seberapa jauh? Pasang. Siapa atau ke mana? Pita. Bukan keduanya? Tanpa gelombang.',
  bentuk: {
    pasang: { tanya: 'Seberapa jauh?', use: 'Kerja dan waktu. Lapisan tumbuh dari tepi bidang: progres, memuat, tombol kirim, sisa waktu notifikasi, hero dan peralihan seksi halaman program, kaki halaman program, poster, gambar tautan, dan slide program.' },
    pita: { tanya: 'Siapa, dan ke mana?', use: 'Orang dan arah. Pita melayang dengan ujung bulat berundak: beranda dan komunitas, tab dan navigasi, kartu peserta dengan urutan pribadi, lanyard, tas, stiker, latar laptop, story ajakan, email angkatan.' },
  },
  tebal: { komponen: 8, pemisah: 16, hp: 16, desktop: 24, poster: 48 },
  amp: { komponen: 4, pemisah: 12, hp: 12, desktop: 20 },
  lam: { bagi: 1.5, min: 240, maks: 960 },
  undak: [0, 2, 1, 3, 1.5],
  gerak: { masuk: 720, jeda: 80, beres: 760, kembali: 560, alun: 14 },
  ambang: 2,
};

// Langit Gumpal (dikunci Panji 31 Okt 2026): warna latar hero per waktu, dan awan gumpal yang isinya diambil dari langit.
// pita = urutan Pita atas ke bawah, agen = warna agen; keduanya dipilih supaya tidak ada yang sewarna langitnya.
export const langit = {
  waktu: {
    pagi: { langit: 'telang', judul: 'kapur', lencana: 'kunyit', pita: ['kunyit', 'secang', 'pandan'], agen: 'kunyit' },
    siang: { langit: 'kunyit', judul: 'tinta', lencana: 'kapur', pita: ['telang', 'secang', 'pandan'], agen: 'telang' },
    sore: { langit: 'secang', judul: 'tinta', lencana: 'kunyit', pita: ['kunyit', 'telang', 'pandan'], agen: 'kunyit' },
  },
  // Isi awan: sisi teduh = langit dicampur putih 70 persen, dasar awan 56 persen (alfa 0,8). Satu-satunya gradasi di sistem.
  awan: { teduh: 0.7, dasar: 0.56, dasarAlfa: 0.8, maks: 8 },
  lapis: {
    jauh: { alfa: 0.66, lunak: 2.5, paralaks: 8, ayun: 4, use: 'kecil dan tembus, tepi kabur karena jarak; di belakang Pita' },
    tengah: { alfa: 0.94, lunak: 1, paralaks: 18, ayun: 7, use: 'pengisi dan satu awan utama; di belakang Pita' },
    dekat: { alfa: 1, lunak: 0, paralaks: 34, ayun: 10, use: 'besar dan padat, tepi tegas; di depan Pita, menutup pangkal dan ujungnya' },
  },
  tirai: { ms: 720, ease: 'kupas' },
  // Komponen Awan: A Kapas, dipilih Panji 31 Okt 2026 (DEC-54), final Oke Panji 31 Okt 2026 (DEC-55). Peran = variasi bentuk per tempat.
  peran: {
    utama: 'satu per layar, paling tinggi: tiga sampai empat mahkota dan ubun-ubun',
    tepian: 'lebar dan rendah, menutup pangkal dan ujung Pita di tepi layar',
    sedang: 'pengisi, bentuk kumulus bawaan',
    serpih: 'kecil di lapis jauh: empat sampai lima gumpal alas, satu atau dua mahkota',
  },
  // Gerak awan. f = frekuensi pegas (Hz), z = rasio redam. Gepeng dan regang dalam bagian ukuran awan.
  gerak: {
    napas: 0.01, angkat: 0.03,
    masuk: { ms: 640, jeda: 70, lewat: 0.05 },
    tekan: { maks: 0.15, tahan: 0.5, f: 3.2, z: 0.26, dorong: 2.4, lebar: 0.6 },
    lekuk: { dalam: 0.07, sigma: 0.2, f: 7, z: 0.55 },
    goyang: { f: 4.6, z: 0.2, ikut: 0.9 },
    regang: 0.12,
    pulang: { k: 7, redam: 3.6 },
    lempar: 1600,
  },
};

// Section templates (B Below the Clouds + Promise solid yellow, dipilih Panji 1 Nov 2026, DEC-56): satu kolom halaman,
// background tiap section, dan divider dari section di atasnya. Header dan footer dari Kit final (DEC-62).
export const seksi = {
  kolom: { px: 1072, use: 'Lebar isi paling besar. Hero, section, header, dan footer berbagi satu tepi kiri.' },
  tepi: { hp: 24, desktop: 64, use: 'Tepi kolom: 24 di HP (j6), 64 di desktop (j16, sama dengan hero). Di layar lebar kolom ke tengah: tepi = max(64, (lebar - 1072) / 2), jadi 184 di 1440.' },
  ritme: { hp: 48, desktop: 64, use: 'Padding atas dan bawah tiap section (j12 HP, j16 desktop); antar blok di dalam section j8.' },
  // latar: token warna; 'langit' = langit hero per waktu; 'lencana' = warna lencana hero per waktu.
  latar: {
    Hero: { latar: 'langit', use: 'Langit Gumpal per waktu (dikunci 31 Okt 2026).' },
    Promise: { latar: 'lencana', use: 'Solid yellow (Kunyit). Siang kapur, karena langit siang sudah Kunyit dan Promise kuning akan menyatu dengan hero; aturannya sama dengan warna lencana hero per waktu.' },
    Steps: { latar: 'kapur', use: 'Isi panjang di putih; kartu Awan.' },
    'Card grid': { latar: 'awan', use: 'Rak kartu di light gray; kartu Kapur.' },
    FAQ: { latar: 'kapur', use: 'Daftar tanya jawab di putih, garis 1 Benang.' },
    CTA: { latar: 'langit', use: 'Langit per waktu lagi, dengan perut awan, Pita, dan agen; kartu Kapur.' },
    Footer: { latar: 'kapur', use: 'Kit final: putih dengan Pita penutup di tepi atas.' },
  },
  // divider = cara section ini menyambung dari section di atasnya.
  divider: {
    Promise: { jenis: 'cloud-edge', use: 'Cloud edge: alas rata awan hero duduk di batas.' },
    Steps: { jenis: 'straight', use: 'Straight: garis lurus, tanpa hiasan.' },
    'Card grid': { jenis: 'straight', use: 'Straight.' },
    FAQ: { jenis: 'straight', use: 'Straight.' },
    CTA: { jenis: 'cloud-belly', use: 'Cloud belly: perut awan menggantung dari batas atas, puncaknya terpotong; halaman keluar dari bawah awan.' },
    Footer: { jenis: 'ribbon', use: 'Ribbon: Pita penutup footer tiga lapis 6. Warnanya Pita CTA di waktu itu (lapis atas tidak pernah sewarna langit, lapis bawah Pandan kontras 2,49 di Kapur); celah di atas lapis pertama diisi warna section di atasnya.' },
  },
  pitaKeKaki: { px: 64, use: 'Jarak paling dekat Pita CTA ke Pita penutup footer, supaya dua Pita tidak terbaca dobel. HP: ruang bawah CTA 240.' },
};
