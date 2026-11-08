// Peta 10x Everchill: daftar sasaran assessment versi 5 menit (konsep narasi, 8 Nov 2026).
// Satu sumber untuk halaman chat (progres, kartu, ringkasan, email) dan agent di /api/sml-assessment (prompt).
// Tiap sasaran = satu informasi yang harus didapat. `konteks` ditulis tetap oleh Panji dan ditampilkan halaman
// di atas pertanyaan; agent tidak mengarangnya. `opsi` = pilihan cepat, bukan satu-satunya jawaban sah.
// Placeholder di konteks: {r} = lead untuk 1 deal, {target} = target deal per bulan (dari angka yang dikonfirmasi).

export const VERSI = 2;
export const ANGKA_AWAL = { d: 1, k: 10, p: 6, v: 300, r: 7 };

// Lima bab. `no` dipakai sebagai indeks; tampil sebagai "Bab no+1 dari 5".
export const BAGIAN = [
  { no: 0, judul: "Yang kami dengar", label: "Didengar", proposal: "Konfirmasi meeting 4 November" },
  { no: 1, judul: "Seperti apa menang", label: "Menang", proposal: "Target, definisi deal, dan KPI" },
  { no: 2, judul: "Siapa yang harus yakin", label: "Klien", proposal: "Segmen prioritas dan campaign messaging" },
  { no: 3, judul: "Mesin hari ini", label: "Mesin", proposal: "Baseline pipeline dan jarak ke target" },
  { no: 4, judul: "Cara kita bekerja", label: "Kerja sama", proposal: "Lingkup kerja, model kerja sama, anggaran, dan janji 30 hari pertama" }
];

export const GRUP_FAKTA = ["Arah", "Mesin hari ini", "Akar"];

// Area kerja di kartu izin: dicentang = boleh langsung dikerjakan, tidak dicentang = Panji usulkan dulu.
export const IZIN_BARIS = [
  { id: "sosmed", area: "Social media", ket: "LinkedIn, Instagram, dan TikTok Everchill" },
  { id: "gads", area: "Google Ads", ket: "Campaign yang sekarang dikelola pihak lain" },
  { id: "paid", area: "Paid ads baru", ket: "LinkedIn Ads, Meta Ads, dan TikTok Ads" },
  { id: "wa", area: "Alur WhatsApp", ket: "Template balasan admin dan alur lead ke sales" },
  { id: "mat", area: "Sales material", ket: "Brosur, deck, dan case study" },
  { id: "track", area: "Tracking", ket: "Asal setiap lead tercatat, dari iklan sampai deal" },
  { id: "web", area: "Website dan funnel", ket: "Copy website, landing page, dan form" }
];
export const IZIN_BOLEH = "Boleh langsung";
export const IZIN_USUL = "Usul dulu";

export const SASARAN = [
  // Bab 1: fakta meeting, satu kartu, Tepat semua atau koreksi.
  { id: "f1", bagian: 0, grup: "Arah", q: "Everchill ingin jadi pionir cooling as a service, brand pertama yang diingat saat industri butuh chiller.", tujuan: "Benar, atau koreksinya." },
  { id: "f2", bagian: 0, grup: "Arah", q: "Sekarang sekitar 1 deal per bulan. Targetnya 10x dalam 6 bulan, dengan nilai deal sekitar Rp300 juta per tahun.", tujuan: "Benar, atau angka yang benar. Angka yang dikoreksi juga diisi di n_d, n_k, n_p, n_v." },
  { id: "f3", bagian: 0, grup: "Arah", q: "Brand Everchill yang harus hidup. Mba tidak perlu tampil sebagai personal brand.", tujuan: "Benar, atau koreksinya." },
  { id: "f4", bagian: 0, grup: "Arah", q: "Mba ingin rencana 6 bulan ala account planning, plus implementasinya.", tujuan: "Benar, atau koreksinya." },
  { id: "f5", bagian: 0, grup: "Mesin hari ini", q: "Sekitar 7 lead jadi 1 deal. Lead terbanyak datang dari Google Ads yang dikelola pihak lain.", tujuan: "Benar, atau koreksinya. Rasio yang dikoreksi juga diisi di n_r." },
  { id: "f6", bagian: 0, grup: "Mesin hari ini", q: "Lead masuk lewat form dan WhatsApp yang dipegang admin, lalu Mba teruskan ke 4 sales, termasuk sales manager. Sales juga melakukan outreach.", tujuan: "Benar, atau koreksinya." },
  { id: "f7", bagian: 0, grup: "Mesin hari ini", q: "Belum ada tim marketing in-house dan belum ada event sendiri. Instagram berhenti bulan ini, LinkedIn baru mulai.", tujuan: "Benar, atau koreksinya." },
  { id: "f8", bagian: 0, grup: "Mesin hari ini", q: "Hampir 2 tahun bersama agency sebelumnya belum menghasilkan qualified lead.", tujuan: "Benar, atau koreksinya." },
  { id: "f9", bagian: 0, grup: "Akar", q: "Engineering company sejak 2006, dulu Prosis. Rebrand menjadi Everchill sekitar 2024 dan membuat unit sendiri.", tujuan: "Benar, atau koreksinya." },
  { id: "n_d", bagian: 0, angka: true, q: "Deal per bulan sekarang (angka saja).", tujuan: "Angka. Isi 1 kalau f2 dibenarkan." },
  { id: "n_k", bagian: 0, angka: true, q: "Target kelipatan (angka saja, tanpa x).", tujuan: "Angka. Isi 10 kalau f2 dibenarkan." },
  { id: "n_p", bagian: 0, angka: true, q: "Periode target dalam bulan (angka saja).", tujuan: "Angka. Isi 6 kalau f2 dibenarkan." },
  { id: "n_v", bagian: 0, angka: true, q: "Nilai deal per tahun dalam juta rupiah (angka saja).", tujuan: "Angka. Isi 300 kalau f2 dibenarkan." },
  { id: "n_r", bagian: 0, angka: true, q: "Jumlah lead untuk 1 deal (angka saja).", tujuan: "Angka. Isi 7 kalau f5 dibenarkan." },

  // Bab 2: seperti apa menang
  { id: "deal", bagian: 1, langkah: 2,
    konteks: "Di cooling as a service, satu deal bisa dihitung di tiga titik: quotation disetujui, PO keluar, atau kontrak ditandatangani. Target 10x perlu satu titik yang sama sejak awal, supaya angkanya tidak diperdebatkan di bulan ke-6.",
    q: "Titik mana yang Mba hitung sebagai satu deal?", tujuan: "Titik yang dihitung sebagai deal.", opsi: ["Kontrak ditandatangani", "PO keluar", "Quotation disetujui"] },
  { id: "kapasitas", bagian: 1, langkah: 3,
    konteks: "Setiap deal baru berarti unit, instalasi, dan tim yang menjaga SLA selama kontrak berjalan. Jadi pertumbuhan perlu mengikuti kapasitas tim engineering.",
    q: "Saat ini tim engineering sanggup menangani berapa proyek baru per bulan, tanpa mengganggu klien yang sudah ada?", tujuan: "Kapasitas proyek baru per bulan, perkiraan cukup.", opsi: ["Di bawah 5", "5 sampai 10", "Lebih dari 10"] },

  // Bab 3: siapa yang harus yakin
  { id: "segmen", bagian: 2, langkah: 4,
    konteks: "Setiap segmen punya kekhawatiran sendiri. Pabrik khawatir produksi berhenti, rumah sakit khawatir suhu ruang operasi, data center khawatir server mati. Karena itu pesannya disusun per segmen.",
    q: "Pilih sampai tiga segmen yang ingin Everchill menangkan lebih dulu.", tujuan: "Sampai tiga segmen prioritas.", opsi: ["Pabrik dan produksi", "Rumah sakit", "Data center", "Hotel dan gedung komersial", "Proyek konstruksi", "Kebutuhan sementara"], banyak: true },
  { id: "penentu", bagian: 2, langkah: 5,
    konteks: "Di industri ini, yang merasakan masalah sering bukan yang membuat keputusan akhir. Tim engineering merasakan masalahnya, sementara keputusan ada di level lain.",
    q: "Di klien Everchill, siapa yang biasanya memegang keputusan akhir?", tujuan: "Pemegang keputusan akhir di sisi klien.", opsi: ["Owner atau direksi", "Plant manager atau chief engineer", "Procurement", "Konsultan MEP", "Main contractor"] },
  { id: "alasan", bagian: 2, langkah: 6,
    konteks: "Yang dicari klien dari cooling as a service adalah kepastian pendinginan tetap jalan. Alasan klien memilih Everchill akan menjadi pesan utama di semua materi.",
    q: "Menurut Mba, apa alasan utama klien memilih Everchill? Boleh pilih dua.", tujuan: "Satu atau dua alasan klien memilih Everchill.", opsi: ["Tidak perlu modal beli unit", "Unit buatan sendiri", "Teknisi cepat datang", "Kontrak fleksibel", "Pengalaman sejak 2006"], banyak: true },

  // Bab 4: mesin hari ini
  { id: "lead", bagian: 3, langkah: 7,
    konteks: "Mba menyebut sekitar {r} lead jadi 1 deal. Dari jumlah lead sekarang, terlihat seberapa jauh jaraknya ke {target} deal per bulan.",
    q: "Rata-rata berapa lead yang masuk per bulan sekarang?", tujuan: "Volume lead per bulan.", opsi: ["Kurang dari 10", "10 sampai 30", "30 sampai 60", "Lebih dari 60"] },
  { id: "sumber", bagian: 3, langkah: 8,
    konteks: "Saat ini Google Ads yang paling besar. Panji juga ingin melihat sumber lain yang sudah berjalan, sekecil apa pun.",
    q: "Lead datang dari mana saja? Boleh pilih lebih dari satu.", tujuan: "Sumber lead, tanpa persen.", opsi: ["Google Ads", "Referral", "Klien lama", "Outreach sales", "Pameran"], banyak: true },

  // Bab 5: cara kita bekerja
  { id: "izin", bagian: 4, langkah: 9, kartu: "izin",
    konteks: "Mba ingin kompetitor tidak bisa menebak langkah Everchill berikutnya. Karena itu, Panji tidak menyentuh apa pun tanpa izin Mba.",
    q: "Centang yang boleh langsung Panji kerjakan. Yang tidak dicentang akan Panji usulkan dulu ke Mba.", tujuan: "Diisi lewat kartu izin. Jangan ditanyakan satu per satu." },
  { id: "lingkup", bagian: 4, langkah: 10,
    konteks: "Di pertemuan, Mba menyebut ingin rencana 6 bulan ala account planning, plus implementasinya.",
    q: "Apakah masih sama?", tujuan: "Lingkup kerja.", opsi: ["Masih sama, rencana plus implementasi", "Rencana 6 bulan saja", "Rencana dulu, implementasi diputuskan nanti"] },
  { id: "model", bagian: 4, langkah: 11,
    konteks: "Ada tiga cara membagi risiko. Retainer: biaya bulanan tetap. Hybrid: retainer lebih kecil, plus bonus saat target tercapai. Performance-based: sebagian besar dibayar per hasil. Angkanya ada di proposal.",
    q: "Mana yang paling terasa adil untuk Mba?", tujuan: "Satu model, atau ingin melihat ketiganya. Tanpa angka harga.", opsi: ["Retainer", "Hybrid", "Performance-based", "Lihat ketiganya di proposal"] },
  { id: "anggaran", bagian: 4, langkah: 12,
    konteks: "Biaya kerja sama dengan Panji dihitung terpisah. Yang ditanyakan di sini adalah marketing budget yang Everchill siapkan untuk menjalankan inisiatif dan campaign: iklan, produksi konten, dan event. Besarnya menentukan channel mana yang masuk akal dikejar.",
    q: "Kira-kira berapa marketing budget per bulan, di luar biaya kerja sama itu? Kisaran saja cukup.", tujuan: "Kisaran marketing budget per bulan di luar biaya kerja sama dengan Panji. Boleh juga dibahas langsung.", opsi: ["Di bawah Rp50 juta", "Rp50 sampai 100 juta", "Rp100 sampai 250 juta", "Di atas Rp250 juta", "Lebih enak dibahas langsung"] },
  { id: "tanda30", bagian: 4, langkah: 13,
    konteks: "Hampir dua tahun tanpa qualified lead itu waktu yang panjang. Di bulan pertama, harus ada tanda yang bisa Mba lihat sendiri.",
    q: "Tanda apa yang paling ingin Mba lihat dalam 30 hari pertama?", tujuan: "Tanda keberhasilan 30 hari pertama.", opsi: ["Lead dari channel baru mulai masuk", "Tracking rapi, asal tiap lead jelas", "Meeting dengan target account", "Rencana 6 bulan sudah disetujui"] },
  { id: "kecewa", bagian: 4, langkah: 14, opsional: true,
    konteks: "Pertanyaan terakhir, dan boleh dilewati.",
    q: "Dari kerja sama marketing sebelumnya, apa yang paling tidak ingin terulang?", tujuan: "Kekecewaan dari kerja sama sebelumnya, dengan kata-kata Mba kalau ia mengetik sendiri. Opsional.", opsi: ["Lead tidak berkualitas", "Kurang paham bisnis B2B", "Laporan tidak jelas", "Lewati"] }
];
