import fs from 'fs';
import { DATA_PATH } from '../config';

export function saveMarkdown(md: string) {
  fs.mkdirSync('data', { recursive: true });
  fs.writeFileSync(DATA_PATH, md, 'utf8');
}
