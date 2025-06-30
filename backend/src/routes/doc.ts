import { Router } from "express";
import {
  createDoc,
  listDocs,
  checkAccess,
  loadDoc,
  getDocMeta,
} from "../services/doc.service";
import { formatTimeAgo } from "../utils/functions";

const r = Router();

r.post("/", (req, res) => {
  const { password, id } = req.body;
  if (!password) return res.status(400).send("Password required");
  const result = createDoc(password, id);
  const time = formatTimeAgo(Date.now());
  res.json({ id: result.finalId, hash: result.passwordHash, time });
});

r.post("/:id/login", async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const access = await checkAccess(id, password);
  if (!access || !access.result) {
    return res.status(403).send("Forbidden");
  }

  const time = formatTimeAgo(Date.now());
  res.json({ md: loadDoc(id), hash: access.hash, time });
});

r.post("/:id/access", (req, res) => {
  const { id } = req.params;
  const { hash } = req.body;

  const md = loadDoc(id);
  const meta = getDocMeta(id);

  if (!md || !meta) return res.status(404).send("Not found");
  if (hash !== meta.passwordHash) return res.status(403).send("Forbidden");

  res.json({ md });
});

/* GET /api/docs → [id, …]  (для списка) */
r.get("/", (_, res) => res.json(listDocs()));

export default r;
