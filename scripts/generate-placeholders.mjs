/**
 * Generates the labelled placeholder photos in /public/images and the app icons.
 *
 *   npx -y playwright@1 install chromium   (once, if you don't have it)
 *   node scripts/generate-placeholders.mjs
 *
 * These are honest placeholders: warm-toned frames that say which real photo
 * belongs there. Replace each file with a real photo using the same file name
 * and aspect ratio — the site's warm colour treatment is applied in CSS.
 */
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const out = (file) => fileURLToPath(new URL(`../public/${file}`, import.meta.url));

const photos = [
  {
    file: "images/hero-class.jpg", w: 1200, h: 1500, tone: "#cdb38e", no: "01",
    title: "Suasana kelas",
    brief: "Guru dan beberapa murid sedang ngobrol, diambil candid dari samping. Cahaya sore dari jendela — bukan pose.",
    spec: "4:5 · min. 1600 × 2000 px",
  },
  {
    file: "images/hero-teacher.jpg", w: 900, h: 1125, tone: "#bf8f70", no: "02",
    title: "Potret pengajar",
    brief: "Setengah badan, tersenyum, di depan papan tulis. Latar kelas sungguhan.",
    spec: "4:5 · min. 1200 × 1500 px",
  },
  {
    file: "images/hero-notebook.jpg", w: 900, h: 900, tone: "#b3aa84", no: "03",
    title: "Detail catatan",
    brief: "Close-up buku catatan murid: kosakata baru dan coretan pena merah dari guru.",
    spec: "1:1 · min. 1200 × 1200 px",
  },
  ...[
    ["sari", "#c9ae8a"],
    ["daniel", "#b98f74"],
    ["rina", "#b5a885"],
    ["yosef", "#c2a07f"],
    ["tika", "#ad9c7f"],
  ].map(([id, tone], i) => ({
    file: `images/teacher-${id}.jpg`, w: 800, h: 1000, tone, no: `P${i + 1}`,
    title: `Pengajar ${i + 1}`,
    brief: "Potret setengah badan, latar dinding kelas, cahaya lembut. Ganti juga nama & sertifikat di content/teachers.ts.",
    spec: "4:5 · min. 1000 × 1250 px",
  })),
  ...[
    ["kindergarten", "#d0b48c", "Kelas Kindergarten", "Anak-anak TK bernyanyi atau main kartu bergambar bersama guru."],
    ["standard", "#c4a27f", "Kelas Standard", "Murid SD kelas 1–3 menjawab pertanyaan guru, tangan teracung."],
    ["primary", "#b9a07a", "Kelas Primary", "Dua murid membaca cerita pendek bersama, buku terbuka di meja."],
    ["elementary", "#b89a86", "Kelas Elementary", "Siswa SMP latihan percakapan berpasangan."],
    ["intermediate", "#a99c7d", "Kelas Intermediate", "Murid dewasa presentasi singkat di depan kelas."],
    ["pre-toefl", "#b7a58a", "Kelas Pre-TOEFL", "Latihan soal dengan timer di meja, suasana fokus dan tenang."],
  ].map(([slug, tone, title, brief], i) => ({
    file: `images/program-${slug}.jpg`, w: 1500, h: 1000, tone, no: `0${i + 1}`,
    title, brief, spec: "3:2 · min. 1800 × 1200 px",
  })),
  {
    file: "images/location-front.jpg", w: 1200, h: 900, tone: "#c2ab8b", no: "L1",
    title: "Tampak depan",
    brief: "Gedung dari seberang jalan: papan nama, pintu masuk, tempat parkir motor.",
    spec: "4:3 · min. 1600 × 1200 px",
  },
];

const fonts = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&family=Manrope:wght@500;700&display=block" rel="stylesheet">`;

const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.12 0 0 0 0 0.09 0 0 0 0 0.06 0 0 0 0.32 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function photoHtml(p) {
  const u = Math.min(p.w, p.h * 1.1);
  const pad = Math.round(u * 0.055);
  const mark = Math.round(u * 0.035);
  return `<!doctype html><html><head><meta charset="utf-8">${fonts}<style>
  *{box-sizing:border-box;margin:0}
  body{width:${p.w}px;height:${p.h}px;background:${p.tone};position:relative;overflow:hidden;color:#1a1a1a;font-family:Manrope,sans-serif}
  .grain{position:absolute;inset:0;background-image:${grain};mix-blend-mode:multiply}
  .vignette{position:absolute;inset:0;box-shadow:inset 0 0 ${Math.round(u * 0.22)}px rgba(70,45,20,.28)}
  .frame{position:absolute;inset:${pad}px;border:${Math.max(2, Math.round(u * 0.002))}px solid rgba(26,26,26,.5);display:flex;flex-direction:column;justify-content:space-between;padding:${Math.round(u * 0.045)}px}
  .crop{position:absolute;width:${mark}px;height:${mark}px;border-color:rgba(26,26,26,.55);border-style:solid;border-width:0}
  .tl{top:${pad - mark - 6}px;left:${pad - mark - 6}px;border-right-width:2px;border-bottom-width:2px}
  .tr{top:${pad - mark - 6}px;right:${pad - mark - 6}px;border-left-width:2px;border-bottom-width:2px}
  .bl{bottom:${pad - mark - 6}px;left:${pad - mark - 6}px;border-right-width:2px;border-top-width:2px}
  .br{bottom:${pad - mark - 6}px;right:${pad - mark - 6}px;border-left-width:2px;border-top-width:2px}
  .label{font-weight:700;text-transform:uppercase;letter-spacing:.14em;font-size:${Math.round(u * 0.021)}px}
  .row{display:flex;justify-content:space-between;gap:24px;opacity:.78}
  .title{font-family:Fraunces,serif;font-style:italic;font-size:${Math.round(u * 0.085)}px;line-height:1;letter-spacing:-.02em}
  .brief{margin-top:${Math.round(u * 0.03)}px;font-weight:500;font-size:${Math.round(u * 0.031)}px;line-height:1.4;max-width:30ch;opacity:.86}
  </style></head><body>
  <div class="grain"></div><div class="vignette"></div>
  <span class="crop tl"></span><span class="crop tr"></span><span class="crop bl"></span><span class="crop br"></span>
  <div class="frame">
    <div class="row label"><span>Foto ${p.no}</span><span>${p.file.replace("images/", "")}</span></div>
    <div><p class="title">${p.title}</p><p class="brief">${p.brief}</p></div>
    <div class="row label"><span>Placeholder — ganti dengan foto asli</span><span>${p.spec}</span></div>
  </div></body></html>`;
}

function iconHtml(size) {
  return `<!doctype html><html><head><meta charset="utf-8">${fonts}<style>
  *{margin:0}body{width:${size}px;height:${size}px;background:#1a1a1a;display:grid;place-items:center;overflow:hidden}
  span{font-family:Fraunces,serif;font-style:italic;color:#f6f1e7;font-size:${Math.round(size * 0.98)}px;line-height:1;transform:translate(-7%,-9%)}
  i{position:absolute;width:${Math.round(size * 0.15)}px;height:${Math.round(size * 0.15)}px;border-radius:50%;background:#e4572e;right:${Math.round(size * 0.12)}px;bottom:${Math.round(size * 0.18)}px}
  </style></head><body><span>e</span><i></i></body></html>`;
}

await mkdir(out("images"), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();

for (const p of photos) {
  await page.setViewportSize({ width: p.w, height: p.h });
  await page.setContent(photoHtml(p), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out(p.file), type: "jpeg", quality: 80 });
  console.log("✓", p.file);
}

for (const [file, size] of [["icon.png", 512], ["apple-touch-icon.png", 180]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(iconHtml(size), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out(file), type: "png" });
  console.log("✓", file);
}

await browser.close();
