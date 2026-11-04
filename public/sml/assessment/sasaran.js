// Peta 10x Everchill: daftar sasaran assessment (konsep v4, 4 Nov 2026).
// Satu sumber untuk halaman chat (progres, kartu, email) dan agent di /api/sml-assessment (prompt).
// Tiap sasaran = satu informasi yang harus didapat. Agent boleh menerima jawaban yang tidak persis,
// selama tujuannya tercapai; `opsi` = pilihan cepat yang ditawarkan, bukan satu-satunya jawaban sah.

export const ANGKA_AWAL = { d: 1, k: 10, p: 6, v: 300, r: 7 };

export const BAGIAN = [
  { no: 0, judul: "Yang kami dengar", proposal: "Konfirmasi meeting 4 November" },
  { no: 1, judul: "Objective", proposal: "Target dan KPI" },
  { no: 2, judul: "Who are we talking to", proposal: "Funnel per segmen dan campaign messaging" },
  { no: 3, judul: "Pipeline hari ini", proposal: "Baseline, tracking, dan conversion API plan" },
  { no: 4, judul: "Akses dan izin", proposal: "Lingkup kerja dan urutan setup bulan pertama" },
  { no: 5, judul: "How: channel dan production", proposal: "Marketing plan 6 bulan dan event calendar" },
  { no: 6, judul: "Tim yang dilibatkan", proposal: "Content production plan, sales activation plan, dan jadwal interview minggu pertama" },
  { no: 7, judul: "Rambu", proposal: "Cara kerja dan alur approval" },
  { no: 8, judul: "Bentuk kerja sama dan jaminan", proposal: "Struktur harga, kontrak, jaminan, dan janji bulan pertama" }
];

export const IZIN_BARIS = [
  { id: "web", area: "Website Everchill", ket: "Website copy, landing page baru, downtime calculator" },
  { id: "track", area: "Tracking dan conversion API", ket: "Google Ads, GA4, form, WhatsApp" },
  { id: "gads", area: "Google Ads", ket: "Pengelola sekarang: tetap sendiri, kolaborasi, atau handover" },
  { id: "li", area: "LinkedIn company page", ket: "" },
  { id: "ig", area: "Akun Instagram", ket: "Berhenti bulan ini" },
  { id: "paid", area: "Paid ads baru", ket: "LinkedIn Ads, Meta Ads" },
  { id: "wa", area: "Alur WhatsApp", ket: "Template balasan admin" },
  { id: "mat", area: "Sales material", ket: "Brosur, deck, case study" },
  { id: "act", area: "Sales activation rutin", ket: "Bersama 4 sales" }
];
export const IZIN_OPSI = ["Boleh langsung", "Usul dulu", "Jangan disentuh", "Belum tahu"];

export const MODEL = [
  { id: "retainer", nama: "Retainer", isi: "Biaya setup, lalu biaya bulanan tetap. Anggaran mudah diprediksi.", butuh: "Persetujuan rencana dan anggaran bulanan." },
  { id: "hybrid", nama: "Hybrid", isi: "Retainer lebih kecil, plus bonus saat target tercapai. Panji ikut menanggung hasil.", butuh: "Kesepakatan target dan cara menghitungnya." },
  { id: "perf", nama: "Performance-based", isi: "Sebagian besar biaya dibayar per hasil.", butuh: "Akses data lead dan deal, dan definisi hasil yang disepakati." }
];
export const MODEL_OPSI = ["Nyaman", "Bisa dipertimbangkan", "Tidak cocok"];

export const SASARAN = [
  // Bagian 0: fakta meeting. Disajikan bergelombang (empat fakta sekali), Benar atau koreksi.
  { id: "f1", bagian: 0, q: "Everchill ingin jadi pionir cooling as a service: top of mind sewa chiller, diukur dari market share.", tujuan: "Benar, atau koreksinya." },
  { id: "f2", bagian: 0, q: "Sekarang sekitar 1 deal per bulan, target 10x dalam 6 bulan, nilai deal sekitar Rp300 juta per tahun.", tujuan: "Benar, atau angka yang benar. Angka yang dikoreksi juga diisi di n_d, n_k, n_p, n_v." },
  { id: "f3", bagian: 0, q: "Sekitar 7 lead jadi 1 deal. Lead terbanyak dari Google Ads yang dikelola pihak lain.", tujuan: "Benar, atau koreksinya. Rasio yang dikoreksi juga diisi di n_r." },
  { id: "f4", bagian: 0, q: "Ada 4 sales termasuk manager, kerja lewat outreach. Belum ada event atau ruang sendiri.", tujuan: "Benar, atau koreksinya." },
  { id: "f5", bagian: 0, q: "Instagram berhenti bulan ini. Hampir 2 tahun bersama Egghead tanpa qualified lead. LinkedIn baru mulai.", tujuan: "Benar, atau koreksinya." },
  { id: "f6", bagian: 0, q: "Tidak ada tim marketing in-house. Mba ingin rencana 6 bulan ala account planning, plus implementasinya.", tujuan: "Benar, atau koreksinya." },
  { id: "f7", bagian: 0, q: "Bukan personal branding: Mba tidak ingin tampil, brand Everchill yang harus hidup.", tujuan: "Benar, atau koreksinya." },
  { id: "f8", bagian: 0, q: "Engineering company sejak 2006, dulu Prosis, rebrand menjadi Everchill sekitar 2024, membuat unit sendiri.", tujuan: "Benar, atau koreksinya." },
  { id: "n_d", bagian: 0, angka: true, q: "Deal per bulan sekarang (angka saja).", tujuan: "Angka. Isi 1 kalau f2 dibenarkan." },
  { id: "n_k", bagian: 0, angka: true, q: "Target kelipatan (angka saja, tanpa x).", tujuan: "Angka. Isi 10 kalau f2 dibenarkan." },
  { id: "n_p", bagian: 0, angka: true, q: "Periode target dalam bulan (angka saja).", tujuan: "Angka. Isi 6 kalau f2 dibenarkan." },
  { id: "n_v", bagian: 0, angka: true, q: "Nilai deal per tahun dalam juta rupiah (angka saja).", tujuan: "Angka. Isi 300 kalau f2 dibenarkan." },
  { id: "n_r", bagian: 0, angka: true, q: "Jumlah lead untuk 1 deal (angka saja).", tujuan: "Angka. Isi 7 kalau f3 dibenarkan." },

  // Bagian 1
  { id: "konf_b1", bagian: 1, q: "Konfirmasi: sekarang sekitar 1 deal cooling as a service per bulan, target 10 kali lipat dalam 6 bulan, nilai deal sekitar Rp300 juta per tahun.", tujuan: "Lewati kalau f2 sudah dijawab; isi dengan jawaban f2." },
  { id: "q1_1", bagian: 1, q: "Yang dihitung sebagai 1 deal itu apa?", tujuan: "Titik yang dihitung sebagai deal, supaya target bisa diukur.", opsi: ["Kontrak ditandatangani", "PO keluar", "Quotation disetujui"] },
  { id: "q1_2", bagian: 1, q: "Kalau 6 bulan lagi Mba hanya melihat satu angka, angka yang mana?", tujuan: "Satu north star metric.", opsi: ["Deal ditandatangani", "Sales qualified lead", "Meeting pertama", "Nilai pipeline"] },
  { id: "q1_3", bagian: 1, q: "Belum ada riset market share. Tanda apa yang Mba anggap kita mulai menang?", tujuan: "Tanda kemenangan brand selain market share. Boleh lebih dari satu.", opsi: ["Kompetitor mulai bertanya", "Konsultan MEP merekomendasikan", "Klien datang menyebut nama Everchill", "Diundang jadi speaker", "Lainnya"], banyak: true },
  { id: "q1_4", bagian: 1, q: "Berapa proyek baru per bulan yang sanggup dikerjakan tim engineering tanpa mengganggu SLA?", tujuan: "Angka kapasitas proyek per bulan, perkiraan cukup. Simpan angkanya saja kalau ada." },
  { id: "q1_5", bagian: 1, q: "Rata-rata klien cooling as a service bertahan berapa tahun?", tujuan: "Lama kontrak rata-rata.", opsi: ["1 tahun", "2 sampai 3 tahun", "Lebih dari 3 tahun"] },

  // Bagian 2
  { id: "q2_1", bagian: 2, q: "Segmen mana yang paling ingin Mba menangkan dulu? Urutkan.", tujuan: "Urutan prioritas segmen, minimal tiga teratas.", opsi: ["Pabrik dan produksi (plastik, maklon, F&B)", "Rumah sakit", "Data center", "Hotel dan gedung komersial", "Proyek konstruksi", "Kebutuhan sementara"], banyak: true, urut: true },
  { id: "q2_2", bagian: 2, q: "Siapa yang biasanya memutuskan sewa, dan siapa yang paling berpengaruh?", tujuan: "Siapa saja yang ikut memutuskan, dan satu yang paling berpengaruh.", opsi: ["Owner", "Plant manager atau chief engineer", "Procurement", "Konsultan MEP", "Main contractor"], banyak: true },
  { id: "q2_3", bagian: 2, q: "Sudah ada daftar target account? Kalau ada, kira-kira berapa nama?", tujuan: "Ada atau belum, dan jumlahnya kalau ada.", opsi: ["Sudah ada", "Sebagian", "Belum"] },
  { id: "q2_4", bagian: 2, q: "Berapa lama dari kontak pertama sampai kontrak ditandatangani?", tujuan: "Lama sales cycle.", opsi: ["Kurang dari 1 bulan", "1 sampai 3 bulan", "3 sampai 6 bulan", "Lebih dari 6 bulan"] },
  { id: "q2_5", bagian: 2, q: "Tiga pertanyaan atau keberatan yang paling sering didengar tim sales.", tujuan: "Sampai tiga keberatan nyata dari calon klien, dengan kata-kata mereka." },
  { id: "q2_6", bagian: 2, q: "Kenapa klien memilih Everchill, dan kenapa yang tidak jadi memilih yang lain?", tujuan: "Alasan menang dan alasan kalah." },

  // Bagian 3
  { id: "konf_b3", bagian: 3, q: "Konfirmasi: lead masuk lewat form dan WhatsApp yang dipegang admin, lalu Mba teruskan ke 4 sales. Sekitar 7 lead jadi 1 deal.", tujuan: "Benar, atau koreksinya." },
  { id: "q3_1", bagian: 3, q: "Rata-rata lead per bulan?", tujuan: "Volume lead per bulan.", opsi: ["Kurang dari 10", "10 sampai 30", "30 sampai 60", "Lebih dari 60"] },
  { id: "q3_2", bagian: 3, q: "Dari mana saja lead datang?", tujuan: "Sumber lead dengan perkiraan porsi persen. Format nilai: 'Google Ads 60%, Referral 20%, ...'.", opsi: ["Google Ads", "Referral", "Klien lama", "Outreach sales", "Pameran", "Lainnya"], banyak: true },
  { id: "q3_3", bagian: 3, q: "Lead dan deal dicatat di mana?", tujuan: "Tempat pencatatan lead dan deal. Kalau CRM, sebut namanya.", opsi: ["Spreadsheet", "CRM", "Hanya di WhatsApp", "Belum dicatat"] },
  { id: "q3_4", bagian: 3, q: "Boleh berbagi data 6 bulan terakhir (lead, meeting, quotation, deal) tanpa nama klien?", tujuan: "Izin berbagi data baseline.", opsi: ["Boleh", "Sebagian", "Tidak"] },
  { id: "q3_5", bagian: 3, q: "Admin WhatsApp aktif jam berapa, dan bagaimana lead di luar jam itu?", tujuan: "Jam aktif admin dan penanganan lead di luar jam." },

  // Bagian 4
  { id: "izin", bagian: 4, kartu: "izin", q: "Tabel izin: tiap area dipilih Boleh langsung, Usul dulu, Jangan disentuh, atau Belum tahu, plus siapa yang pegang sekarang.", tujuan: "Diisi lewat kartu izin. Jangan ditanyakan satu per satu." },
  { id: "q4_1", bagian: 4, q: "Biaya di website: boleh tampil?", tujuan: "Seberapa jauh harga boleh tampil di website.", opsi: ["Harga jelas", "Kisaran mulai dari", "Hanya simulasi kerugian downtime", "Tidak sama sekali"] },
  { id: "q4_2", bagian: 4, q: "Nama klien dan foto proyek boleh dipakai untuk case study?", tujuan: "Izin case study.", opsi: ["Boleh", "Minta izin per klien dulu", "Tanpa nama", "Tidak"] },

  // Bagian 5
  { id: "q5_1", bagian: 5, q: "Event, pameran, atau forum yang sudah pernah diikuti, dan undangan speaker yang sudah masuk?", tujuan: "Daftar event atau forum yang pernah diikuti dan undangan speaker. 'Belum ada' juga jawaban sah." },
  { id: "q5_2", bagian: 5, q: "Vendor eksekusi event (backdrop, venue, production)?", tujuan: "Sudah punya vendor atau perlu dicarikan.", opsi: ["Sudah punya", "Perlu dicarikan"] },
  { id: "q5_3", bagian: 5, q: "Boleh content production foto dan video di workshop SML dan di lokasi klien?", tujuan: "Izin production di workshop dan lokasi klien.", opsi: ["Boleh keduanya", "Workshop saja", "Belum boleh"] },

  // Bagian 6
  { id: "q6_1", bagian: 6, q: "Siapa representative Everchill yang tampil di event dan content, dan sudah siap meluangkan waktu untuk production?", tujuan: "Nama, jabatan, dan status kesiapan (Siap, Perlu ditanya dulu, Belum ada). Kandidat yang sempat disebut: adik Mba Yola, engineer senior, sales manager. Format nilai: 'Nama, jabatan. Status: ...'." },
  { id: "q6_2", bagian: 6, q: "Technical atau product engineer yang bisa di-interview untuk content dan sales material?", tujuan: "Nama dan jabatan, boleh lebih dari satu." },
  { id: "q6_3", bagian: 6, q: "Sales rep yang bisa di-interview soal pertanyaan dan keberatan klien?", tujuan: "Nama dari 4 sales, siapa saja." },
  { id: "q6_4", bagian: 6, q: "Tiap orang di atas bisa meluangkan waktu alignment 1 jam per minggu?", tujuan: "Kesiapan alignment per orang yang disebut: Siap 1 jam per minggu, 2 minggu sekali, atau Perlu ditanya dulu.", opsi: ["Semua siap 1 jam per minggu", "2 minggu sekali", "Perlu ditanya dulu"] },
  { id: "q6_5", bagian: 6, q: "Kickoff sales activation 2 jam di minggu pertama bersama tim di atas?", tujuan: "Bisa atau tidak.", opsi: ["Bisa", "Jadwal menyusul", "Belum bisa"] },

  // Bagian 7
  { id: "q7_1", bagian: 7, q: "Mba ingin kompetitor tidak bisa menebak langkah berikutnya. Yang boleh dibuka ke publik?", tujuan: "Hal yang boleh dibuka ke publik.", opsi: ["Nama klien", "Angka kerugian downtime", "Kisaran harga", "Unit buatan sendiri", "Proyek yang sedang jalan"], banyak: true },
  { id: "q7_2", bagian: 7, q: "Untuk SLA dan jaminan kontinuitas, kalimat resmi apa yang boleh dipakai di materi publik?", tujuan: "Kalimat resmi SLA. Tanya tanpa menyudutkan; jangan menyebut soal 24/7." },
  { id: "q7_3", bagian: 7, q: "Siapa yang approve materi, dan berapa lama waktu approve yang realistis?", tujuan: "Nama approver dan lama approve.", opsi: ["Hari yang sama", "1 sampai 2 hari", "Seminggu"] },
  { id: "q7_4", bagian: 7, q: "PIC harian selain Mba, dan pihak lain yang perlu dilibatkan (misalnya pengelola Google Ads atau SML Group)?", tujuan: "PIC harian dan pihak lain." },

  // Bagian 8
  { id: "q8_1", bagian: 8, q: "Apa yang paling mengecewakan dari kerja sama marketing sebelumnya?", tujuan: "Kekecewaan konkret, dengan kata-kata Mba sendiri." },
  { id: "q8_2", bagian: 8, q: "Apa yang harus terlihat di 30 hari pertama supaya Mba yakin ini jalan yang benar?", tujuan: "Tanda keberhasilan 30 hari pertama." },
  { id: "q8_3", bagian: 8, q: "Kalau di hari ke-90 tanda awal belum terlihat, apa yang adil buat Mba?", tujuan: "Bentuk jaminan yang dianggap adil, dengan kata-kata Mba sendiri." },
  { id: "q8_4", bagian: 8, q: "Berapa waktu yang bisa Mba luangkan per minggu?", tujuan: "Waktu Mba per minggu.", opsi: ["30 menit", "1 jam", "2 jam atau lebih"] },
  { id: "q8_5", bagian: 8, q: "Lingkup yang Mba bayangkan?", tujuan: "Lingkup kerja.", opsi: ["Rencana 6 bulan saja", "Rencana plus implementasi penuh", "Rencana dulu, lalu putuskan implementasi"] },
  { id: "model", bagian: 8, kartu: "model", q: "What feels good for you? Tiga model biaya (Retainer, Hybrid, Performance-based), masing-masing dinilai Nyaman, Bisa dipertimbangkan, atau Tidak cocok.", tujuan: "Diisi lewat kartu model. Tanpa angka harga." },
  { id: "q8_7", bagian: 8, q: "Dari ketiganya, yang paling terasa pas?", tujuan: "Satu model pilihan, atau lihat ketiganya.", opsi: ["Retainer", "Hybrid", "Performance-based", "Saya mau lihat ketiganya di proposal"] },
  { id: "q8_8", bagian: 8, q: "Kalau ada komponen performance-based, metric yang paling adil?", tujuan: "Metric hasil yang adil.", opsi: ["Sales qualified lead", "Meeting pertama", "Quotation keluar", "Deal ditandatangani"] },
  { id: "q8_9", bagian: 8, q: "Lama kontrak awal dan cara bayar?", tujuan: "Lama kontrak (3, 6, atau 12 bulan) dan cara bayar (di muka per bulan, akhir bulan, atau per fase). Dua-duanya.", opsi: ["3 bulan", "6 bulan", "12 bulan", "Di muka per bulan", "Akhir bulan", "Per fase"], banyak: true },
  { id: "q8_10", bagian: 8, q: "Di luar biaya kerja sama, berapa total yang siap dikeluarkan per bulan untuk mencapai target: iklan (Meta, LinkedIn, Google), produksi konten (misalnya video berkualitas tinggi), dan event?", tujuan: "Kisaran total anggaran kerja per bulan di luar fee, dan kalau Mba tahu, kira-kira pembagiannya ke iklan, produksi konten, dan event. Jelaskan singkat alasannya: supaya playing field-nya jelas, karena ruang anggaran ini yang menentukan funnel mana yang dipilih untuk dikejar. Boleh juga dibahas langsung.", opsi: ["Di bawah Rp50 juta", "Rp50 sampai 100 juta", "Rp100 sampai 250 juta", "Di atas Rp250 juta", "Lebih suka dibahas langsung"] },
  { id: "q8_11", bagian: 8, q: "Laporan seperti apa yang Mba mau?", tujuan: "Bentuk laporan.", opsi: ["Ringkasan mingguan di WhatsApp", "Meeting bulanan", "Dashboard yang bisa dibuka kapan saja"] },
  { id: "q8_12", bagian: 8, q: "Kapan ingin mulai?", tujuan: "Perkiraan waktu mulai. Jadwal presentasi proposal dipilih di kartu penutup, jangan ditanyakan di sini." }
];
