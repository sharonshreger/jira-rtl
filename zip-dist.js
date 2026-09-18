/* Script to automatically zip the dist folder, and create a ready-to-deploy version */

import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

// Load manifest.json to get version
const manifestPath = path.join(process.cwd(), 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const version = manifest.version;

// Ensure publish directory exists
const publishDir = path.join(process.cwd(), 'publish');
if (!fs.existsSync(publishDir)) {
	fs.mkdirSync(publishDir, { recursive: true });
}

// Build zip filename with current version
const zipName = `Jira-RTL-v${version}.zip`;
const outputPath = path.join(publishDir, zipName);
const output = fs.createWriteStream(outputPath);

// Do the magic
const archive = archiver('zip', { zlib: { level: 9 } });
archive.pipe(output);
archive.directory('dist', false);
archive.finalize();