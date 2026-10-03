// Genera manual-focus-checkin.pdf a partir del manual interactivo (index.html).
// Uso:  npm i -D playwright  &&  npx playwright install chromium  &&  node tools/generar-pdf.mjs
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "manual-focus-checkin.pdf");
const SITE = "https://manual-checkin.vercel.app/";
const logo = readFileSync(path.join(root, "assets/logo-axen-capital.svg"), "utf8").replace(/<\?xml[^>]*>/, "");

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1500, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
await page.goto(pathToFileURL(path.join(root, "index.html")).href);
await page.click("#start");
await page.waitForTimeout(900);

const shots = [];
for (let guard = 0; guard < 40; guard++) {
  await page.waitForTimeout(700);
  const info = await page.evaluate(() => {
    const s = S();
    return { n: i + 1, total: STEPS.length, last: i === STEPS.length - 1, vi, nv: STEPS[i].variants ? STEPS[i].variants.length : 0,
      title: s.title, action: s.action, note: s.note || "", result: s.result, label: s.label || "", chip: s.chip || "", milestone: !!s.milestone };
  });
  const el = await page.$("#browser");
  info.img = (await el.screenshot({ type: "jpeg", quality: 82 })).toString("base64");
  shots.push(info);
  if (info.last && (info.nv === 0 || info.vi === info.nv - 1)) break;
  await page.click("#next");
}

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const foot = (n) => `<footer><span>Manual Creado por Rodrigo Fabela | Manual de Usuario - Focus • Plataforma interna de evaluación</span><span>${n}</span></footer>`;
let pageNo = 1;
const stepPages = shots.map((s) => `
<section class="page step">
  <header><div class="lg">${logo}</div><div class="hd"><b>¿Cómo hacer Check In?</b><span>Manual de usuario · Focus</span></div><div class="ct">Paso <b>${s.n}</b> de ${s.total}</div></header>
  <div class="body">
    <div class="shot"><img src="data:image/jpeg;base64,${s.img}" alt=""></div>
    <div class="txt">
      ${s.label ? `<div class="chip">${String.fromCharCode(65 + s.vi)} · ${esc(s.label)}</div>` : ""}
      <div class="t"><span class="num">${s.n}</span><h2>${esc(s.title)}</h2></div>
      <p class="action">${s.action}</p>
      ${s.note ? `<p class="note">${esc(s.note)}</p>` : ""}
      <div class="res"><div class="lbl">Qué va a pasar</div><p>${esc(s.result)}</p></div>
    </div>
  </div>
  ${foot(++pageNo)}
</section>`).join("");

const steps = [...new Map(shots.map((s) => [s.n, s.title])).entries()];
const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap">
<style>
@page{size:Letter landscape;margin:0}
:root{--blue:#0071CE;--deep:#005AA6;--soft:#E2EFFB;--ink:#101820;--muted:#556275;--line:#D5E3F2;--logo-ink:#101820;--logo-accent:#0071CE}
*{box-sizing:border-box}body{margin:0;font-family:Figtree,"Segoe UI",Arial,sans-serif;color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:11in;height:8.5in;position:relative;overflow:hidden;page-break-after:always;display:flex;flex-direction:column;padding:.42in .5in .3in}
h1,h2,b{font-family:Sora,"Segoe UI",Arial,sans-serif}
footer{margin-top:auto;display:flex;justify-content:space-between;font-size:9pt;color:var(--muted);border-top:1px solid var(--line);padding-top:8px}
.cover{justify-content:center;align-items:center;text-align:center;background:linear-gradient(to top,var(--soft),#fff 45%)}
.cover .lg svg{height:.75in;width:auto}
.cover h1{font-size:54pt;line-height:1.05;letter-spacing:-.03em;margin:.5in 0 0}
.cover h1 em{font-style:normal;color:var(--blue)}
.cover .sub{letter-spacing:.32em;text-transform:uppercase;font-size:11pt;font-weight:600;color:var(--muted);margin:.22in 0 0}
.cover .url{margin-top:.45in;font-size:12pt;color:var(--deep);font-weight:600}
.cover footer{position:absolute;left:.5in;right:.5in;bottom:.3in}
header{display:flex;align-items:center;gap:14px;border-bottom:2px solid var(--blue);padding-bottom:10px}
header .lg svg{height:24px;width:auto;display:block}
header .hd{display:flex;flex-direction:column;border-left:1px solid var(--line);padding-left:14px}
header .hd b{font-size:12pt}header .hd span{font-size:9pt;color:var(--muted)}
header .ct{margin-left:auto;font-size:10pt;color:var(--muted)}header .ct b{color:var(--blue)}
.body{flex:1;display:grid;grid-template-columns:1fr 2.75in;gap:.3in;padding:.25in 0;min-height:0}
.shot{display:flex;align-items:center}.shot img{width:100%;border-radius:10px;box-shadow:0 10px 30px -14px rgba(0,61,112,.5)}
.txt{display:flex;flex-direction:column;gap:10px;padding-top:.1in}
.chip{align-self:flex-start;background:var(--blue);color:#fff;font-weight:700;font-size:9.5pt;padding:4px 10px;border-radius:999px}
.t{display:flex;gap:10px;align-items:flex-start}
.num{flex:none;width:30px;height:30px;border-radius:8px;background:var(--blue);color:#fff;display:grid;place-items:center;font-family:Sora,Arial;font-weight:700;font-size:13pt}
h2{margin:0;font-size:15pt;line-height:1.2;letter-spacing:-.01em}
.action{margin:0;font-size:11pt;line-height:1.45}.action q{quotes:"“" "”";font-weight:700}
.note{margin:0;font-size:9.5pt;color:var(--muted);line-height:1.4}
.res{border-top:1px solid var(--line);padding-top:10px}
.lbl{font-size:8pt;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--blue);margin-bottom:4px}
.res p{margin:0;font-size:10pt;color:var(--muted);line-height:1.45}
.end{justify-content:center;align-items:center;text-align:center}
.end .ok{width:1in;height:1in;border-radius:50%;background:var(--blue);display:grid;place-items:center;margin-bottom:.3in}
.end h1{font-size:40pt;margin:0;letter-spacing:-.03em}
.end p{color:var(--muted);font-size:12pt;margin:.12in 0 .3in}
.end ol{text-align:left;columns:2;column-gap:.5in;font-size:10.5pt;line-height:1.7;margin:0;padding-left:1.2em}
.end footer{position:absolute;left:.5in;right:.5in;bottom:.3in}
</style></head><body>
<section class="page cover">
  <div class="lg">${logo}</div>
  <h1>¿Cómo hacer <em>Check In</em>?</h1>
  <p class="sub">Manual de usuario</p>
  <p class="url">Versión interactiva: ${SITE.replace(/\/$/, "")}</p>
  ${foot(1)}
</section>
${stepPages}
<section class="page end">
  <div class="ok"><svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
  <h1>Tutorial completado</h1>
  <p>Ya sabes cómo hacer Check In y Check Out en Focus.</p>
  <ol>${steps.map(([n, t]) => `<li>${esc(t)}</li>`).join("")}</ol>
  ${foot(++pageNo)}
</section>
</body></html>`;

const pdf = await browser.newPage();
await pdf.setContent(html, { waitUntil: "load", timeout: 20000 }).catch(() => {});
await pdf.waitForTimeout(800);
await pdf.pdf({ path: OUT, format: "Letter", landscape: true, printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
await browser.close();
console.log("PDF generado:", OUT, `(${shots.length} pantallas)`);
