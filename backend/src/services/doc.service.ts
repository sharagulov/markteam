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
  const passwordHash = bcrypt.hashSync(password, 8);
  const meta: DocMeta = {
    id: finalId,
    passwordHash: passwordHash,
  };
  const list = [...readMeta(), meta];
  writeMeta(list);
  fs.writeFileSync(path.join(DATA_DIR, `${finalId}.md`), "# New markteam\n");
  return { finalId, passwordHash };
}

export function listDocs() {
  return readMeta().map(({ id }) => id);
}

export function checkAccess(id: string, password: string) {
  const meta = readMeta().find((m) => m.id === id);
  if (!meta) return false;
  return {
    result: bcrypt.compareSync(password, meta.passwordHash),
    hash: meta.passwordHash,
  };
}

export function loadDoc(id: string) {
  return fs.readFileSync(path.join(DATA_DIR, `${id}.md`), "utf8");
}

export function getDocMeta(
  id: string
): { id: string; passwordHash: string } | null {
  const all = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, "docs.json"), "utf8")
  );
  if (!Array.isArray(all)) return null;
  return all.find((doc) => doc.id === id) || null;
}

export function saveDoc(id: string, md: string) {
  fs.writeFileSync(path.join(DATA_DIR, `${id}.md`), md, "utf8");
}
