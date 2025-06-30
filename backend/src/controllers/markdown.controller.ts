import { Request, Response } from "express";
import fs from "fs";
import { DATA_PATH } from "../config";

export function getMarkdown(req: Request, res: Response) {
  const text = fs.existsSync(DATA_PATH)
    ? fs.readFileSync(DATA_PATH, "utf8")
    : "# Hello mindmap";
  res.send(text);
}
