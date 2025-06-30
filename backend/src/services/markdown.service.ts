import fs from 'fs';
import { DATA_DIR } from '../config';

export function saveMarkdown(md: string) {
  fs.mkdirSync('data', { recursive: true });
  fs.writeFileSync(DATA_DIR, md, 'utf8');
}
