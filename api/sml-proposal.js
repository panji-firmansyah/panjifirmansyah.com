// Proposal "Everchill 10x Marketing Plan" di /sml/proposal/ (rewrite di vercel.json).
// Akses sama dengan assessment: masuk dengan Google, hanya email di SML_ASSESSMENT_EMAILS, kuki sesi sml_sesi.
// Isi proposal (angka klien dan harga) tidak boleh terbaca di repo ini karena repo publik. Halaman dan PDF disimpan
// terenkripsi (AES-256-GCM) di api/_proposal/*.enc; kuncinya env SML_PROPOSAL_KEY (salinan lokal Panji:
// ~/.config/sml-proposal/key). Sumber dan build: Drive Projects/2026-11-04_surya-marga-luhur/proposal/_build/
// (node build.mjs, deck.mjs, penawaran.mjs, lalu kemas.mjs).
// GET                 -> halaman proposal (sesi sah) atau halaman masuk
// GET ?berkas=deck    -> PDF deck, ?berkas=penawaran -> PDF dokumen penawaran (sesi sah)
import { createDecipheriv, createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import { get, put } from "@vercel/blob";

export const config = { maxDuration: 30 };

const KUKI = "sml_sesi";
const PANJI = "panjifrmansyah@gmail.com";
const JALUR_AKSES = "akses/log.json";
const BERKAS = {
  halaman: { tipe: "text/html; charset=utf-8" },
  deck: { tipe: "application/pdf", nama: "Everchill 10x Marketing Plan.pdf" },
  penawaran: { tipe: "application/pdf", nama: "Penawaran Everchill.pdf" },
};

const tanda = (isi) => createHmac("sha256", process.env.SML_SESSION_SECRET || "").update(isi).digest("base64url");
const daftarEmail = () => (process.env.SML_ASSESSMENT_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
const bacaKuki = (req) => Object.fromEntries((req.headers.cookie || "").split(";").map((k) => k.trim().split("=")).filter((k) => k[0]));

function bacaSesi(req) {
  if (!process.env.SML_SESSION_SECRET) return null;
  const [isi, ttd] = String(bacaKuki(req)[KUKI] || "").split(".");
  if (!isi || !ttd) return null;
  const a = Buffer.from(ttd), b = Buffer.from(tanda(isi));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const { e, x } = JSON.parse(Buffer.from(isi, "base64url").toString());
    return x > Date.now() / 1000 && daftarEmail().includes(e) ? e : null;
  } catch { return null; }
}

function buka(nama) {
  const kunci = Buffer.from(process.env.SML_PROPOSAL_KEY || "", "base64url");
  if (kunci.length !== 32) return null;
  const data = readFileSync(path.join(process.cwd(), "api", "_proposal", `${nama}.enc`));
  const d = createDecipheriv("aes-256-gcm", kunci, data.subarray(0, 12));
  d.setAuthTag(data.subarray(12, 28));
  return Buffer.concat([d.update(data.subarray(28)), d.final()]);
}

// Catatan akses dipakai bersama assessment, supaya Panji tahu kapan proposal dibuka.
async function catatAkses(req, email, hasil) {
  try {
    const h = await get(JALUR_AKSES, { access: "private", useCache: false }).catch(() => null);
    const isi = h && h.statusCode === 200 ? JSON.parse(await new Response(h.stream).text()) : [];
    const ua = String(req.headers["user-agent"] || "");
    const perangkat = /iPhone|Android.*Mobile|Mobile Safari/i.test(ua) ? "HP" : /iPad|Tablet/i.test(ua) ? "Tablet" : "Laptop";
    const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "medium", timeStyle: "short" });
    isi.push({ waktu: `${waktu} WIB`, iso: new Date().toISOString(), email: email || null, hasil, perangkat, peramban: ua.slice(0, 160) });
    await put(JALUR_AKSES, JSON.stringify(isi.slice(-1000)), { access: "private", allowOverwrite: true, addRandomSuffix: false, contentType: "application/json", cacheControlMaxAge: 60 });
  } catch (e) { console.error("sml-proposal: catat akses", e?.message); }
}

function halamanMasuk(status) {
  const pesan = {
    ditolak: "Akun Google itu belum punya akses. Coba akun lain, atau kabari Panji.",
    gagal: "Masuk belum berhasil. Silakan coba lagi.",
    belum: "Halaman ini sedang disiapkan. Coba lagi sebentar lagi.",
  }[status] || "";
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>Everchill 10x Marketing Plan</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@800&family=IBM+Plex+Sans:wght@400;600&display=swap" rel="stylesheet">
<style>
:root{--tinta:#0B1F3F;--abu:#3F4F69;--biru:#025CBC;--siaga-tua:#8A5A00;--siaga-lembut:#FFF4D6}
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fff;color:var(--tinta);font:400 17px/26px "IBM Plex Sans",-apple-system,Arial,sans-serif;padding:24px 16px}
main{width:100%;max-width:440px}
p.untuk{margin:0;font-size:15px;line-height:22px;color:var(--abu)}
h1{margin:24px 0 0;font:800 52px/52px Archivo,Arial,sans-serif;letter-spacing:-0.04em}h1 span{color:var(--biru)}
p.isi{margin:20px 0 0;color:var(--abu)}
a.masuk{display:flex;align-items:center;justify-content:center;height:52px;margin-top:32px;border-radius:8px;background:var(--tinta);color:#fff;text-decoration:none;font-weight:600;font-size:16px}
a.masuk:hover{background:#000}a.masuk:focus-visible{outline:2px solid var(--biru);outline-offset:2px}
.galat{margin:20px 0 0;padding:12px 16px;border-radius:8px;background:var(--siaga-lembut);color:var(--siaga-tua);font-size:15px;line-height:22px}
</style></head><body><main>
<p class="untuk">Untuk Mba Yola, PT Surya Marga Luhur</p>
<h1>Everchill <span>10x</span> Marketing Plan</h1>
<p class="isi">Rencana 6 bulan untuk Everchill dari Panji Firmansyah. Masuk dengan akun Google yang sama seperti saat mengisi assessment.</p>
${pesan ? `<p class="galat" role="alert">${pesan}</p>` : ""}
<a class="masuk" href="/api/sml-assessment?masuk=google&amp;ke=proposal">Masuk dengan Google</a>
</main></body></html>`;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  if (req.method !== "GET") return res.status(405).end();
  try {
    const email = bacaSesi(req);
    const berkas = BERKAS[req.query?.berkas] ? String(req.query.berkas) : "";
    if (!email) {
      if (!berkas) await catatAkses(req, null, "proposal: buka link, belum login");
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send(halamanMasuk(String(req.query?.masuk || "")));
    }
    const data = buka(berkas || "halaman");
    if (!data) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(503).send(halamanMasuk("belum"));
    }
    if (email !== PANJI) await catatAkses(req, email, berkas ? `proposal: unduh ${berkas}` : "proposal: buka halaman");
    const b = BERKAS[berkas || "halaman"];
    res.setHeader("Content-Type", b.tipe);
    if (b.nama) res.setHeader("Content-Disposition", `attachment; filename="${b.nama}"`);
    return res.status(200).send(data);
  } catch (e) {
    console.error("sml-proposal:", e?.name, e?.message);
    return res.status(500).send("Terjadi galat. Coba lagi sebentar lagi.");
  }
}
