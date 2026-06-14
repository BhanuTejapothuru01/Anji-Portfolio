#!/usr/bin/env node
/**
 * Upload a video to Cloudinary (signed upload).
 *
 * Usage:
 *   CLOUDINARY_CLOUD_NAME=dekwcqwij \
 *   CLOUDINARY_API_KEY=your_key \
 *   CLOUDINARY_API_SECRET=your_secret \
 *   node scripts/upload-cloudinary.mjs /path/to/video.mp4
 *
 * Or set CLOUDINARY_URL in .env.local:
 *   CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@dekwcqwij
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { createHash } from 'node:crypto';

function loadEnvFile() {
  const envPath = resolve(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

function parseCloudinaryUrl(url) {
  if (!url) return null;
  const match = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@([^/?]+)/);
  if (!match) return null;
  return {
    apiKey: decodeURIComponent(match[1]),
    apiSecret: decodeURIComponent(match[2]),
    cloudName: match[3]
  };
}

loadEnvFile();

const fromUrl = parseCloudinaryUrl(process.env.CLOUDINARY_URL);
const cloudName = fromUrl?.cloudName || process.env.CLOUDINARY_CLOUD_NAME || 'dekwcqwij';
const apiKey = fromUrl?.apiKey || process.env.CLOUDINARY_API_KEY;
const apiSecret = fromUrl?.apiSecret || process.env.CLOUDINARY_API_SECRET;
const filePath = resolve(process.argv[2] || '');

if (!apiKey || !apiSecret || apiKey.includes('your_api') || apiSecret.includes('your_api')) {
  console.error('Missing Cloudinary credentials.');
  console.error('Create .env.local with your real values from https://console.cloudinary.com/settings/api-keys');
  console.error('CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@dekwcqwij');
  process.exit(1);
}

if (!filePath || !existsSync(filePath)) {
  console.error('Usage: node scripts/upload-cloudinary.mjs /path/to/video.mp4');
  process.exit(1);
}

const timestamp = Math.floor(Date.now() / 1000);
const folder = 'portfolio_videos';
const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
const signature = createHash('sha1').update(paramsToSign).digest('hex');

const form = new FormData();
form.append('file', new Blob([readFileSync(filePath)]), basename(filePath));
form.append('api_key', apiKey);
form.append('timestamp', String(timestamp));
form.append('signature', signature);
form.append('folder', folder);

const url = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
const res = await fetch(url, { method: 'POST', body: form });
const data = await res.json();

if (!res.ok || data.error) {
  console.error('Upload failed:', data.error?.message || res.statusText);
  process.exit(1);
}

console.log(JSON.stringify({
  secure_url: data.secure_url,
  public_id: data.public_id,
  bytes: data.bytes,
  duration: data.duration
}, null, 2));
