/**
 * Gera as imagens otimizadas do site a partir dos arquivos originais em /assets-src.
 *
 *   npm run assets
 *
 * Saída em /public/images (WebP + AVIF em mais de um tamanho), favicons e imagem Open Graph.
 * Rode de novo sempre que trocar algum arquivo em /assets-src.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets-src";
const OUT = "public/images";
const PUBLIC = "public";

await fs.mkdir(OUT, { recursive: true });

const src = (file) => path.join(SRC, file);
const out = (file) => path.join(OUT, file);

async function trimBuffer(input) {
  return sharp(input).trim({ threshold: 1 }).toBuffer();
}

async function writeVariants(buf, name, widths, { avif = true, quality = 80 } = {}) {
  for (const w of widths) {
    const resized = () => sharp(buf).resize({ width: w, withoutEnlargement: true });
    await resized().webp({ quality, effort: 6, alphaQuality: 90 }).toFile(out(`${name}-${w}.webp`));
    if (avif) await resized().avif({ quality: quality - 22, effort: 6 }).toFile(out(`${name}-${w}.avif`));
  }
  const meta = await sharp(buf).metadata();
  console.log(`${name}: ${meta.width}x${meta.height} -> ${widths.join(", ")}`);
}

/**
 * Mantém só a região opaca conectada a um ponto (flood fill no canal alfa).
 * Usado para separar o adesivo "Cidadela" da tagline "#O RETORNO" que vem no mesmo arquivo.
 */
async function keepConnected(buf, seedFx, seedFy) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const keep = new Uint8Array(W * H);
  const stack = [[Math.round(W * seedFx), Math.round(H * seedFy)]];
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const k = y * W + x;
    if (keep[k] || data[k * 4 + 3] < 8) continue;
    keep[k] = 1;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  for (let k = 0; k < W * H; k++) if (!keep[k]) data[k * 4 + 3] = 0;
  return trimBuffer(await sharp(data, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer());
}

// ---------------------------------------------------------------------------
// Logo
// ---------------------------------------------------------------------------
const logoFull = await trimBuffer(src("logo-cidadela.png"));
// Versão completa (adesivo + "#O RETORNO"), usada no Hero.
await writeVariants(logoFull, "logo-cidadela", [320, 640, 1200], { avif: false, quality: 88 });
// Só o adesivo "Cidadela" (navbar, rodapé, carregamento).
const logoMark = await keepConnected(logoFull, 0.5, 0.35);
await writeVariants(logoMark, "logo-marca", [240, 480, 960], { avif: false, quality: 88 });

// ---------------------------------------------------------------------------
// Personagem e selo
// ---------------------------------------------------------------------------
await writeVariants(await trimBuffer(src("personagem.webp")), "personagem", [640, 1000, 1400], { quality: 82 });
await writeVariants(await sharp(src("selo-classificacao.webp")).toBuffer(), "selo-classificacao", [160, 320], {
  avif: false,
  quality: 88,
});

// ---------------------------------------------------------------------------
// Textura grafitada (arte oficial "#O RETORNO")
// ---------------------------------------------------------------------------
{
  const img = sharp(src("grafite-retorno.webp"));

  // Textura sem o logo: faixa de cima + faixa de baixo da arte, costuradas com degradê.
  const topPiece = await img.clone().extract({ left: 0, top: 0, width: 2000, height: 600 }).png().toBuffer();
  const feather = 220;
  const bottomMask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="580"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="${feather / 580}" stop-color="#fff" stop-opacity="1"/></linearGradient></defs><rect width="2000" height="580" fill="url(#g)"/></svg>`,
  );
  const bottomPiece = await img
    .clone()
    .extract({ left: 0, top: 1420, width: 2000, height: 580 })
    .ensureAlpha()
    .composite([{ input: bottomMask, blend: "dest-in" }])
    .png()
    .toBuffer();
  const textura = await sharp({ create: { width: 2000, height: 960, channels: 4, background: "#020203" } })
    .composite([
      { input: topPiece, top: 0, left: 0 },
      { input: bottomPiece, top: 380, left: 0 },
    ])
    .png()
    .toBuffer();

  for (const w of [960, 1920]) {
    await sharp(textura).resize({ width: w }).webp({ quality: 68, effort: 6 }).toFile(out(`textura-${w}.webp`));
    await sharp(textura).resize({ width: w }).avif({ quality: 46, effort: 6 }).toFile(out(`textura-${w}.avif`));
  }
  console.log("textura: ok");
}

// ---------------------------------------------------------------------------
// Artes de divulgação: "Seja nosso..." (16:9), redes (16:9) e organizações (4:5)
// Cada arquivo de /assets-src/<pasta>/ vira /public/images/<pasta>/<nome>-<largura>.webp|avif
// ---------------------------------------------------------------------------
async function folder(dir, widths) {
  const from = path.join(SRC, dir);
  let files = [];
  try {
    files = (await fs.readdir(from)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
  } catch {
    return [];
  }
  await fs.mkdir(path.join(OUT, dir), { recursive: true });
  for (const f of files) {
    const name = path.parse(f).name;
    await writeVariants(await sharp(path.join(from, f)).toBuffer(), `${dir}/${name}`, widths, { quality: 78 });
  }
  return files;
}

await folder("criadores", [640, 1280]);
await folder("redes", [640, 1280]);
const orgFiles = await folder("organizacoes", [640, 1000]);

// Brasões das unidades policiais, recortados do centro dos pôsteres (2000x2500).
{
  const police = ["rpm", "gtm", "grr", "graer", "dip", "cot"];
  for (const f of orgFiles) {
    const name = path.parse(f).name;
    if (!police.includes(name)) continue;
    const img = sharp(path.join(SRC, "organizacoes", f));
    const meta = await img.metadata();
    const k = meta.width / 2000; // proporcional, caso o pôster venha em outro tamanho
    const r = Math.round(540 * k);
    const cx = Math.round(1000 * k);
    const cy = Math.round(1470 * k);
    const mask = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${r * 2}" height="${r * 2}"><circle cx="${r}" cy="${r}" r="${r - Math.round(8 * k)}" fill="#fff"/></svg>`,
    );
    const emblem = await img
      .extract({ left: cx - r, top: cy - r, width: r * 2, height: r * 2 })
      .ensureAlpha()
      .composite([{ input: mask, blend: "dest-in" }])
      .png()
      .toBuffer();
    await writeVariants(emblem, `organizacoes/${name}-emblema`, [320, 640], { avif: false, quality: 86 });
  }
}

// ---------------------------------------------------------------------------
// Open Graph 1200x630 — recorte central da arte oficial (logo + #O RETORNO)
// ---------------------------------------------------------------------------
await sharp(src("grafite-retorno.webp"))
  .extract({ left: 0, top: 440, width: 2000, height: 1050 })
  .resize(1200, 630)
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(path.join(PUBLIC, "og-image.jpg"));
console.log("og-image: ok");

// ---------------------------------------------------------------------------
// Favicons — o "C" do logo isolado e redesenhado no estilo adesivo
// (branco, contorno preto, borda rosa)
// ---------------------------------------------------------------------------
{
  const { data, info } = await sharp(logoMark).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const isLetter = (x, y) => {
    const i = (y * W + x) * 4;
    return data[i + 3] > 128 && data[i] > 170 && data[i + 1] > 170 && data[i + 2] > 170;
  };

  // Semente: primeiro pixel branco da esquerda na altura média -> componente conectado (a letra "C").
  const sy = Math.round(H * 0.45);
  let sx = 0;
  while (!isLetter(sx, sy)) sx++;
  const mask = new Uint8Array(W * H);
  const stack = [[sx + 3, sy]];
  let minX = W, minY = H, maxX = 0, maxY = 0;
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const k = y * W + x;
    if (mask[k] || !isLetter(x, y)) continue;
    mask[k] = 255;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  // Recorta a letra com margem para os contornos.
  const P = 90;
  const cw = maxX - minX + 1 + P * 2;
  const ch = maxY - minY + 1 + P * 2;
  const cropped = Buffer.alloc(cw * ch);
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) cropped[(y - minY + P) * cw + (x - minX + P)] = mask[y * W + x];
  }
  const raw1 = { raw: { width: cw, height: ch, channels: 1 } };
  const dilate = async (r) => {
    const { data: o, info: oi } = await sharp(cropped, raw1).blur(r).extractChannel(0).raw().toBuffer({ resolveWithObject: true });
    if (oi.width !== cw || oi.height !== ch || oi.channels !== 1) throw new Error(`dilate: formato inesperado ${JSON.stringify(oi)}`);
    // Limiar baixo sobre a máscara desfocada = dilatação; uma pequena rampa mantém a borda suave.
    for (let i = 0; i < o.length; i++) o[i] = o[i] >= 24 ? 255 : o[i] >= 8 ? (o[i] - 8) * 16 : 0;
    return o;
  };
  const colorLayer = async (alpha, [r, g, b]) => {
    const rgba = Buffer.alloc(cw * ch * 4);
    for (let i = 0; i < cw * ch; i++) {
      rgba[i * 4] = r; rgba[i * 4 + 1] = g; rgba[i * 4 + 2] = b; rgba[i * 4 + 3] = alpha[i];
    }
    return sharp(rgba, { raw: { width: cw, height: ch, channels: 4 } }).png().toBuffer();
  };
  const glyph = await sharp({ create: { width: cw, height: ch, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: await colorLayer(await dilate(34), [242, 34, 131]) },
      { input: await colorLayer(await dilate(18), [2, 2, 3]) },
      { input: await colorLayer(cropped, [254, 254, 255]) },
    ])
    .png()
    .toBuffer();

  const icon = async (size, pad, file, radius = 0) => {
    const inner = Math.round(size * (1 - pad * 2));
    const g = await sharp(glyph).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
    const bg = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="100%" height="100%" rx="${radius}" fill="#020203"/></svg>`,
    );
    await sharp(bg).composite([{ input: g, gravity: "center" }]).png().toFile(path.join(PUBLIC, file));
  };
  await icon(32, 0.04, "favicon-32.png", 6);
  await icon(180, 0.1, "apple-touch-icon.png");
  await icon(512, 0.1, "icon-512.png");
  console.log("favicons: ok");
}
