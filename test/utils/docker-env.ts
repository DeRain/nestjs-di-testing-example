import * as fs from 'fs';
import * as path from 'path';

export function loadDockerEnv(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), '.env.test.e2e');
  if (!fs.existsSync(envPath)) return {};
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  const out: Record<string, string> = {};
  for (const line of lines) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (!m) continue;
    out[m[1]] = m[2];
  }
  return out;
}


