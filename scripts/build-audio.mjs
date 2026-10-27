import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const jsonPath = path.join(rootDir, 'src', 'data', 'introAudioB64.json');
const outDir = path.join(rootDir, 'public', 'audio');
const outFile = path.join(outDir, 'Track_01_Introduction_EN.mp3');
const legacyFile = path.join(rootDir, 'public', 'assets', 'aistudio', 'Track_01_1c68403d.mp3');

if (fs.existsSync(jsonPath)) {
  const { audioBase64 } = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const buffer = Buffer.from(audioBase64, 'base64');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, buffer);
  if (fs.existsSync(path.dirname(legacyFile))) {
    fs.writeFileSync(legacyFile, buffer);
  }
  console.log(`[build-audio] Wrote English Introduction audio (${buffer.length} bytes) to public/audio/Track_01_Introduction_EN.mp3`);
}
