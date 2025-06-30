import fs from "fs";
import path from "path";
import { DATA_DIR, DOCS_META } from "../config";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export interface DocMeta {
  id: string;
  passwordHash: string;
}
const ensure = () => fs.mkdirSync(DATA_DIR, { recursive: true });
const readMeta = (): DocMeta[] =>
  fs.existsSync(DOCS_META)
    ? JSON.parse(fs.readFileSync(DOCS_META, "utf8"))
    : [];

const writeMeta = (list: DocMeta[]) =>
  fs.writeFileSync(DOCS_META, JSON.stringify(list, null, 2));

export function createDoc(password: string, id?: string) {
  ensure();
  const finalId = id ?? nanoid(6);
  const meta: DocMeta = {
    id: finalId,
    passwordHash: bcrypt.hashSync(password, 8),
  };
  const list = [...readMeta(), meta];
  writeMeta(list);
  fs.writeFileSync(path.join(DATA_DIR, `${finalId}.md`), "# New mindmap\n");
  return finalId;
}

export function listDocs() {
  return readMeta().map(({ id }) => id);
}

export function checkAccess(id: string, password: string) {
  const meta = readMeta().find((m) => m.id === id);
  if (!meta) return false;
  return bcrypt.compareSync(password, meta.passwordHash);
}

export function loadDoc(id: string) {
  return fs.readFileSync(path.join(DATA_DIR, `${id}.md`), "utf8");
}

export function saveDoc(id: string, md: string) {
  fs.writeFileSync(path.join(DATA_DIR, `${id}.md`), md, "utf8");
}
