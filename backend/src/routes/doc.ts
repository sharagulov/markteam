import { Router } from "express";
import {
  createDoc,
  listDocs,
  checkAccess,
  loadDoc,
} from "../services/doc.service";

const r = Router();

r.post("/", (req, res) => {
  const { password, id } = req.body;
  if (!password) return res.status(400).send("Password required");
  const finalId = createDoc(password, id);
  res.json({ id: finalId });
});

r.post("/:id/login", (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  if (!checkAccess(id, password)) return res.status(403).send("Forbidden");
  res.json({ md: loadDoc(id) });
});

/* GET /api/docs → [id, …]  (для списка) */
r.get("/", (_, res) => res.json(listDocs()));

export default r;
