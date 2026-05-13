import { readFile } from "node:fs/promises";
import sharp from "sharp";

const width = 1200;
const height = 630;
const outputPath = "public/og-image.png";
const portraitPath = "public/images/optimized/About-Image.webp";
const logoPath = "public/as-mark.svg";

const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0A0A0F"/>
      <stop offset="0.48" stop-color="#111827"/>
      <stop offset="1" stop-color="#0D0B12"/>
    </linearGradient>
    <linearGradient id="gold" x1="118" y1="116" x2="802" y2="506" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F5D06F"/>
      <stop offset="0.52" stop-color="#D7A53B"/>
      <stop offset="1" stop-color="#B7791F"/>
    </linearGradient>
    <radialGradient id="aura" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(872 236) rotate(129) scale(520 360)">
      <stop stop-color="#D7A53B" stop-opacity="0.42"/>
      <stop offset="0.58" stop-color="#4F46E5" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#0A0A0F" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="24"/>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <circle cx="948" cy="210" r="360" fill="url(#aura)"/>
  <circle cx="128" cy="568" r="260" fill="#0EA5A3" opacity="0.13" filter="url(#soft)"/>
  <path d="M76 520 C260 448 398 546 586 468 C726 410 804 310 1008 340" stroke="#F5D06F" stroke-opacity="0.28" stroke-width="2"/>
  <path d="M80 548 C284 478 390 592 610 506 C764 446 834 360 1088 386" stroke="#2DD4BF" stroke-opacity="0.18" stroke-width="2"/>
  <rect x="64" y="64" width="1072" height="502" rx="34" stroke="#FFFFFF" stroke-opacity="0.12"/>
  <text x="118" y="140" fill="#D6B35A" font-family="Sora, Inter, Arial, sans-serif" font-size="28" font-weight="800" letter-spacing="3">FULL-STACK SOFTWARE ENGINEER</text>
  <text x="116" y="244" fill="#FFFFFF" font-family="Sora, Inter, Arial, sans-serif" font-size="82" font-weight="900">Ahmed Lotfy</text>
  <text x="120" y="316" fill="#D1D5DB" font-family="Inter, Arial, sans-serif" font-size="32" font-weight="600">Next.js, React, TypeScript, PostgreSQL</text>
  <text x="120" y="370" fill="#A7F3D0" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="700">High-performance web apps with measurable business impact</text>
  <g>
    <rect x="120" y="432" width="136" height="48" rx="24" fill="#FFFFFF" fill-opacity="0.08" stroke="#FFFFFF" stroke-opacity="0.12"/>
    <text x="148" y="464" fill="#F8FAFC" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="800">Next.js 16</text>
    <rect x="272" y="432" width="118" height="48" rx="24" fill="#FFFFFF" fill-opacity="0.08" stroke="#FFFFFF" stroke-opacity="0.12"/>
    <text x="300" y="464" fill="#F8FAFC" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="800">React 19</text>
    <rect x="406" y="432" width="150" height="48" rx="24" fill="#FFFFFF" fill-opacity="0.08" stroke="#FFFFFF" stroke-opacity="0.12"/>
    <text x="434" y="464" fill="#F8FAFC" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="800">Cloud Native</text>
  </g>
  <text x="120" y="526" fill="#94A3B8" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700">ahmedlotfy.site</text>
  <rect x="738" y="80" width="334" height="470" rx="42" fill="#020617" fill-opacity="0.58" stroke="#F5D06F" stroke-opacity="0.22"/>
</svg>`;

const portrait = await sharp(portraitPath)
  .resize(334, 470, { fit: "cover", position: "top" })
  .png()
  .toBuffer();

const mask = await sharp({
  create: {
    width: 334,
    height: 470,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([
    {
      input: Buffer.from(
        `<svg width="334" height="470" viewBox="0 0 334 470" xmlns="http://www.w3.org/2000/svg"><rect width="334" height="470" rx="42" fill="white"/></svg>`
      ),
      blend: "over",
    },
  ])
  .png()
  .toBuffer();

const roundedPortrait = await sharp(portrait)
  .ensureAlpha()
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toBuffer();

const logo = await sharp(await readFile(logoPath)).resize(72, 72).png().toBuffer();

await sharp(Buffer.from(svg))
  .composite([
    { input: roundedPortrait, left: 738, top: 80 },
    { input: logo, left: 996, top: 462 },
  ])
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(outputPath);
