import { Router } from 'express';
import { getMarkdown } from '../controllers/markdown.controller';

const router = Router();
router.get('/', getMarkdown);

export default router;
