import { execSync } from 'node:child_process';

for (const key of Object.keys(process.env)) {
  const lower = key.toLowerCase();
  if (lower.includes('cache_dir') || lower.includes('cache-dir')) {
    delete process.env[key];
  }
}

execSync('npm install --legacy-peer-deps --include=dev --no-audit --no-fund --loglevel=error', {
  stdio: 'inherit',
  env: process.env,
});
