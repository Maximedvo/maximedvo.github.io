/**
 * Génère les déclinaisons du logo FlashUp à partir du fichier original
 * (src/assets/brand/logo-flashup-original.webp, fond noir).
 *
 *   node scripts/generate-brand-assets.mjs
 *
 * Sorties :
 *  - src/assets/brand/logo-flashup.png          logo complet, fond transparent
 *  - src/assets/brand/logo-flashup-header.png   silhouette + FLASHUP (sans slogan)
 *  - public/og-image.jpg                        image de partage 1200×630
 *  - public/favicon.svg, favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png
 *
 * Si vous recevez une version vectorielle (SVG/AI) du logo, remplacez simplement
 * ces fichiers par des exports propres de la version vectorielle.
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src/assets/brand/logo-flashup-original.webp');

const ORANGE = '#F0760C';
const BLACK = '#0A0A0B';

/** Rend le fond noir transparent (« couleur vers alpha ») pour un logo clair sur noir. */
async function blackToAlpha(input) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  const floor = 6; // bruit de compression
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const m = Math.max(r, g, b);
    const a = Math.max(0, Math.min(1, (m - floor) / (255 - floor)));
    if (a <= 0) { out[j + 3] = 0; continue; }
    // dé-prémultiplication : la couleur reste fidèle une fois posée sur fond sombre
    out[j] = Math.min(255, Math.round(r / a));
    out[j + 1] = Math.min(255, Math.round(g / a));
    out[j + 2] = Math.min(255, Math.round(b / a));
    out[j + 3] = Math.round(a * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } });
}

const transparent = await (await blackToAlpha(src)).png().toBuffer();

// Logo complet (silhouette + FLASHUP + « Esthétique • Automobile »)
await sharp(transparent)
  .extract({ left: 105, top: 244, width: 1456, height: 440 })
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, 'src/assets/brand/logo-flashup.png'));

// Logo d'en-tête (sans le slogan, plus lisible en petit)
await sharp(transparent)
  .extract({ left: 105, top: 244, width: 1456, height: 356 })
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, 'src/assets/brand/logo-flashup-header.png'));

// Silhouette seule (élément décoratif de la bannière d'accueil)
{
  const { data, info } = await sharp(transparent)
    .extract({ left: 105, top: 244, width: 1456, height: 230 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  // on efface le haut des lettres « FLASHUP » qui débordent dans la zone
  for (let y = 210; y < info.height; y++) {
    for (let x = 100; x < info.width; x++) data[(y * info.width + x) * 4 + 3] = 0;
  }
  await sharp(data, { raw: info }).png({ compressionLevel: 9 })
    .toFile(path.join(root, 'src/assets/brand/silhouette-flashup.png'));
}

// Image Open Graph 1200×630 : logo centré sur fond noir
const ogLogo = await sharp(src)
  .extract({ left: 105, top: 244, width: 1456, height: 440 })
  .resize({ width: 980 })
  .toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#000000' } })
  .composite([{ input: ogLogo, gravity: 'centre' }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(root, 'public/og-image.jpg'));

// Favicon : « F » italique + étincelle orange (inspirés du logo)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${BLACK}"/>
  <g fill="#FBF7F0">
    <polygon points="20,14 50,14 47.6,21 17.6,21"/>
    <polygon points="20,14 28.5,14 19.5,50 11,50"/>
    <polygon points="15.8,29 40,29 37.8,35.5 13.6,35.5"/>
  </g>
  <polygon fill="${ORANGE}" points="27,52 41,42 40,46 54,38 40,49 41,45.5"/>
</svg>
`;
await writeFile(path.join(root, 'public/favicon.svg'), faviconSvg);
const faviconBuf = Buffer.from(faviconSvg);
await sharp(faviconBuf, { density: 300 }).resize(32, 32).png().toFile(path.join(root, 'public/favicon-32.png'));
await sharp(faviconBuf, { density: 600 }).resize(180, 180).flatten({ background: BLACK }).png().toFile(path.join(root, 'public/apple-touch-icon.png'));
await sharp(faviconBuf, { density: 600 }).resize(192, 192).png().toFile(path.join(root, 'public/icon-192.png'));
await sharp(faviconBuf, { density: 900 }).resize(512, 512).png().toFile(path.join(root, 'public/icon-512.png'));

console.log('Déclinaisons du logo générées.');
