import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// The cobalt SVG uses fill="#00b0ff" — we replace with tanzanite colors
const srcPath = join(process.cwd(), 'public/icons/mukoko-icon-dark-cobalt.svg');

let svg;
try {
  svg = readFileSync(srcPath, 'utf-8');
} catch {
  // Try alternate path
  svg = readFileSync('/vercel/share/v0-project/public/icons/mukoko-icon-dark-cobalt.svg', 'utf-8');
}

console.log('[v0] Original SVG length:', svg.length);
console.log('[v0] Contains #00b0ff:', svg.includes('#00b0ff'));
console.log('[v0] Contains #00B0FF:', svg.includes('#00B0FF'));

// Find the fill color used
const fillMatch = svg.match(/fill="([^"]+)"/);
console.log('[v0] First fill found:', fillMatch ? fillMatch[1] : 'none');

// Create tanzanite dark version (light fill on dark bg) - #B388FF
const darkSvg = svg.replace(/fill="[^"]+"/g, 'fill="#B388FF"');
const darkPath = join(process.cwd(), 'public/icons/mukoko-icon-dark-tanzanite.svg');
writeFileSync(darkPath, darkSvg, 'utf-8');
console.log('[v0] Written dark tanzanite icon');

// Create tanzanite light version (dark fill on light bg) - #4B0082
const lightSvg = svg.replace(/fill="[^"]+"/g, 'fill="#4B0082"');
const lightPath = join(process.cwd(), 'public/icons/mukoko-icon-light-tanzanite.svg');
writeFileSync(lightPath, lightSvg, 'utf-8');
console.log('[v0] Written light tanzanite icon');

// Create theme-adaptive favicon SVG that switches based on prefers-color-scheme
// Extract the path data from the SVG
const pathMatch = svg.match(/<path[^>]*d="([^"]+)"[^>]*\/>/g);
console.log('[v0] Found', pathMatch ? pathMatch.length : 0, 'path elements');

// Build the favicon with CSS media query for theme switching
const faviconSvg = svg
  .replace(/fill="[^"]+"/g, 'fill="currentColor"')
  .replace('version="1.0">', `version="1.0">
<style>
  path { fill: #4B0082; }
  @media (prefers-color-scheme: dark) {
    path { fill: #B388FF; }
  }
</style>`);

// Write as app/icon.svg for Next.js automatic favicon
const faviconPath = join(process.cwd(), 'app/icon.svg');
writeFileSync(faviconPath, faviconSvg, 'utf-8');
console.log('[v0] Written theme-adaptive favicon');

console.log('[v0] Done! Created 3 files.');
