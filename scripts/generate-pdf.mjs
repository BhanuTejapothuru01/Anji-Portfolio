#!/usr/bin/env node
/**
 * Generate Ram editz portfolio PDF from portfolio-pdf.html
 * Usage: node scripts/generate-pdf.mjs
 */
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'portfolio-pdf.html');
const outDir = path.join(root, 'exports');
const outFile = path.join(outDir, 'Ram-editz-Portfolio.pdf');

const chromePaths = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
];

if (!fs.existsSync(htmlPath)) {
  console.error('Missing portfolio-pdf.html');
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const chrome = chromePaths.find(function (p) { return fs.existsSync(p); });
if (!chrome) {
  console.error('Chrome not found. Open portfolio-pdf.html in a browser and use Print → Save as PDF.');
  process.exit(1);
}

const fileUrl = 'file://' + htmlPath.split(path.sep).join('/').replace(/ /g, '%20');

execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--print-to-pdf=' + outFile,
  fileUrl
], { stdio: 'inherit' });

if (!fs.existsSync(outFile)) {
  console.error('PDF generation failed.');
  process.exit(1);
}

console.log('PDF saved:', outFile);
