import { Request, Response } from "express";
import fs from "fs";
import { DATA_DIR } from "../config";

export function getMarkdown(req: Request, res: Response) {
  const text = fs.existsSync(DATA_DIR)
    ? fs.readFileSync(DATA_DIR, "utf8")
    : "# Hello mindmap";
  res.send(text);
}
