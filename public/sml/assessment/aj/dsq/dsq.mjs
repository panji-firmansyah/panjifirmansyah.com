// Dynamic Square Agent: kotak Warna Asli yang hidup, dipakai sebagai elemen <dynamic-square>.
// Selalu persegi empat dengan sudut kontinu, tidak pernah pil atau lingkaran, dan sudutnya tidak pernah terlipat (tanpa kupas).
// Mode: wajah (kotak bermata), status (melebar memuat teks dan progres), kartu (memanjang memuat judul, isi, tombol).
// Satu jam animasi untuk semua agen; agen di luar layar dan tab tersembunyi tidak digambar ulang.
// Gerak dikurangi, juga atribut beku (redline, tangkapan layar): tanpa gerak diam-diam (kedip, lirik, napas), perubahan bentuk dan ekspresi seketika.
// Mata = tetes: satu kontur tertutup tanpa sudut tajam.
// Final 30 Okt 2026 (keputusan Panji): gerak Pegas, mata Tetes, watak Hidup, palet dari tokens (Warna Asli disetel).
// Alternatif yang tidak dipilih (gaya lipat dan jeli, mata embun dan cair, watak tenang dan main) tinggal hanya untuk arsip papan.
import { palette, neutral, kedalaman as KD } from '../tokens.mjs';

const NS = 'http://www.w3.org/2000/svg';
const HEX = Object.fromEntries([...Object.entries(palette), ...Object.entries(neutral)].map(([k, v]) => [k, v.hex]));
const PASANGAN = { pandan: 'tinta', telang: 'kapur', kunyit: 'tinta', secang: 'tinta', tinta: 'kapur', kapur: 'tinta', awan: 'tinta' };
// Palet: Warna Asli bawaan. Palet lain bisa didaftarkan untuk dijelajah, lalu dipakai lewat atribut palet.
const PALET = { asli: { hex: HEX, pasangan: PASANGAN } };
export function tambahPalet(nama, warna, pasangan = {}) { PALET[nama] = { hex: { ...HEX, ...warna }, pasangan: { ...PASANGAN, ...pasangan } }; }
const kurangi = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const acak = (a, b) => a + Math.random() * (b - a);
const jepit = (x, a, b) => Math.max(a, Math.min(b, x));
let nomor = 0;

function el(tag, at = {}, induk) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(at)) n.setAttribute(k, v);
  if (induk) induk.appendChild(n);
  return n;
}

// ---------- Warna: campur di OKLab supaya peralihan tidak keruh ----------
const keLinear = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const dariLinear = (c) => 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function keOklab(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => keLinear(parseInt(hex.slice(i, i + 2), 16)));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function keHex([L, A, B]) {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3, m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3, s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  return '#' + rgb.map((c) => Math.round(jepit(dariLinear(c), 0, 255)).toString(16).padStart(2, '0')).join('');
}
// Warna punggung panel gaya Lipat (arsip): warna badan dicampur kapur 45 persen.
const punggung = (hex) => keHex(keOklab(hex).map((v, i) => v + (keOklab('#FFFFFF')[i] - v) * 0.45));
const OK_TELANG = keOklab(HEX.telang);

// ---------- Kedalaman (putaran kedalaman 31 Okt 2026, arahan Panji: agen seperti stiker yang melayang) ----------
// Tanpa atribut kedalaman = agen datar final (DEC-48), tidak berubah. Dengan atribut: agen jadi stiker.
// Tepi potong kapur sepusat dengan badan: tebal = sisi pendek / 14 (paling tipis 2), radius tepi = radius badan + tebal,
// sudut kontinu yang sama. 24 jadi 2, 40 jadi 3, 56 jadi 4, 96 jadi 7, 200 jadi 14.
// tempel: bayang lembut token bayang-kupas, pipih saat ditekan, membesar saat diangkat.
// timbul: sisi tebal padat (warna latar digelapkan, tanpa blur), tombol fisik: ditekan masuk ke sisinya.
// melayang: mengambang di atas permukaan, bayang terpisah di alas, naik turun pelan, miring mengikuti penunjuk.
export const tepiStiker = (w, h) => Math.max(KD.tepi.min, Math.round(Math.min(w, h) / KD.tepi.bagi));
export const KEDALAMAN = ['tempel', 'timbul', 'melayang'];
export const gelapkan = (hex, dL = 0.12) => { const [L, A, B] = keOklab(hex); return keHex([Math.max(0, L - dL), A, B]); };

// ---------- Sudut kontinu (squircle), rumus corner smoothing ala Figma ----------
// Radius badan: sisi pendek x 0,28 dibulatkan ke px, maksimal 24 (token kartu). Smoothing 0,6. Contoh: 24 jadi 7, 40 jadi 11, 56 jadi 16.
export const radiusAgen = (w, h) => Math.min(24, Math.round(Math.min(w, h) * 0.28));
function sudut(r, s, anggaran) {
  if (r <= 0) return { r: 0, p: 0 };
  let p = (1 + s) * r;
  s = Math.min(s, Math.max(0, anggaran / r - 1));
  p = Math.min(p, anggaran);
  const busur = 90 * (1 - s);
  const panjangBusur = Math.sin((busur / 2) * Math.PI / 180) * r * Math.SQRT2;
  const alfa = (90 - busur) / 2;
  const p3p4 = r * Math.tan((alfa / 2) * Math.PI / 180);
  const beta = 45 * s;
  const c = p3p4 * Math.cos(beta * Math.PI / 180);
  const d = c * Math.tan(beta * Math.PI / 180);
  const b = (p - panjangBusur - c - d) / 3;
  return { r, p, a: 2 * b, b, c, d, L: panjangBusur };
}
const f = (n) => +n.toFixed(2);
/**
 * Jalur persegi empat bersudut kontinu. rs = [kiri-atas, kanan-atas, kanan-bawah, kiri-bawah].
 * gembung: [atas, kanan, bawah, kiri] px ke luar di tengah sisi (gaya Jeli, arsip).
 */
export function jalurKotak(w, h, rs, gembung = [0, 0, 0, 0]) {
  const ang = Math.min(w, h) / 2;
  const [tl, tr, br, bl] = rs.map((r) => sudut(Math.min(r, ang), 0.6, ang));
  const sisi = (x1, y1, x2, y2, g, nx, ny) => {
    const panjang = Math.hypot(x2 - x1, y2 - y1);
    const gg = jepit(g, -panjang * 0.12, panjang * 0.12);
    return Math.abs(gg) > 0.05 ? `Q${f((x1 + x2) / 2 + nx * gg * 2)} ${f((y1 + y2) / 2 + ny * gg * 2)} ${f(x2)} ${f(y2)}` : `L${f(x2)} ${f(y2)}`;
  };
  let d = `M${f(tl.p)} 0`;
  d += sisi(tl.p, 0, w - tr.p, 0, gembung[0], 0, -1);
  if (tr.r) d += `c${f(tr.a)} 0 ${f(tr.a + tr.b)} 0 ${f(tr.a + tr.b + tr.c)} ${f(tr.d)}a${f(tr.r)} ${f(tr.r)} 0 0 1 ${f(tr.L)} ${f(tr.L)}c${f(tr.d)} ${f(tr.c)} ${f(tr.d)} ${f(tr.b + tr.c)} ${f(tr.d)} ${f(tr.a + tr.b + tr.c)}`;
  d += sisi(w, tr.p, w, h - br.p, gembung[1], 1, 0);
  if (br.r) d += `c0 ${f(br.a)} 0 ${f(br.a + br.b)} ${f(-br.d)} ${f(br.a + br.b + br.c)}a${f(br.r)} ${f(br.r)} 0 0 1 ${f(-br.L)} ${f(br.L)}c${f(-br.c)} ${f(br.d)} ${f(-(br.b + br.c))} ${f(br.d)} ${f(-(br.a + br.b + br.c))} ${f(br.d)}`;
  d += sisi(w - br.p, h, bl.p, h, gembung[2], 0, 1);
  if (bl.r) d += `c${f(-bl.a)} 0 ${f(-(bl.a + bl.b))} 0 ${f(-(bl.a + bl.b + bl.c))} ${f(-bl.d)}a${f(bl.r)} ${f(bl.r)} 0 0 1 ${f(-bl.L)} ${f(-bl.L)}c${f(-bl.d)} ${f(-bl.c)} ${f(-bl.d)} ${f(-(bl.b + bl.c))} ${f(-bl.d)} ${f(-(bl.a + bl.b + bl.c))}`;
  d += sisi(0, h - bl.p, 0, tl.p, gembung[3], -1, 0);
  if (tl.r) d += `c0 ${f(-tl.a)} 0 ${f(-(tl.a + tl.b))} ${f(tl.d)} ${f(-(tl.a + tl.b + tl.c))}a${f(tl.r)} ${f(tl.r)} 0 0 1 ${f(tl.L)} ${f(-tl.L)}c${f(tl.c)} ${f(-tl.d)} ${f(tl.b + tl.c)} ${f(-tl.d)} ${f(tl.a + tl.b + tl.c)} ${f(-tl.d)}`;
  return d + 'Z';
}

/**
 * Poligon siku (semua belokan 90 derajat) dengan sudut kontinu yang sama dengan jalurKotak, untuk sudut cembung dan cekung.
 * titik searah jarum jam; rs = radius tiap titik. Anggaran tiap sudut = setengah sisi terpendek di sebelahnya.
 */
export function jalurSiku(titik, rs, smoothing = 0.6) {
  const n = titik.length;
  let d = '';
  for (let i = 0; i < n; i++) {
    const P = titik[(i - 1 + n) % n], V = titik[i], N = titik[(i + 1) % n];
    const lu = Math.hypot(V[0] - P[0], V[1] - P[1]), lv = Math.hypot(N[0] - V[0], N[1] - V[1]);
    const u = [(V[0] - P[0]) / lu, (V[1] - P[1]) / lu], v = [(N[0] - V[0]) / lv, (N[1] - V[1]) / lv];
    const cembung = u[0] * v[1] - u[1] * v[0] > 0, anggaran = Math.min(lu, lv) / 2;
    const k = sudut(Math.min(rs[i], anggaran), smoothing, anggaran);
    // Koordinat lokal: a sepanjang sisi masuk, b sepanjang sisi keluar.
    const g = (a, b) => `${f(a * u[0] + b * v[0])} ${f(a * u[1] + b * v[1])}`;
    d += `${i ? 'L' : 'M'}${f(V[0] - k.p * u[0])} ${f(V[1] - k.p * u[1])}`;
    if (k.r) d += `c${g(k.a, 0)} ${g(k.a + k.b, 0)} ${g(k.a + k.b + k.c, k.d)}a${f(k.r)} ${f(k.r)} 0 0 ${cembung ? 1 : 0} ${g(k.L, k.L)}c${g(k.d, k.c)} ${g(k.d, k.b + k.c)} ${g(k.d, k.a + k.b + k.c)}`;
  }
  return d + 'Z';
}
// Kartu stiker bertakik (masukan Panji 31 Okt 2026): kepala agen tetap persegi di kiri atas dengan ruangnya sendiri.
// Takik = kepala + tepi (C = sisi kepala + tebal tepi), jadi celah putih di antara kepala dan kartu sama dengan tepi luar.
// Sudut cekung sepusat dengan kepala (radius kepala + tepi); sudut cembung takik = radius kepala; sudut luar kartu = radius kartu.
// k = 0..1: takik membuka. k 0 = persis kotak kartu utuh (kepala menutup takik), jadi morph dari wajah tanpa loncatan.
export function jalurKartuTakik(w, h, kepala, tepi, k = 1) {
  const rA = radiusAgen(kepala, kepala), R = radiusAgen(w, h), C = kepala + tepi * k;
  return jalurSiku([[C, 0], [w, 0], [w, h], [0, h], [0, C], [C, C]], [rA * k, R, R, R, rA * k, rA + tepi * k]);
}
// Kepala di takik: sudut kiri atas dari radius kartu (R) ke radius agen; dua sudut yang menghadap kartu membulat bersama takik.
export const sudutKepala = (kepala, R, k) => R + (radiusAgen(kepala, kepala) - R) * k;
export function jalurKepala(kepala, R, k = 1) {
  const rA = radiusAgen(kepala, kepala);
  return jalurKotak(kepala, kepala, [sudutKepala(kepala, R, k), rA * k, rA, rA * k]);
}

// ---------- Mata: satu kontur, empat sisi busur, empat sudut bulat ----------
// Aturan tetes: tiap sudut dibulatkan busur lingkaran yang menyinggung kedua sisinya, radius minimal 0,18 x lebar mata.
// Bagian yang lebih tipis dari dua kali radius itu berujung setengah lingkaran penuh. Tidak ada mask, tidak ada potongan.
const V = (x, y) => ({ x, y });
const tambah = (a, b) => V(a.x + b.x, a.y + b.y);
const kurang = (a, b) => V(a.x - b.x, a.y - b.y);
const kali = (a, k) => V(a.x * k, a.y * k);
const titik = (a, b) => a.x * b.x + a.y * b.y;
const silang = (a, b) => a.x * b.y - a.y * b.x;
const satuan = (a) => { const l = Math.hypot(a.x, a.y) || 1; return V(a.x / l, a.y / l); };

// Sisi dari P ke Q, melengkung keluar sejauh s (negatif = ke dalam), paling jauh 0,46 x panjangnya (busur kurang dari setengah lingkaran).
// Kontur ditelusuri searah jarum jam di layar, jadi n menunjuk ke dalam bentuk.
function sisiMata(P, Q, s) {
  const c = Math.hypot(Q.x - P.x, Q.y - P.y) || 1e-6, u = satuan(kurang(Q, P)), n = V(-u.y, u.x);
  s = jepit(s, -0.46 * c, 0.46 * c);
  const e = { P, Q, c, u, n, s, garis: Math.abs(s) < c * 0.004 };
  const a = e.garis ? 0 : 2 * Math.atan(2 * s / c);
  e.tP = tambah(kali(u, Math.cos(a)), kali(n, -Math.sin(a)));
  e.tQ = tambah(kali(u, Math.cos(a)), kali(n, Math.sin(a)));
  if (e.garis) e.L = c;
  else {
    e.R = (c * c / 4 + s * s) / (2 * Math.abs(s));
    e.O = tambah(kali(tambah(P, Q), 0.5), kali(n, s > 0 ? e.R - s : -(e.R + s)));
    e.L = e.R * 2 * Math.asin(Math.min(1, c / (2 * e.R)));
  }
  return e;
}
// Sisi digeser ke dalam sejauh r: garis sejajar, atau lingkaran sepusat.
const geser = (e, r) => e.garis ? { garis: true, P: tambah(e.P, kali(e.n, r)), u: e.u } : { O: e.O, R: e.s > 0 ? e.R - r : e.R + r };
// Titik potong dua sisi geser yang paling dekat ke sudut: pusat busur pembulat.
function potong(a, b, dekat) {
  const calon = [];
  if (a.garis && b.garis) {
    const d = silang(a.u, b.u);
    if (Math.abs(d) > 1e-9) calon.push(tambah(a.P, kali(a.u, silang(kurang(b.P, a.P), b.u) / d)));
  } else if (a.garis || b.garis) {
    const g = a.garis ? a : b, k = a.garis ? b : a, w = kurang(g.P, k.O);
    const B = titik(g.u, w), D = B * B - titik(w, w) + k.R * k.R;
    if (D >= 0) calon.push(tambah(g.P, kali(g.u, -B - Math.sqrt(D))), tambah(g.P, kali(g.u, -B + Math.sqrt(D))));
  } else {
    const d = Math.hypot(b.O.x - a.O.x, b.O.y - a.O.y);
    if (d > 1e-9 && d <= a.R + b.R && d >= Math.abs(a.R - b.R)) {
      const l = (a.R * a.R - b.R * b.R + d * d) / (2 * d), h = Math.sqrt(Math.max(0, a.R * a.R - l * l));
      const u = satuan(kurang(b.O, a.O)), m = tambah(a.O, kali(u, l)), v = V(-u.y, u.x);
      calon.push(tambah(m, kali(v, h)), tambah(m, kali(v, -h)));
    }
  }
  let hasil = null, jarakMin = Infinity;
  for (const p of calon) { const j = Math.hypot(p.x - dekat.x, p.y - dekat.y); if (j < jarakMin) { jarakMin = j; hasil = p; } }
  return hasil;
}
const singgung = (e, F) => e.garis ? tambah(F, kali(e.n, -titik(kurang(F, e.P), e.n))) : tambah(e.O, kali(satuan(kurang(F, e.O)), e.R));

// Kontur dari sudut [kiri atas, kanan atas, kanan bawah, kiri bawah], lengkung sisi [atas, kanan, bawah, kiri], radius tiap sudut.
function konturMata(K, lengkung, radius) {
  const E = K.map((P, j) => sisiMata(P, K[(j + 1) % 4], lengkung[j]));
  // Belokan di sudut i: dari arah akhir sisi sebelumnya ke arah awal sisi berikutnya. Jarak singgung = r x tan(belok / 2).
  const tg = K.map((_, i) => {
    const a = E[(i + 3) % 4].tQ, b = E[i].tP, belok = Math.atan2(silang(a, b), titik(a, b));
    return belok > 0.01 ? Math.min(40, Math.tan(belok / 2)) : 0;
  });
  const minta = radius.map((x, i) => (tg[i] ? x : 0)), r = minta.slice();
  // Perkiraan awal: panjang tiap sisi dibagi untuk dua sudutnya. Kalau keduanya tidak muat, masing-masing dapat separuh,
  // jadi bagian yang tipis berujung setengah lingkaran, bukan satu sudut besar dan satu sudut kecil.
  for (let j = 0; j < 4; j++) {
    const a = j, b = (j + 1) % 4, L = E[j].L, da = r[a] * tg[a], db = r[b] * tg[b];
    if (da + db <= L) continue;
    const ja = da < L / 2 ? da : db < L / 2 ? L - db : L / 2;
    if (tg[a]) r[a] = Math.min(r[a], ja / tg[a]);
    if (tg[b]) r[b] = Math.min(r[b], (L - ja) / tg[b]);
  }
  // Busur pembulat yang tepat untuk radius sekarang: pusatnya di potongan dua sisi yang digeser ke dalam.
  const hitung = () => {
    const ti = [], to = [];
    for (let i = 0; i < 4; i++) {
      const ea = E[(i + 3) % 4], eb = E[i];
      if (r[i] < 0.05) { ti[i] = to[i] = K[i]; continue; }
      const F = potong(geser(ea, r[i]), geser(eb, r[i]), K[i]);
      if (!F) return null;
      ti[i] = singgung(ea, F); to[i] = singgung(eb, F);
    }
    return { ti, to };
  };
  // Penyetelan: tiap sudut membesar sampai radius pintanya atau sampai bertemu sudut tetangga, dan mengecil kalau bertabrakan.
  let T = null;
  for (let ulang = 0; ulang < 6; ulang++) {
    T = hitung();
    if (!T) { for (let i = 0; i < 4; i++) r[i] *= 0.8; continue; }
    let stabil = true;
    for (let i = 0; i < 4; i++) {
      if (!minta[i]) continue;
      let k = minta[i] / Math.max(r[i], 1e-6);
      for (const j of [(i + 3) % 4, i]) {
        const e = E[j], pakai = titik(kurang(T.to[j], e.P), e.u) + e.c - titik(kurang(T.ti[(j + 1) % 4], e.P), e.u);
        k = Math.min(k, e.c / Math.max(pakai, 1e-6));
      }
      if (Math.abs(k - 1) > 0.002) { r[i] *= k * (k > 1 ? 1 : 0.999); stabil = false; }
    }
    if (stabil) break;
  }
  T = hitung();
  // Titik singgung harus tetap berurutan di sisinya; kalau tidak, semua sudut mengecil sampai sah (jarang, hanya di bentuk ekstrem).
  const sah = (U) => U && [0, 1, 2, 3].every((j) => {
    const e = E[j], a = titik(kurang(U.to[j], e.P), e.u), b = titik(kurang(U.ti[(j + 1) % 4], e.P), e.u);
    return a <= b + 0.05 && a >= -0.05 && b <= e.c + 0.05;
  });
  for (let coba = 0; coba < 12 && !sah(T); coba++) { for (let i = 0; i < 4; i++) r[i] *= 0.85; T = hitung(); }
  if (!sah(T)) { r.fill(0); T = { ti: K, to: K }; }
  const Tin = T.ti, Tout = T.to;
  const p2 = (p) => `${f(p.x)} ${f(p.y)}`;
  let d = `M${p2(Tout[0])}`;
  for (let j = 0; j < 4; j++) {
    const e = E[j], k = (j + 1) % 4;
    d += e.garis ? `L${p2(Tin[k])}` : `A${f(e.R)} ${f(e.R)} 0 0 ${e.s > 0 ? 1 : 0} ${p2(Tin[k])}`;
    if (r[k] >= 0.05) d += `A${f(r[k])} ${f(r[k])} 0 0 1 ${p2(Tout[k])}`;
  }
  return d + 'Z';
}

/**
 * Rangka satu mata. Kotak W x H berpusat (x, y). k: garis tengah melengkung (+ naik jadi lengkung senang, - turun jadi terpejam);
 * ujungnya tetap tegak lurus lengkung seperti goresan kuas. la, lb: kelopak atas turun dan bawah naik (bagian dari H).
 * ca, cb: kelopak melengkung ke dalam (bagian dari W). ma: kelopak atas miring, sudut luar turun (derajat). rt, rb: radius sudut atas dan bawah (bagian dari W).
 */
function jalurMata(x, y, W, H, p, sisi, tMin, rMin, tutup = 0) {
  let yT = -H / 2 + p.la * H, yB = H / 2 - p.lb * H;
  if (yB - yT < tMin) { const m = (yT + yB) / 2; yT = m - tMin / 2; yB = m + tMin / 2; }
  // Lengkung garis tengah dibatasi 0,44: pantulan pegas tidak pernah melewati batas yang ujungnya masih bisa bulat penuh.
  const sK = jepit(p.k, -0.44, 0.44) * W, al = 2 * Math.atan(2 * sK / W), turun = 1 - Math.cos(al);
  const nL = V(-Math.sin(al), -Math.cos(al)), nR = V(Math.sin(al), -Math.cos(al));
  const L0 = V(x - W / 2, y), R0 = V(x + W / 2, y);
  const TL = tambah(L0, kali(nL, -yT)), BL = tambah(L0, kali(nL, -yB)), TR = tambah(R0, kali(nR, -yT)), BR = tambah(R0, kali(nR, -yB));
  // Kelopak (miring dan lengkung ke dalam) memudar saat mata menipis, supaya kelopak tidak saling menembus.
  // Gembung ke luar (ca atau cb negatif) tidak bisa menembus, jadi hanya memudar saat berkedip. Mata terpejam selalu garis berujung setengah lingkaran.
  const tebal = yB - yT, bukaan = jepit((tebal - tMin) / (W * 0.5), 0, 1), buka = 1 - jepit(tutup, 0, 1);
  const kelopak = (v) => (v > 0 ? Math.min(v * bukaan, 0.4 * tebal) : Math.max(v * buka, -0.5 * W));
  const dt = jepit(Math.tan(p.ma * Math.PI / 180) * W * 0.45 * bukaan, -0.35 * tebal, 0.35 * tebal);
  TL.y -= sisi * dt; TR.y += sisi * dt;
  // Sisi atas dan bawah sepusat dengan garis tengah, lalu ditambah lengkung kelopak.
  const lengkung = [sK - yT * turun - kelopak(p.ca * W), 0, -sK + yB * turun - kelopak(p.cb * W), 0];
  const r = [p.rt, p.rt, p.rb, p.rb].map((v) => Math.max(rMin, v * W));
  return konturMata([TL, TR, BR, BL], lengkung, r);
}

// ---------- Pegas ----------
// Pegas teredam semi-implisit dengan langkah kecil supaya stabil di kekakuan tinggi.
const P = (x) => ({ x, v: 0, t: x });
function pegas(s, k, z, dt) {
  const c = 2 * Math.sqrt(k) * z;
  for (let sisa = dt; sisa > 0; sisa -= 1 / 240) {
    const h = Math.min(sisa, 1 / 240);
    s.v += (k * (s.t - s.x) - c * s.v) * h;
    s.x += s.v * h;
  }
}
const diam = (s, e = 0.01) => Math.abs(s.t - s.x) < e && Math.abs(s.v) < e * 10;

// ---------- Ekspresi: hanya bentuk mata ----------
// Per mata (lihat jalurMata): w lebar, h tinggi, dy geser (bagian dari tinggi mata), k lengkung garis tengah,
// la dan lb kelopak, ca dan cb lengkung kelopak, ma miring, rt dan rb radius sudut. Netral = kapsul tegak.
const N = { w: 1, h: 1, dy: 0, k: 0, la: 0, lb: 0, ca: 0, cb: 0, ma: 0, rt: 0.5, rb: 0.5 };
const dua = (o) => [{ ...N, ...o }, { ...N, ...o }];
// Senang: bulan sabit, tengahnya tebal, ujungnya bulat. Gembira: lengkung tipis yang lebih melengkung.
const SENANG = { w: 1.08, h: 0.24, k: 0.3, ca: -0.2, dy: -0.08 };
export const EKSPRESI = {
  netral: dua({}),
  senang: dua(SENANG),
  gembira: dua({ w: 1, h: 0.21, k: 0.44, dy: -0.1 }),
  fokus: dua({ w: 1.06, la: 0.3, lb: 0.06, ca: -0.03, rt: 0.22 }),
  berpikir: [{ ...N, la: 0.24, rt: 0.26 }, { ...N, la: 0.04, h: 1.04 }],
  kaget: dua({ w: 1.18, h: 1.18, dy: -0.06 }),
  cemas: dua({ la: 0.24, ma: 14, ca: -0.02, h: 0.98, rt: 0.22 }),
  mengantuk: dua({ la: 0.5, lb: 0.06, ca: 0.04, dy: 0.05, rt: 0.26 }),
  tidur: dua({ w: 1.1, h: 0.16, k: -0.18, dy: 0.14 }),
  kedip: [{ ...N, w: 1, h: 0.21, k: 0.4, dy: -0.06 }, { ...N, ...SENANG }],
  memuat: dua({ la: 0.08 }),
};
const KUNCI = Object.keys(N);
// Irama kedip per emosi: jeda acak (ms, dari dan sampai), lalu tutup, tahan, buka (ms). Fokus jarang berkedip, cemas sering, mengantuk berat.
const IRAMA = {
  netral: [2400, 6000, 70, 30, 150], senang: [2200, 5000, 70, 30, 160], fokus: [4800, 9000, 60, 20, 130],
  berpikir: [3200, 7000, 80, 40, 170], kaget: [3800, 7000, 50, 10, 110], cemas: [900, 2600, 50, 20, 110],
  mengantuk: [2600, 5200, 180, 160, 380], memuat: [3000, 6500, 70, 30, 150],
};
// Kedip lambat: tanda percaya, seperti kucing.
const LAMBAT = [220, 180, 420];
// Gaya mata. tetes: bentuk saja. embun: tetes berkilau. cair: tetes yang meregang saat melirik dan memantul saat berhenti.
const MATA = { tetes: { k: 380, z: 0.72 }, embun: { k: 380, z: 0.72 }, cair: { k: 260, z: 0.42 } };
// Watak: seberapa banyak badan ikut bereaksi saat disentuh (atribut watak; tanpa atribut = hanya mata yang menoleh).
// tenang: mengecil rata dan berkedip. hidup: pipih, memantul, bisa diseret lalu kembali seperti karet, bisa mengantuk.
// main: hidup, ditambah bisa dilempar dan memantul di tepi wadahnya.
// Kotak bekerja (pulau, kartu, tombol) di watak apa pun: tekan mengecil rata 3 persen dan tidak bisa diseret, supaya isinya tetap terbaca dan di tempatnya.
const WATAK = { tenang: { tekan: 0.03 }, hidup: { tekan: 0.07, seret: true }, main: { tekan: 0.1, seret: true, lempar: true } };
// Gaya morph: pegas presisi, lipat kertas, jeli lentur.
// Pegas: sekitar 450 ms sampai diam, lewat sedikit. Jeli: lebih lentur dan bergoyang. Lipat: lini waktu 520 ms.
const GAYA = { pegas: { k: 230, z: 0.76 }, jeli: { k: 200, z: 0.36 }, lipat: { k: 230, z: 1 } };

// ---------- Jam bersama, penunjuk, gulir ----------
const semua = new Set();
let jalan = false, tLalu = 0;
const penunjuk = { x: 0, y: 0, t: -1e9 };
const gulir = { arah: 0, t: -1e9, y: 0 };
function detak() {
  // Waktu dari performance.now, sama dengan yang dipakai lini waktu kedip dan lipat.
  const t = performance.now();
  const dt = jepit((t - tLalu) / 1000, 0.001, 0.05);
  tLalu = t;
  let ada = false;
  for (const a of semua) if (a.terlihat && !a.hasAttribute('beku')) { a.langkah(dt, t); ada = true; }
  if (ada && !document.hidden) requestAnimationFrame(detak); else jalan = false;
}
function bangunkan() {
  if (jalan || kurangi()) return;
  jalan = true; tLalu = performance.now(); requestAnimationFrame(detak);
}
addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') { penunjuk.x = e.clientX; penunjuk.y = e.clientY; penunjuk.t = performance.now(); } }, { passive: true });
addEventListener('scroll', () => { gulir.arah = Math.sign(scrollY - gulir.y) || gulir.arah; gulir.y = scrollY; gulir.t = performance.now(); }, { passive: true });
document.addEventListener('visibilitychange', () => { if (!document.hidden) bangunkan(); });
// Layar berubah lebar atau huruf selesai dimuat: pulau diukur ulang (lebar isinya dikunci ke px penuh).
const ukurUlangPulau = () => { for (const a of semua) if (a.s.mode === 'status') a.keMode('status', true); };
addEventListener('resize', ukurUlangPulau, { passive: true });
if (document.fonts) document.fonts.addEventListener('loadingdone', ukurUlangPulau);
const pengamat = new IntersectionObserver((es) => {
  for (const e of es) {
    const a = e.target.__dsq;
    if (!a) continue;
    a.terlihat = e.isIntersecting;
    // Keluar layar di tengah morph: langsung ke ukuran akhir, supaya isi tidak menonjol keluar badan dan menambah gulir samping.
    if (!a.terlihat) a.selesaikanMorph();
  }
  bangunkan();
}, { rootMargin: '120px' });

// ---------- Gaya elemen (sekali per dokumen) ----------
const CSS = `
dynamic-square { display: inline-block; position: relative; vertical-align: middle; width: var(--dsq-w, var(--dsq, 56px)); height: var(--dsq-h, var(--dsq, 56px)); flex: none; -webkit-tap-highlight-color: transparent; }
dynamic-square:focus-visible { outline: none; }
dynamic-square > svg { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }
dynamic-square > .dsq-ukur { position: absolute; left: 0; top: 0; visibility: hidden; pointer-events: none; width: var(--dsq-w, var(--dsq, 56px)); height: var(--dsq-h, var(--dsq, 56px)); }
/* Isi mode yang tidak dipakai tidak ikut tata letak, supaya tidak menambah gulir samping. */
dynamic-square > .dsq-isi { display: none; }
dynamic-square > .dsq-isi.is-siap { display: grid; }
dynamic-square > .dsq-isi { position: absolute; left: 0; top: 0; opacity: 0; transform: translateY(4px); transition: opacity 160ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1); pointer-events: none; }
dynamic-square > .dsq-isi.is-tampil { opacity: 1; transform: none; pointer-events: auto; }
.dsq-status { box-sizing: border-box; width: max-content; display: grid; align-content: center; gap: 8px; padding: 0 20px 0 0; white-space: nowrap; font-family: var(--f-teks, system-ui, sans-serif); }
/* Pulau paling lebar --dsq-pulau-maks (bawaan 360); teks yang lebih panjang dipotong dengan elipsis, tidak pernah keluar dari badan. */
.dsq-status > *, .dsq-status .dsq-baris > * { min-width: 0; }
.dsq-status b, .dsq-status small { overflow: hidden; text-overflow: ellipsis; }
.dsq-status b { font-weight: 600; font-size: 15px; line-height: 20px; }
.dsq-status .dsq-baris { display: flex; align-items: center; gap: 8px; }
.dsq-status small { font-size: 13px; line-height: 16px; opacity: 0.88; }
.dsq-bar { position: relative; height: 4px; width: 128px; flex: none; border-radius: 999px; overflow: hidden; }
.dsq-bar::before { content: ''; position: absolute; inset: 0; background: currentColor; opacity: 0.24; }
.dsq-bar i { position: absolute; left: 0; top: 0; bottom: 0; width: var(--dsq-kemajuan, 0%); background: currentColor; border-radius: 999px; transition: width 480ms cubic-bezier(0.2, 0.8, 0.2, 1); }
.dsq-kartu { box-sizing: border-box; display: grid; gap: 12px; padding: 16px 24px 24px; font-family: var(--f-teks, system-ui, sans-serif); }
.dsq-kartu .dsq-kepala { display: grid; gap: 4px; align-content: center; min-height: 24px; }
.dsq-kartu b { font-weight: 700; font-size: 17px; line-height: 24px; }
/* Keterangan: pasangan 88 persen, kontras paling rendah 4,6 (di secang). */
.dsq-kartu small { font-size: 13px; line-height: 16px; opacity: 0.88; }
.dsq-kartu p { margin: 0; font-size: 15px; line-height: 20px; }
.dsq-kartu button { appearance: none; border: 0; font: inherit; font-weight: 700; font-size: 17px; line-height: 24px; height: 48px; padding: 0 24px; border-radius: 999px; cursor: pointer; justify-self: start; }
.dsq-kartu button:focus-visible { outline: 2px solid var(--dsq-pasangan, currentColor); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { dynamic-square > .dsq-isi, .dsq-bar i { transition: none; } }
dynamic-square[beku] > .dsq-isi, dynamic-square[beku] .dsq-bar i { transition: none; }
`;
function pasangGaya() {
  if (document.getElementById('dsq-gaya')) return;
  const s = document.createElement('style'); s.id = 'dsq-gaya'; s.textContent = CSS; document.head.appendChild(s);
}

// ---------- Elemen ----------
class DynamicSquare extends HTMLElement {
  static observedAttributes = ['warna', 'ekspresi', 'mode', 'gaya', 'mata', 'watak', 'palet', 'ikuti', 'teks', 'kemajuan', 'keterangan', 'beku', 'kedalaman', 'latar'];

  connectedCallback() {
    if (this.__siap) return;
    this.__siap = true;
    pasangGaya();
    const id = 'dsq' + ++nomor;
    this.__id = id;
    this.ukur = document.createElement('span'); this.ukur.className = 'dsq-ukur'; this.ukur.setAttribute('aria-hidden', 'true');
    this.svg = el('svg', { 'aria-hidden': 'true', width: 1, height: 1 });
    const defs = el('defs', {}, this.svg);
    el('feGaussianBlur', { stdDeviation: 3 }, el('filter', { id: `${id}-kabur`, x: '-50%', y: '-300%', width: '200%', height: '700%' }, defs));
    this.jAlas = el('ellipse', { display: 'none', filter: `url(#${id}-kabur)` }, this.svg);
    this.tubuh = el('g', {}, this.svg);
    this.jTebal = el('path', { display: 'none' }, this.tubuh);
    this.jTepi = el('path', { display: 'none' }, this.tubuh);
    this.jBadan = el('path', {}, this.tubuh);
    this.jKepala = el('path', { display: 'none' }, this.tubuh);
    this.jPanel = el('path', { display: 'none' }, this.tubuh);
    this.gMata = el('g', {}, this.tubuh);
    // Cincin fokus papan ketik: sepusat dengan badan, jarak 4, garis 2.
    this.jFokus = el('path', { fill: 'none', 'stroke-width': 2, display: 'none' }, this.tubuh);
    // Tiap mata: satu kontur. Kilau embun (besar dan kecil) dipotong mengikuti kontur yang sama, jadi ikut tertutup saat berkedip.
    this.mata = [0, 1].map((i) => {
      const klip = el('path', {}, el('clipPath', { id: `${id}-k${i}` }, defs));
      const bola = el('path', {}, this.gMata);
      const kilau = [0, 1].map(() => el('ellipse', { 'clip-path': `url(#${id}-k${i})`, fill: HEX.kapur, display: 'none' }, this.gMata));
      return { bola, klip, kilau, p: Object.fromEntries(KUNCI.map((k) => [k, P(N[k])])) };
    });
    this.isiStatus = document.createElement('div'); this.isiStatus.className = 'dsq-isi dsq-status';
    this.isiStatus.innerHTML = '<b></b><span class="dsq-baris"><span class="dsq-bar"><i></i></span><small></small></span>';
    this.isiKartu = document.createElement('div'); this.isiKartu.className = 'dsq-isi dsq-kartu';
    this.isiKartu.innerHTML = '<div class="dsq-kepala"><b></b><small></small></div><p></p><button type="button" hidden></button>';
    this.append(this.ukur, this.svg, this.isiStatus, this.isiKartu);

    const S = this.ukurWajah();
    const warna = this.getAttribute('warna') || 'kunyit';
    this.pal = PALET[this.getAttribute('palet')] || PALET.asli;
    const H0 = this.pal.hex, M0 = this.pal.pasangan;
    this.s = {
      w: P(S.w), h: P(S.h), fx: P(S.fx), fy: P(S.fy), fs: P(S.fs),
      gx: P(0), gy: P(0), loncat: P(0), geser: P(0), condong: P(0), miringX: P(0), miringY: P(0),
      warna: keOklab(H0[warna]), warnaT: keOklab(H0[warna]), mataW: keOklab(H0[M0[warna]]), mataWT: keOklab(H0[M0[warna]]),
      tekan: P(0), sx: P(0), sy: P(0), perhatian: P(0), lempar: null, terakhir: performance.now(), colek: [], kantuk: 0,
      ekspresi: this.getAttribute('ekspresi') || 'netral', bawaan: this.getAttribute('ekspresi') || 'netral', sampai: 0,
      kedip: 0, kedipNilai: 0, kedipP: P(0), kedipMulai: -1, kedipBerikut: performance.now() + acak(900, 3200), kedipSebelah: -1, irama: IRAMA.netral.slice(2), lambat: false,
      lirik: { x: 0, y: 0, t: 0 }, mikro: { x: 0, y: 0, t: 0 }, tetap: null, baca: -1,
      fase: Math.random() * 6.28, mode: 'wajah', modeTampil: 'wajah', isiMuncul: 0,
      lipat: null, gelombang: [0, 0, 0, 0],
    };
    this.gaya = this.getAttribute('gaya') || 'pegas';
    this.gayaMata = MATA[this.getAttribute('mata')] ? this.getAttribute('mata') : 'tetes';
    this.warna(warna);
    this.terlihat = true;
    this.__dsq = this;
    this.pasangSentuh();
    new ResizeObserver(() => { if (this.s.mode === 'wajah') this.keMode('wajah', true); }).observe(this.ukur);
    // Isi pulau dan kartu diukur ulang kalau ukurannya berubah (huruf termuat, teks berganti), supaya tidak pernah terpotong.
    const ukurIsi = new ResizeObserver(() => {
      const s = this.s;
      if (s.mode === 'status' && Math.abs(s.w.t - (s.fs.t + this.isiStatus.scrollWidth)) > 1) this.keMode('status', true);
      if (s.mode === 'kartu' && Math.abs(s.h.t - this.isiKartu.scrollHeight) > 1) this.keMode('kartu', true);
    });
    ukurIsi.observe(this.isiStatus); ukurIsi.observe(this.isiKartu);
    pengamat.observe(this);
    semua.add(this);
    this.terapkanAtribut();
    this.gambar(performance.now());
    bangunkan();
  }
  disconnectedCallback() { semua.delete(this); pengamat.unobserve(this); document.removeEventListener('dsq-selesai', this.__tim); this.__siap = false; this.replaceChildren(); }
  attributeChangedCallback() { if (this.__siap) this.terapkanAtribut(); }

  terapkanAtribut() {
    const a = (n) => this.getAttribute(n);
    if (PALET[a('palet')] && PALET[a('palet')] !== this.pal) { this.pal = PALET[a('palet')]; if (!a('warna')) this.warna(this.namaWarna); }
    this.watak = WATAK[a('watak')] ? a('watak') : null;
    const kdLama = this.kedalaman;
    this.kedalaman = KEDALAMAN.includes(a('kedalaman')) ? a('kedalaman') : null;
    if (kdLama !== undefined && kdLama !== this.kedalaman && this.s.mode === 'kartu') this.keMode('kartu', true);
    this.latar = this.pal.hex[a('latar')] ? a('latar') : 'kapur';
    if (!this.kedalaman) { this.svg.style.filter = this.svg.style.transform = ''; }
    if (this.watak) {
      if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
      if (!this.hasAttribute('role')) this.setAttribute('role', 'button');
      if (!this.hasAttribute('aria-label')) this.setAttribute('aria-label', 'Agen');
      this.aturSentuh();
    }
    if (a('warna')) this.warna(a('warna'));
    if (a('gaya')) this.gaya = a('gaya');
    if (MATA[a('mata')] && a('mata') !== this.gayaMata) { this.gayaMata = a('mata'); this.gambar(); bangunkan(); }
    if (a('ekspresi') && a('ekspresi') !== this.s.bawaan) this.bawaan(a('ekspresi'));
    if (a('teks') != null || a('kemajuan') != null) this.status({ teks: a('teks') ?? undefined, kemajuan: a('kemajuan') != null ? +a('kemajuan') : undefined, keterangan: a('keterangan') ?? undefined }, false);
    const m = a('mode') || 'wajah';
    if (m !== this.s.mode) this.keMode(m);
  }

  // Gerak dikurangi atau beku: semua perubahan seketika, tanpa gerak diam-diam.
  statis() { return kurangi() || this.hasAttribute('beku'); }
  // Hanya wajah yang bisa diseret: halaman di bawah pulau dan kartu tetap bisa digulir dengan jari.
  aturSentuh() {
    const w = WATAK[this.watak];
    if (!w) return;
    const seret = w.seret && this.s.mode === 'wajah';
    this.style.touchAction = seret ? 'none' : '';
    this.style.cursor = seret ? 'grab' : 'pointer';
  }

  // Ukuran wajah dari CSS (--dsq, atau --dsq-w dan --dsq-h untuk persegi panjang). Wajah di sepertiga atas untuk badan tinggi.
  ukurWajah() {
    const w = this.ukur.offsetWidth || 56, h = this.ukur.offsetHeight || 56, fs = Math.min(w, h);
    return { w, h, fs, fx: (w - fs) / 2, fy: (h - fs) * 0.32 };
  }

  // ---------- API ----------
  // seketika: tanpa peralihan (misalnya saat tepi tirai waktu Langit Gumpal melewati agen).
  warna(nama, seketika = false) {
    const H = this.pal.hex, M = this.pal.pasangan;
    this.s.warnaT = keOklab(H[nama]); this.s.mataWT = keOklab(H[M[nama]]); this.namaWarna = nama;
    // Ganti warna saat agen sedang diam juga harus membangunkan detak, kalau tidak warnanya tertahan di tengah jalan.
    if (seketika || this.statis()) { this.s.warna = this.s.warnaT; this.s.mataW = this.s.mataWT; this.gambar(); } else bangunkan();
    this.style.color = H[M[nama]];
    this.style.setProperty('--dsq-pasangan', H[M[nama]]);
    this.isiKartu.querySelector('button').style.cssText = `background:${H[M[nama]]};color:${H[nama]}`;
    bangunkan();
  }
  bawaan(nama) { this.s.bawaan = nama; this.ekspresi(nama); }
  // Ekspresi sementara (selama ms) atau tetap. Ganti ekspresi besar diawali kedip, seperti mata sungguhan.
  ekspresi(nama, selama = 0) {
    const s = this.s;
    if (nama !== s.ekspresi && nama !== 'tidur' && s.ekspresi !== 'tidur' && Math.random() < 0.5) s.kedipBerikut = 0;
    s.ekspresi = nama; s.sampai = selama ? performance.now() + selama : 0;
    s.baca = nama === 'fokus' || nama === 'memuat' ? performance.now() : -1;
    if (this.statis()) { this.mata.forEach((m, i) => KUNCI.forEach((k) => { m.p[k].x = m.p[k].t = EKSPRESI[nama][i][k]; })); this.gambar(); }
    bangunkan();
  }
  lihat(x, y) { this.s.tetap = x == null ? null : { x, y }; bangunkan(); }
  lihatKe(node) {
    if (!node) return this.lihat(null);
    const b = node.getBoundingClientRect(), r = this.getBoundingClientRect(), s = this.s;
    const px = r.left + s.fx.x + s.fs.x / 2, py = r.top + s.fy.x + s.fs.x * 0.45;
    this.lihat(Math.tanh((b.left + b.width / 2 - px) / 240), Math.tanh((b.top + b.height / 2 - py) / 240));
  }
  lompat(kuat = 1) { if (!this.statis()) { this.s.loncat.v = -kuat * Math.max(160, this.s.fs.x * 2.6); bangunkan(); } }
  geleng() { if (!this.statis()) { this.s.geser.v = Math.max(90, this.s.fs.x * 1.6); bangunkan(); } }
  angguk() { if (!this.statis()) { this.s.loncat.v = this.s.fs.x * 0.9; setTimeout(() => { this.s.loncat.v = this.s.fs.x * 0.9; }, 220); bangunkan(); } }
  kedip(sebelah = false) { if (sebelah) this.s.kedipSebelah = performance.now(); else this.s.kedipBerikut = 0; bangunkan(); }
  kedipLambat() { this.s.lambat = true; this.s.kedipBerikut = 0; bangunkan(); }
  status({ teks, kemajuan, keterangan } = {}, buka = true) {
    const st = this.isiStatus;
    if (teks !== undefined) st.querySelector('b').textContent = teks;
    if (keterangan !== undefined) st.querySelector('small').textContent = keterangan;
    // kemajuan null = tanpa baris progres (status selesai).
    if (kemajuan === null) st.style.removeProperty('--dsq-kemajuan');
    else if (kemajuan !== undefined) st.style.setProperty('--dsq-kemajuan', `${Math.round(jepit(kemajuan, 0, 1) * 100)}%`);
    const adaKet = !!st.querySelector('small').textContent;
    // Keterangan kosong tidak ikut tata letak, supaya jarak 8 tidak tertinggal di ujung baris progres.
    st.querySelector('small').hidden = !adaKet;
    st.querySelector('.dsq-baris').hidden = !st.style.getPropertyValue('--dsq-kemajuan') && !adaKet;
    st.querySelector('.dsq-bar').hidden = !st.style.getPropertyValue('--dsq-kemajuan');
    if (buka && this.s.mode !== 'status') this.keMode('status');
    else if (this.s.mode === 'status') this.keMode('status', true);
  }
  kartu({ judul, keterangan, isi, tombol, saatTombol } = {}) {
    const k = this.isiKartu;
    k.querySelector('b').textContent = judul || '';
    k.querySelector('small').textContent = keterangan || '';
    k.querySelector('small').hidden = !keterangan;
    k.querySelector('p').textContent = isi || '';
    const b = k.querySelector('button'); b.hidden = !tombol; b.textContent = tombol || '';
    b.onclick = saatTombol || null;
    this.keMode('kartu');
  }
  tutup() { this.keMode('wajah'); }
  // Selesai: senang, melompat, dan memberi tahu tim. Gagal: cemas dan menggeleng.
  // Warna badan dan sudutnya tidak berubah: agen tidak dikupas (keputusan Panji 30 Okt 2026).
  selesai() {
    this.bangun(); this.ekspresi('senang', 1400);
    if (this.watak !== 'tenang') this.lompat(0.7);
    this.dispatchEvent(new CustomEvent('dsq-selesai', { bubbles: true }));
  }
  gagal() { this.bangun(); this.ekspresi('cemas', 1600); if (this.watak !== 'tenang') this.geleng(); }
  // Bangun dari kantuk: sentuhan, papan ketik, atau penunjuk yang mendekat.
  bangun() {
    const s = this.s;
    s.terakhir = performance.now();
    if (s.kantuk) { s.kantuk = 0; if (s.ekspresi === 'mengantuk' || s.ekspresi === 'tidur') this.ekspresi('kaget', 360); }
  }
  // Ketuk: tenang berkedip, hidup senang sebentar, main melompat.
  // Colek empat kali dalam dua detik: cemas dan menggeleng. Main, enam kali: pura-pura tidur.
  ketuk() {
    const s = this.s, t = performance.now();
    this.bangun();
    s.colek = s.colek.filter((x) => t - x < 2000); s.colek.push(t);
    if (this.watak === 'tenang') return this.kedip();
    // Masih cemas karena dicolek: colekan berikutnya memperpanjang cemasnya, bukan membuatnya senang lagi.
    if (s.ekspresi === 'cemas' && s.sampai > t) { this.ekspresi('cemas', 1200); this.geleng(); return; }
    if (this.watak === 'main' && s.colek.length >= 6) { s.colek = []; this.ekspresi('tidur', 2400); return; }
    if (s.colek.length >= 4) { if (this.watak === 'hidup') s.colek = []; this.ekspresi('cemas', 1200); this.geleng(); return; }
    this.ekspresi('senang', 700);
    if (this.watak === 'main') this.lompat(0.6);
  }

  // ---------- Sentuh: tekan, ketuk, tahan, seret, lempar, papan ketik, tim ----------
  pasangSentuh() {
    const s = this.s;
    let awal = null, tahan = 0;
    const lepasTahan = () => { clearTimeout(tahan); tahan = 0; };
    this.addEventListener('pointerdown', (e) => {
      const w = WATAK[this.watak];
      if (!w || e.button > 0) return;
      // Gerak dikurangi atau beku: ketuk tetap jalan, tanpa tekan, tahan, dan seret.
      const statis = this.statis(), bisaSeret = w.seret && !statis && s.mode === 'wajah';
      awal = { x: e.clientX, y: e.clientY, seret: false, ditahan: false, bisaSeret, jejak: [[e.clientX, e.clientY, performance.now()]] };
      this.bangun();
      if (statis) return;
      s.tekan.t = 1; s.lempar = null;
      if (bisaSeret) { this.setPointerCapture(e.pointerId); this.style.zIndex = '2'; }
      // Tahan setengah detik tanpa bergeser: kedip lambat.
      if (this.watak !== 'tenang') tahan = setTimeout(() => { if (awal && !awal.seret) { awal.ditahan = true; s.tekan.t = 0; this.kedipLambat(); } }, 500);
      bangunkan();
    });
    this.addEventListener('pointermove', (e) => {
      if (!awal) return;
      const w = WATAK[this.watak], dx = e.clientX - awal.x, dy = e.clientY - awal.y;
      awal.jejak.push([e.clientX, e.clientY, performance.now()]); if (awal.jejak.length > 6) awal.jejak.shift();
      if (!awal.seret && awal.bisaSeret && Math.hypot(dx, dy) > 6) { awal.seret = true; lepasTahan(); s.tekan.t = 0; this.ekspresi('kaget', 280); }
      if (!awal.seret) return;
      // Hidup: makin jauh makin berat, seperti karet. Main: ikut penunjuk penuh.
      const karet = (v) => (w.lempar ? v : v / (1 + Math.abs(v) / 140));
      s.sx.t = karet(dx); s.sy.t = karet(dy);
      s.tetap = { x: jepit(dx / 120, -1, 1), y: jepit(dy / 120, -1, 1) };
      bangunkan();
    });
    const lepas = (batal) => {
      if (!awal) return;
      const w = WATAK[this.watak], a = awal;
      awal = null; lepasTahan(); s.tekan.t = 0; s.tetap = null;
      if (a.seret) {
        const [x0, y0, t0] = a.jejak[0], [x1, y1, t1] = a.jejak[a.jejak.length - 1], d = Math.max(16, t1 - t0) / 1000;
        // Kecepatan lempar dibatasi 2.400 px per detik supaya agen tidak hilang dari wadahnya.
        const k = Math.min(1, 2400 / Math.max(1, Math.hypot(x1 - x0, y1 - y0) / d));
        if (w.lempar && !batal) s.lempar = { vx: ((x1 - x0) / d) * k, vy: ((y1 - y0) / d) * k, diam: 0 };
        else { s.sx.t = 0; s.sy.t = 0; }
      } else if (!a.ditahan && !batal) this.ketuk();
      bangunkan();
    };
    this.addEventListener('pointerup', () => lepas(false));
    this.addEventListener('pointercancel', () => lepas(true));
    // Penunjuk masuk: mata membesar sekejap, tanda memperhatikan.
    this.addEventListener('pointerenter', () => {
      this.bangun();
      if (this.watak && this.watak !== 'tenang' && !this.statis()) { s.perhatian.t = 1; setTimeout(() => { s.perhatian.t = 0; bangunkan(); }, 420); }
      bangunkan();
    });
    this.addEventListener('keydown', (e) => { if (this.watak && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); this.ketuk(); } });
    this.addEventListener('focus', () => { this.bangun(); this.gambar(); });
    this.addEventListener('blur', () => this.gambar());
    // Tim: saat satu agen selesai, agen lain di wadah yang sama meliriknya sebentar (main: ikut melompat kecil).
    this.__tim = (e) => {
      if (e.target === this || e.target.parentElement !== this.parentElement || !this.watak || this.watak === 'tenang') return;
      this.lihatKe(e.target); setTimeout(() => this.lihat(null), 1200);
      if (this.watak === 'main') setTimeout(() => this.lompat(0.4), 160);
    };
    document.addEventListener('dsq-selesai', this.__tim);
  }

  // ---------- Morph ----------
  // Ukur isi mode tujuan, lalu tetapkan sasaran badan dan wajah. Isi lama hilang dulu, isi baru muncul sesudah bentuk hampir jadi.
  keMode(mode, ukurUlang = false) {
    const s = this.s, W = this.ukurWajah();
    // Isi mode tujuan masuk tata letak dulu supaya bisa diukur; isi lain keluar sesudah memudar.
    for (const [isi, m] of [[this.isiStatus, 'status'], [this.isiKartu, 'kartu']]) {
      if (m === mode) isi.classList.add('is-siap');
      else setTimeout(() => { if (this.s.mode !== m) isi.classList.remove('is-siap'); }, 200);
    }
    const fs = W.fs;
    let T;
    if (mode === 'status') {
      this.isiStatus.style.left = fs + 'px'; this.isiStatus.style.height = fs + 'px';
      // Pulau paling lebar --dsq-pulau-maks (bawaan 360; halaman boleh mengecilkannya), dan tidak pernah lebih lebar
      // dari layar dikurangi tepi 16 di kiri dan kanan.
      // Lebar layar 0 (dokumen belum ditata atau tersembunyi) diabaikan, supaya pulau tidak runtuh.
      const layar = document.documentElement.clientWidth;
      const maks = Math.min(parseFloat(getComputedStyle(this).getPropertyValue('--dsq-pulau-maks')) || 360, layar > 64 ? layar - 32 : Infinity);
      this.isiStatus.style.maxWidth = Math.max(0, maks - fs) + 'px';
      // Lebar isi dibulatkan ke atas ke px penuh lalu dikunci, supaya badan dan isinya sama lebar dan jarak kanan tepat 20.
      this.isiStatus.style.width = '';
      const lebarIsi = Math.ceil(parseFloat(getComputedStyle(this.isiStatus).width) - 0.01);
      this.isiStatus.style.width = lebarIsi + 'px';
      T = { w: fs + lebarIsi, h: fs, fx: 0, fy: 0, fs };
    } else if (mode === 'kartu') {
      const lebar = parseFloat(getComputedStyle(this).getPropertyValue('--dsq-kartu')) || 320;
      this.isiKartu.style.width = lebar + 'px';
      this.isiKartu.style.paddingLeft = '24px';
      // Judul di kanan kepala. Kartu stiker bertakik: judul mulai 12 sesudah takik (sisi kepala + tepi).
      this.isiKartu.querySelector('.dsq-kepala').style.marginLeft = (this.kedalaman ? fs + tepiStiker(fs, fs) + KD.takik.judul - 24 : fs - 24) + 'px';
      // Kartu bertakik: blok judul setinggi takik dikurangi padding atas, jadi tepi bawah keterangan segaris dengan dasar takik.
      this.isiKartu.querySelector('.dsq-kepala').style.minHeight = ((this.kedalaman ? fs + tepiStiker(fs, fs) : fs) - 16) + 'px';
      T = { w: lebar, h: this.isiKartu.scrollHeight, fx: 0, fy: 0, fs };
    } else T = W;
    const dariMode = s.mode;
    s.mode = mode;
    if (!ukurUlang || mode !== s.modeTampil) {
      this.isiStatus.classList.remove('is-tampil'); this.isiKartu.classList.remove('is-tampil');
      s.isiMuncul = performance.now() + (mode === 'wajah' ? 0 : 120);
    }
    s.modeTampil = mode;
    if (this.gaya === 'lipat' && !this.statis() && this.terlihat && !ukurUlang && dariMode !== mode) {
      s.lipat = { dari: { w: s.w.x, h: s.h.x }, ke: { w: T.w, h: T.h }, mulai: performance.now() };
    }
    // Morph hanya dianimasikan saat terlihat; di luar layar atau beku, badan langsung ke ukuran akhir.
    const langsung = this.statis() || !this.terlihat;
    for (const k of ['w', 'h', 'fx', 'fy', 'fs']) { s[k].t = T[k]; if (langsung || (ukurUlang && dariMode === mode && mode === 'wajah' && !s.lipat)) { s[k].x = T[k]; s[k].v = 0; } }
    this.aturSentuh();
    if (langsung) { s.lipat = null; this.tampilkanIsi(); this.gambar(); }
    bangunkan();
  }
  selesaikanMorph() {
    const s = this.s;
    s.lipat = null; s.gelombang = [0, 0, 0, 0];
    for (const k of ['w', 'h', 'fx', 'fy', 'fs']) { s[k].x = s[k].t; s[k].v = 0; }
    if (s.mode !== 'wajah') this.tampilkanIsi();
    this.gambar();
  }
  tampilkanIsi() {
    const m = this.s.mode;
    this.isiStatus.classList.toggle('is-tampil', m === 'status');
    this.isiKartu.classList.toggle('is-tampil', m === 'kartu');
  }

  // ---------- Satu langkah animasi ----------
  langkah(dt, t) {
    const s = this.s, g = GAYA[this.gaya] || GAYA.pegas;
    // Badan: lipat memakai lini waktu sendiri; pegas dan jeli memakai pegas dengan redaman berbeda.
    if (s.lipat) {
      const u = jepit((t - s.lipat.mulai) / 520, 0, 1);
      s.lipat.u = u;
      if (u >= 1) { for (const k of ['w', 'h']) { s[k].x = s[k].t; s[k].v = 0; } s.lipat = null; }
    } else for (const k of ['w', 'h']) pegas(s[k], g.k, g.z, dt);
    for (const k of ['fx', 'fy', 'fs']) pegas(s[k], 420, 0.86, dt);
    const hampir = !s.lipat && Math.abs(s.w.x - s.w.t) < s.w.t * 0.1 && Math.abs(s.h.x - s.h.t) < s.h.t * 0.1;
    if (s.mode !== 'wajah' && hampir && t > s.isiMuncul && !this.isiStatus.classList.contains('is-tampil') && !this.isiKartu.classList.contains('is-tampil')) this.tampilkanIsi();
    // Jeli: sisi menggembung melawan arah gerak, lalu bergoyang.
    if (this.gaya === 'jeli') { const gw = jepit(-s.w.v * 0.006, -8, 8), gh = jepit(-s.h.v * 0.006, -8, 8); s.gelombang = [gw, gh, gw, gh]; }
    else s.gelombang = [0, 0, 0, 0];
    // Warna berpindah di OKLab.
    const kw = 1 - Math.exp(-dt * 9);
    s.warna = s.warna.map((v, i) => v + (s.warnaT[i] - v) * kw);
    s.mataW = s.mataW.map((v, i) => v + (s.mataWT[i] - v) * kw);
    // Ekspresi: tiap parameter mata mengejar sasaran dengan pegas sedikit lentur.
    if (s.sampai && t > s.sampai) { s.sampai = 0; s.ekspresi = s.bawaan; s.baca = s.bawaan === 'fokus' || s.bawaan === 'memuat' ? t : -1; }
    const E = EKSPRESI[s.ekspresi] || EKSPRESI.netral, gm = MATA[this.gayaMata];
    this.mata.forEach((m, i) => KUNCI.forEach((k) => { m.p[k].t = E[i][k]; pegas(m.p[k], gm.k, gm.z, dt); }));
    // Pandangan.
    const p = this.arahPandang(t);
    const jauh = Math.hypot(p.x - s.gx.t, p.y - s.gy.t);
    // Lirikan jauh kadang diiringi kedip, seperti mata sungguhan.
    if (jauh > 0.7 && s.kedipMulai < 0 && Math.random() < 0.3) s.kedipBerikut = t;
    s.gx.t = p.x; s.gy.t = p.y;
    pegas(s.gx, 900, 0.74, dt); pegas(s.gy, 900, 0.74, dt);
    // Kedip: irama mengikuti emosi (tenang: tutup 70 ms, tahan 30, buka 150). Menutup makin cepat, membuka melambat. Sesekali dua kali.
    if (s.ekspresi !== 'tidur' && t > s.kedipBerikut && s.kedipMulai < 0) {
      s.kedipMulai = t; s.irama = s.lambat ? LAMBAT : (IRAMA[s.ekspresi] || IRAMA.netral).slice(2); s.lambat = false;
    }
    s.kedipNilai = 0;
    if (s.kedipMulai >= 0) {
      const e = t - s.kedipMulai, [tt, th, tb] = s.irama;
      s.kedipNilai = e < tt ? (e / tt) ** 2 : e < tt + th ? 1 : Math.max(0, 1 - (e - tt - th) / tb) ** 1.6;
      if (e >= tt + th + tb) {
        const ir = IRAMA[s.ekspresi] || IRAMA.netral;
        s.kedipNilai = 0; s.kedipMulai = -1; s.kedipBerikut = Math.random() < 0.16 ? t + 140 : t + acak(ir[0], ir[1]);
      }
    }
    // Cair: kelopak mengikuti pegas lentur, jadi mata membuka dengan sedikit pantulan.
    if (this.gayaMata === 'cair') { s.kedipP.t = s.kedipNilai; pegas(s.kedipP, 1500, 0.46, dt); s.kedip = s.kedipP.x; }
    else s.kedip = s.kedipNilai;
    // Badan: loncat, geleng, condong ke arah pandang.
    // Sentuh: tekan memipih, lepas memantul. Seret mengikuti penunjuk; lepas kembali seperti karet, atau meluncur (main).
    pegas(s.tekan, 700, s.tekan.t ? 0.9 : 0.42, dt);
    pegas(s.perhatian, 300, 0.7, dt);
    if (s.lempar) {
      const L = s.lempar, b = this.parentElement && this.parentElement.getBoundingClientRect(), r = this.getBoundingClientRect();
      L.vx *= Math.exp(-dt * 3.2); L.vy *= Math.exp(-dt * 3.2);
      s.sx.x += L.vx * dt; s.sy.x += L.vy * dt;
      if (b) {
        const tepi = [[b.left - r.left, 'sx', 1], [b.right - r.right, 'sx', -1], [b.top - r.top, 'sy', 1], [b.bottom - r.bottom, 'sy', -1]];
        for (const [batas, k, arah] of tepi) {
          const v = k === 'sx' ? 'vx' : 'vy';
          if ((arah > 0 && s[k].x < batas) || (arah < 0 && s[k].x > batas)) { s[k].x = batas; L[v] = arah * Math.abs(L[v]) * 0.55; if (Math.abs(L[v]) > 120) this.ekspresi('kaget', 260); }
        }
      }
      s.sx.t = s.sx.x; s.sy.t = s.sy.x; s.sx.v = L.vx; s.sy.v = L.vy;
      // Berhenti sebentar, lalu pulang ke tempatnya dengan pegas.
      L.diam = Math.hypot(L.vx, L.vy) < 60 ? L.diam + dt : 0;
      if (L.diam > 0.45) { s.lempar = null; s.sx.t = 0; s.sy.t = 0; }
    } else {
      const ikut = s.sx.t || s.sy.t;
      // Sudah pulang: kembali ke lapisan biasa.
      if (!ikut && this.style.zIndex && Math.abs(s.sx.x) + Math.abs(s.sy.x) < 0.5) this.style.zIndex = '';
      pegas(s.sx, ikut ? 900 : 260, ikut ? 0.9 : 0.5, dt); pegas(s.sy, ikut ? 900 : 260, ikut ? 0.9 : 0.5, dt);
    }
    // Kantuk: tanpa sentuhan dan penunjuk jauh, agen netral mengantuk lalu tidur (atribut kantuk = detik, bawaan 30).
    if (s.kantuk && t - penunjuk.t < 300) {
      const r = this.getBoundingClientRect();
      if (Math.hypot(penunjuk.x - r.left - r.width / 2, penunjuk.y - r.top - r.height / 2) < Math.max(160, r.width)) this.bangun();
    } else if (p.dekat !== undefined && p.dekat < 260) s.terakhir = t;
    if (this.watak && this.watak !== 'tenang' && s.bawaan === 'netral' && s.mode === 'wajah' && !s.sampai) {
      const diam = (t - s.terakhir) / 1000, batas = +(this.getAttribute('kantuk') || 30);
      if (diam > batas * 2 && s.kantuk < 2) { s.kantuk = 2; this.ekspresi('tidur'); }
      else if (diam > batas && s.kantuk < 1) { s.kantuk = 1; this.ekspresi('mengantuk'); }
    }
    pegas(s.loncat, 300, 0.32, dt); pegas(s.geser, 900, 0.18, dt);
    s.condong.t = s.gx.x * 2; pegas(s.condong, 120, 0.9, dt);
    if (this.kedalaman === 'melayang' && s.mode === 'wajah') {
      // Miring paling banyak 10 derajat: ke arah seret, atau ke arah penunjuk tetikus yang ada dalam dua kali lebar agen.
      let mx = 0, my = 0;
      if (Math.abs(s.sx.x) + Math.abs(s.sy.x) > 1) { my = jepit(s.sx.x / 60, -1, 1) * KD.melayang.miring; mx = jepit(-s.sy.x / 60, -1, 1) * KD.melayang.miring; }
      else if (t - penunjuk.t < 1500) {
        const r = this.getBoundingClientRect(), dx = penunjuk.x - r.left - r.width / 2, dy = penunjuk.y - r.top - r.height / 2;
        if (Math.hypot(dx, dy) < r.width * 2) { my = jepit(dx / r.width, -1, 1) * KD.melayang.miring; mx = jepit(-dy / r.width, -1, 1) * KD.melayang.miring; }
      }
      s.miringX.t = mx; s.miringY.t = my; pegas(s.miringX, 260, 0.8, dt); pegas(s.miringY, 260, 0.8, dt);
    } else { s.miringX.x = s.miringY.x = 0; }
    this.gambar(t);
  }

  arahPandang(t) {
    const s = this.s;
    if (s.ekspresi === 'tidur' || s.ekspresi === 'mengantuk') return { x: 0, y: s.ekspresi === 'mengantuk' ? 0.2 : 0 };
    // Membaca: mata menyapu kiri ke kanan tiga baris, lalu kembali. Memuat: kiri kanan berirama.
    if (s.baca >= 0) {
      const e = (t - s.baca) / 1000;
      if (s.ekspresi === 'memuat') return { x: Math.sin(e * Math.PI * 1.4) * 0.7, y: 0.1 };
      const baris = Math.floor(e / 0.9) % 3, u = (e % 0.9) / 0.9;
      return { x: u < 0.82 ? -0.6 + (u / 0.82) * 1.2 : 0.6 - ((u - 0.82) / 0.18) * 1.2, y: 0.25 + baris * 0.18 };
    }
    if (s.ekspresi === 'berpikir') return { x: 0.55, y: -0.65 };
    if (s.tetap) return s.tetap;
    // Mikro-lirik: getaran kecil supaya mata tidak beku.
    if (t > s.mikro.t) s.mikro = { x: acak(-0.05, 0.05), y: acak(-0.04, 0.04), t: t + acak(380, 1100) };
    if (this.getAttribute('ikuti') !== 'tidak' && t - penunjuk.t < 2600) {
      const r = this.getBoundingClientRect();
      const px = r.left + s.fx.x + s.fs.x / 2, py = r.top + s.fy.x + s.fs.x * 0.45;
      return { x: Math.tanh((penunjuk.x - px) / 280) + s.mikro.x, y: Math.tanh((penunjuk.y - py) / 280) + s.mikro.y, dekat: Math.hypot(penunjuk.x - px, penunjuk.y - py) };
    }
    if (t - gulir.t < 700) return { x: 0, y: 0.5 * gulir.arah };
    if (t > s.lirik.t) {
      const tengah = Math.random() < 0.4;
      s.lirik = { x: tengah ? 0 : acak(-0.8, 0.8), y: tengah ? 0 : acak(-0.5, 0.5), t: t + acak(1400, 3800) };
    }
    return { x: s.lirik.x + s.mikro.x, y: s.lirik.y + s.mikro.y };
  }

  // ---------- Gambar ----------
  gambar(t = performance.now()) {
    const s = this.s;
    const U = s.lipat ? this.ukuranLipat() : null;
    if (U) { s.w.x = U.w; s.h.x = U.h; }
    const w = s.w.x, h = s.h.x;
    // Elemen mengikuti ukuran badan saat ini, jadi tetangganya ikut bergeser bersama morph.
    this.style.width = Math.round(w) + 'px';
    this.style.height = Math.round(h) + 'px';
    this.svg.setAttribute('width', Math.ceil(w) + 2);
    this.svg.setAttribute('height', Math.ceil(h) + 2);
    const warna = keHex(s.warna);
    // Napas dan pipih saat loncat, berporos di alas. Condong: miring tipis ke arah pandang.
    // Kotak bekerja (pulau, kartu): tanpa napas, condong, dan pipih, supaya badan dan isinya tetap satu. Lompat dan geser tetap, isi ikut.
    const kerja = s.mode !== 'wajah';
    const napas = this.statis() || kerja ? 0 : 0.01 * Math.sin(t / 1000 * (Math.PI * 2 / 3.6) + s.fase);
    const pipih = kerja ? 0 : jepit(-s.loncat.v / Math.max(400, s.fs.x * 30), -0.12, 0.12);
    // Tekan: tenang mengecil rata; hidup dan main pipih ke alas (lebih lebar, lebih pendek) lalu memantul saat dilepas.
    // Kotak bekerja selalu mengecil rata 3 persen, supaya isinya tetap terbaca.
    const dalam = (WATAK[this.watak] ? (kerja ? 0.03 : WATAK[this.watak].tekan) : 0) * s.tekan.x;
    const sy = kerja ? 1 - dalam : 1 + napas + pipih - dalam;
    const sx = kerja ? sy : 1 - (napas + pipih) * 0.6 + (this.watak === 'tenang' ? -dalam : dalam * 0.6);
    const alasW = w, poros = kerja ? h / 2 : h, miring = kerja ? 0 : s.condong.x;
    // Diseret atau dilempar: badan meregang searah gerak, paling banyak 10 persen.
    const vx = s.sx.v, vy = s.sy.v, regang = kerja ? 0 : jepit(Math.hypot(vx, vy) / 8000, 0, 0.1), sudutGerak = Math.atan2(vy, vx) * 180 / Math.PI;
    const tarik = regang > 0.003 ? ` translate(${f(w / 2)} ${f(h / 2)}) rotate(${f(sudutGerak)}) scale(${(1 + regang).toFixed(4)} ${(1 - regang * 0.5).toFixed(4)}) rotate(${f(-sudutGerak)}) translate(${f(-w / 2)} ${f(-h / 2)})` : '';
    // Kedalaman menggeser badan dan isinya bersama: naik saat melayang, turun ke sisi tebal saat timbul ditekan.
    const dk = this.geserKedalaman(t, w, h, U);
    this.tubuh.setAttribute('transform', `translate(${f(s.geser.x + s.sx.x)} ${f(s.loncat.x + s.sy.x + dk)})${tarik} translate(${f(alasW / 2)} ${f(poros)}) skewX(${f(-miring)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(${f(-alasW / 2)} ${f(-poros)})`);
    for (const isi of [this.isiStatus, this.isiKartu]) {
      if (!kerja) { isi.style.translate = isi.style.scale = ''; continue; }
      isi.style.translate = `${f(s.geser.x + s.sx.x)}px ${f(s.loncat.x + s.sy.x + dk)}px`;
      isi.style.scale = Math.abs(1 - sx) > 0.0005 ? sx.toFixed(4) : '';
      isi.style.transformOrigin = `${f(w / 2 - isi.offsetLeft)}px ${f(h / 2)}px`;
    }
    const fokus = !!this.watak && this.matches(':focus-visible');
    this.jFokus.setAttribute('display', fokus ? 'inline' : 'none');
    if (fokus) { const o = 4 + (this.kedalaman ? tepiStiker(s.fs.x, s.fs.x) : 0), rf = radiusAgen(w, h); this.jFokus.setAttribute('d', jalurKotak(w + 2 * o, h + 2 * o, [sudutKepala(s.fs.x, rf, this.takik(w, h)) + o, rf + o, rf + o, rf + o])); this.jFokus.setAttribute('transform', `translate(${-o} ${-o})`); this.jFokus.setAttribute('stroke', HEX.telang); }
    // Badan.
    if (U) this.gambarLipat(warna, U);
    else {
      this.jPanel.setAttribute('display', 'none');
      // Jeli: tinggi berkurang sedikit saat melebar cepat, seperti benda lentur yang menjaga isinya.
      const hj = this.gaya === 'jeli' ? h * (1 - jepit(s.w.v / 6000, -0.06, 0.08)) : h;
      const r = radiusAgen(w, hj);
      const fs = s.fs.x, k = this.takik(w, hj), geserJeli = hj !== h ? `translate(0 ${f(h - hj)})` : '';
      this.jBadan.setAttribute('d', k > 0.01 ? jalurKartuTakik(w, hj, fs, tepiStiker(fs, fs), k) : jalurKotak(w, hj, [r, r, r, r], s.gelombang));
      this.jBadan.setAttribute('transform', geserJeli);
      this.jKepala.setAttribute('display', k > 0.01 ? 'inline' : 'none');
      if (k > 0.01) { this.jKepala.setAttribute('d', jalurKepala(fs, r, k)); this.jKepala.setAttribute('fill', warna); this.jKepala.setAttribute('transform', geserJeli); }
    }
    if (U) this.jKepala.setAttribute('display', 'none');
    this.jBadan.setAttribute('fill', warna);
    this.gambarKedalaman(t, w, h, U);
    // Isi dipotong mengikuti badan saat ini, jadi tidak pernah keluar dari kotak (penting untuk jeli yang memantul).
    for (const isi of [this.isiStatus, this.isiKartu]) {
      if (!isi.classList.contains('is-tampil')) continue;
      const kanan = Math.max(0, isi.offsetLeft + isi.offsetWidth - w), bawah = Math.max(0, isi.offsetHeight - h);
      isi.style.clipPath = kanan || bawah ? `inset(0 ${f(kanan)}px ${f(bawah)}px 0)` : '';
    }
    this.gambarMata();
  }

  // Geser tegak dari kedalaman, dipakai gambar() untuk badan dan isi pulau atau kartu.
  // Takik kartu stiker (hanya berkedalaman, mode kartu): 0 = kartu utuh, 1 = kepala lepas penuh.
  // Membuka bersama morph dari wajah: sisi pendek badan dari kepala + 2R sampai kepala + 4R (R = radius kartu).
  takik(w, h) {
    if (!this.kedalaman || this.s.mode !== 'kartu') return 0;
    const R = radiusAgen(w, h);
    return jepit((Math.min(w, h) - this.s.fs.x - 2 * R) / (2 * R), 0, 1);
  }
  geserKedalaman(t, w, h, U) {
    if (!this.kedalaman || U) return 0;
    if (this.kedalaman === 'timbul') return tepiStiker(this.s.fs.x, this.s.fs.x) * jepit(this.s.tekan.x, 0, 1);
    if (this.kedalaman === 'melayang') return -this.tinggiMelayang(t, w, h);
    return 0;
  }
  // Melayang: 0,14 x sisi pendek di atas alas, naik turun 2 px tiap 3,6 detik (wajah saja; pulau dan kartu diam).
  tinggiMelayang(t, w, h) {
    const s = this.s, M = KD.melayang, dasar = Math.round(s.fs.x * M.tinggi);
    return dasar + (this.statis() || s.mode !== 'wajah' ? 0 : M.ayun * Math.sin((t / 1000) * (Math.PI * 2 / M.ayunDetik) + s.fase));
  }
  // Kedalaman stiker: tepi, sisi tebal, alas, dan bayang. Geser badan sudah dihitung di gambar().
  gambarKedalaman(t, w, h, U) {
    const s = this.s, kd = this.kedalaman;
    const sembunyi = () => { for (const j of [this.jTepi, this.jTebal, this.jAlas]) j.setAttribute('display', 'none'); this.svg.style.filter = ''; this.svg.style.transform = ''; };
    // Saat melipat antar mode, tepi disembunyikan sebentar (bentuknya dua bagian); muncul lagi saat lipat selesai.
    if (!kd || U) return sembunyi();
    // Tebal tepi dari sisi kepala, jadi sama di wajah, pulau, dan kartu. Kartu bertakik: sudut kiri atas ikut kepala.
    const fs = s.fs.x, b = tepiStiker(fs, fs), r = radiusAgen(w, h), R = r + b, rKiri = sudutKepala(fs, r, this.takik(w, h)) + b;
    const d = jalurKotak(w + 2 * b, h + 2 * b, [rKiri, R, R, R]);
    this.jTepi.setAttribute('display', 'inline'); this.jTepi.setAttribute('d', d); this.jTepi.setAttribute('fill', this.pal.hex.kapur);
    this.jTepi.setAttribute('transform', `translate(${-b} ${-b})`);
    const angkat = Math.max(0, -s.loncat.x) + (Math.abs(s.sx.x) + Math.abs(s.sy.x) > 2 ? 6 : 0), tekan = jepit(s.tekan.x, 0, 1);
    this.jTebal.setAttribute('display', kd === 'timbul' ? 'inline' : 'none');
    this.jAlas.setAttribute('display', kd === 'melayang' ? 'inline' : 'none');
    if (kd === 'tempel') {
      // Bayang-kupas (0 2 6, tinta 18 persen) saat diam; ditekan menempel (0 1 2); diangkat atau meloncat menjauh.
      const y = 2 - tekan + angkat * 0.25, blur = 6 - tekan * 4 + angkat * 0.4;
      this.svg.style.filter = `drop-shadow(0 ${f(y)}px ${f(blur)}px rgba(3, 17, 48, 0.18))`;
      this.svg.style.transform = '';
    } else if (kd === 'timbul') {
      // Sisi tebal = tebal tepi, warna latar digelapkan (padat). Ditekan: badan turun ke sisinya, sisi tetap di tempat.
      const tebal = b, masuk = tebal * tekan;
      this.jTebal.setAttribute('d', d); this.jTebal.setAttribute('fill', gelapkan(this.pal.hex[this.latar]));
      this.jTebal.setAttribute('transform', `translate(${-b} ${f(-b + tebal - masuk)})`);
      this.svg.style.filter = ''; this.svg.style.transform = '';
    } else {
      // Mengambang 0,14 x sisi di atas alas, naik turun 2 px tiap 3,6 detik; bayang alas mengecil saat agen makin tinggi.
      const tinggi = this.tinggiMelayang(t, w, h), jauh = tinggi + angkat;
      const k = jepit(1 - jauh / (h * 1.6), 0.35, 1);
      this.jAlas.setAttribute('cx', f(w / 2 + s.geser.x + s.sx.x)); this.jAlas.setAttribute('cy', f(h - 1));
      const A = KD.melayang.alas;
      this.jAlas.setAttribute('rx', f(w * A.lebar / 2 * k)); this.jAlas.setAttribute('ry', f(Math.max(2, h * A.tinggi / 2) * k));
      this.jAlas.setAttribute('fill', HEX.tinta); this.jAlas.setAttribute('fill-opacity', (A.alfa * k).toFixed(3));
      this.svg.style.filter = '';
      const mx = s.miringX.x, my = s.miringY.x;
      this.svg.style.transformOrigin = `${f(w / 2)}px ${f(h / 2 - tinggi)}px`;
      this.svg.style.transform = Math.abs(mx) + Math.abs(my) > 0.05 ? `perspective(${Math.round(w * 6)}px) rotateX(${f(mx)}deg) rotateY(${f(my)}deg)` : '';
    }
  }

  // Lipat: bagian tetap diam, panel membuka (atau menutup) dari engsel seperti kertas. Separuh awal yang terlihat punggung panel.
  // Bertambah luas: lebar dulu lalu tinggi. Berkurang: tinggi dulu lalu lebar.
  ukuranLipat() {
    const L = this.s.lipat, u = L.u ?? 0;
    const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
    // Perubahan kecil (24 px ke bawah) tidak dilipat, cukup ikut bergeser; panel selebar itu terlihat seperti cacat.
    const ubahW = Math.abs(L.ke.w - L.dari.w) > 24, ubahH = Math.abs(L.ke.h - L.dari.h) > 24;
    const xDulu = L.ke.w * L.ke.h >= L.dari.w * L.dari.h;
    let uW = e, uH = e;
    if (!ubahW && !ubahH) return { uW: e, uH: e, sumbu: null, w: L.dari.w + (L.ke.w - L.dari.w) * e, h: L.dari.h + (L.ke.h - L.dari.h) * e };
    if (ubahW && ubahH) { uW = xDulu ? jepit(e * 2, 0, 1) : jepit(e * 2 - 1, 0, 1); uH = xDulu ? jepit(e * 2 - 1, 0, 1) : jepit(e * 2, 0, 1); }
    // Sumbu yang sedang bergerak: x selama uW di antara 0 dan 1 (atau satu-satunya yang berubah).
    const sumbu = ubahW && (!ubahH || (uW > 0 && uW < 1) || (xDulu ? uH === 0 : uH === 1)) ? 'x' : ubahH ? 'y' : null;
    return { uW, uH, sumbu, w: L.dari.w + (L.ke.w - L.dari.w) * uW, h: L.dari.h + (L.ke.h - L.dari.h) * uH };
  }
  gambarLipat(warna, U) {
    const L = this.s.lipat;
    const r = radiusAgen(Math.min(L.dari.w, L.ke.w), Math.min(L.dari.h, L.ke.h));
    const panel = this.jPanel;
    this.jBadan.removeAttribute('transform');
    if (U.sumbu === 'x') {
      const tetapW = Math.min(L.dari.w, L.ke.w), pw = Math.abs(L.ke.w - L.dari.w), H = U.h;
      const buka = L.ke.w > L.dari.w ? U.uW : 1 - U.uW;
      this.jBadan.setAttribute('d', jalurKotak(tetapW, H, [r, 0, 0, r]));
      this.gambarPanel(panel, pw + 1, H, [0, r, r, 0], buka, warna, `translate(${f(tetapW - 1)} ${f(H / 2)})`, 'x');
    } else if (U.sumbu === 'y') {
      const tetapH = Math.min(L.dari.h, L.ke.h), ph = Math.abs(L.ke.h - L.dari.h), W = U.w;
      const buka = L.ke.h > L.dari.h ? U.uH : 1 - U.uH;
      this.jBadan.setAttribute('d', jalurKotak(W, tetapH, [r, r, 0, 0]));
      this.gambarPanel(panel, W, ph + 1, [0, 0, r, r], buka, warna, `translate(${f(W / 2)} ${f(tetapH - 1)})`, 'y');
    } else {
      panel.setAttribute('display', 'none');
      this.jBadan.setAttribute('d', jalurKotak(U.w, U.h, [r, r, r, r]));
    }
  }
  // Panel dilihat dari samping: skala dari engsel (sin), ujungnya sedikit melebar di tengah gerak (kesan tiga dimensi).
  gambarPanel(panel, pw, ph, rs, buka, warna, engsel, sumbu) {
    const sk = Math.max(0.001, Math.sin(buka * Math.PI / 2));
    const ujung = 1 + 0.04 * Math.sin(buka * Math.PI);
    panel.removeAttribute('display');
    panel.setAttribute('d', jalurKotak(pw, ph, rs));
    panel.setAttribute('fill', buka > 0.5 ? warna : punggung(warna));
    panel.setAttribute('transform', sumbu === 'x'
      ? `${engsel} scale(${sk.toFixed(4)} ${ujung.toFixed(4)}) translate(0 ${f(-ph / 2)})`
      : `${engsel} scale(${ujung.toFixed(4)} ${sk.toFixed(4)}) translate(${f(-pw / 2)} 0)`);
  }

  gambarMata() {
    const s = this.s, S = s.fs.x, gm = this.gayaMata;
    // Proporsi mata dari sisi wajah: lebar 0,17, tinggi 0,27, jarak pusat 0,32. Wajah di 0,45 tinggi.
    // Tebal paling tipis 0,24 x lebar (minimal 1,5 px), radius sudut paling kecil 0,18 x lebar.
    const ew = S * 0.17, eh = S * 0.27, tMin = Math.max(1.5, ew * 0.24), rMin = ew * 0.18;
    const gx = jepit(s.gx.x, -1.2, 1.2), gy = jepit(s.gy.x, -1.2, 1.2), ox = gx * S * 0.11, oy = gy * S * 0.08;
    const cx = s.fx.x + S / 2 + ox, cy = s.fy.x + S * 0.45 + oy;
    const jarak = S * 0.32 * (1 - 0.1 * Math.abs(gx));
    // Embun: mata terang menyerap 14 persen telang (seperti kaca), supaya kilau putih terbaca di badan apa pun.
    const terang = s.mataW[0] > 0.7;
    const warnaMata = keHex(gm === 'embun' && terang ? s.mataW.map((v, i) => v + (OK_TELANG[i] - v) * 0.14) : s.mataW);
    // Cair: mata meregang searah lirikan yang cepat, lalu kembali bulat.
    const rx = gm === 'cair' ? jepit(Math.abs(s.gx.v) * 0.01, 0, 0.16) : 0, ry = gm === 'cair' ? jepit(Math.abs(s.gy.v) * 0.01, 0, 0.16) : 0;
    const kedipSebelah = s.kedipSebelah >= 0 ? (() => { const e = performance.now() - s.kedipSebelah; if (e > 420) { s.kedipSebelah = -1; return 0; } return e < 90 ? e / 90 : e < 260 ? 1 : 1 - (e - 260) / 160; })() : 0;
    this.mata.forEach((m, i) => {
      const sisi = i === 0 ? -1 : 1, p = Object.fromEntries(KUNCI.map((k) => [k, m.p[k].x]));
      const tutup = i === 0 ? Math.max(s.kedip, kedipSebelah) : s.kedip;
      // Kedip: mata memipih ke titik sedikit di bawah tengah (kelopak atas menempuh lebih jauh) dan melebar 12 persen.
      // Mata di sisi arah pandang sedikit menyempit (wajah menoleh).
      // Penunjuk masuk: mata membesar 7 persen sekejap.
      const Wb = ew * p.w * (1 + 0.07 * s.perhatian.x), Hb = eh * p.h * (1 + 0.07 * s.perhatian.x);
      const W = Wb * (1 - 0.14 * Math.max(0, sisi * gx)) * (1 + 0.12 * tutup) * (1 + rx - 0.5 * ry);
      const H = Math.max(tMin, Hb + (tMin - Hb) * tutup) * (1 + ry - 0.5 * rx);
      const x = cx + sisi * jarak / 2, y = cy + p.dy * eh + 0.16 * Hb * Math.max(0, tutup);
      // Ditekan: mata menyipit (hidup dan main).
      const la = p.la + 0.1 * Math.max(0, gy) + (this.watak && this.watak !== 'tenang' ? 0.18 * Math.max(0, s.tekan.x) : 0);
      const d = jalurMata(x, y, W, H, { ...p, la }, sisi, tMin, rMin, tutup);
      m.bola.setAttribute('d', d); m.bola.setAttribute('fill', warnaMata);
      // Kilau embun: tetap menghadap cahaya di kanan atas, jadi bergeser separuh lirikan (bola mata terasa bulat dan basah).
      // Meredup saat kelopak turun atau mata melengkung, hilang di bawah 40 px.
      // Kilau yang terlalu redup (di bawah 0,3) tidak digambar: titik abu-abu kecil terbaca sebagai noda, bukan cahaya.
      const nyala = gm !== 'embun' || S < 40 ? 0
        : jepit((jepit((H / Hb - 0.4) / 0.35, 0, 1) * (1 - jepit((p.la - 0.3) / 0.25, 0, 1)) * (1 - jepit((Math.abs(p.k) - 0.06) / 0.12, 0, 1)) - 0.3) / 0.7, 0, 1);
      m.kilau.forEach((k, j) => k.setAttribute('display', nyala > 0.01 && (j === 0 || S >= 72) ? 'inline' : 'none'));
      if (nyala > 0.01) {
        m.klip.setAttribute('d', d);
        // Kilau selalu di dalam bagian mata yang terbuka: di bawah kelopak atas, di atas kelopak bawah, tidak menempel tepi.
        const pipih = Math.min(1, H / Hb), [k1, k2] = m.kilau;
        const yAtas = y - H / 2 + la * H, yBawah = y + H / 2 - p.lb * H, celah = yBawah - yAtas;
        const r1 = 0.18 * Wb * jepit(celah / (0.75 * Hb), 0.6, 1), r2 = 0.075 * Wb;
        const x1 = jepit(x + 0.2 * Wb - 0.5 * ox, x - W / 2 + 1.4 * r1, x + W / 2 - 1.4 * r1);
        k1.setAttribute('cx', f(x1)); k1.setAttribute('cy', f(Math.max(yAtas + 1.45 * r1, y - 0.2 * Hb * pipih - 0.5 * oy)));
        k1.setAttribute('rx', f(r1)); k1.setAttribute('ry', f(r1 * pipih)); k1.setAttribute('opacity', f(nyala));
        const x2 = jepit(x - 0.17 * Wb - 0.5 * ox, x - W / 2 + 1.6 * r2, x + W / 2 - 1.6 * r2);
        k2.setAttribute('cx', f(x2)); k2.setAttribute('cy', f(Math.min(yBawah - 1.8 * r2, y + 0.24 * Hb * pipih - 0.5 * oy)));
        k2.setAttribute('rx', f(r2)); k2.setAttribute('ry', f(r2 * pipih)); k2.setAttribute('opacity', f(celah > 0.6 * Hb ? nyala * 0.9 : 0));
      }
    });
  }
}
if (!customElements.get('dynamic-square')) customElements.define('dynamic-square', DynamicSquare);
export { DynamicSquare };
