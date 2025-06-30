import express from 'express';
import http from 'http';
import path from 'path';
import docRoutes from './routes/doc';
import markdownRoutes from './routes/markdown';
import { websocketInit } from './ws';
import { errorHandler } from './middlewares/errorHandler';
import { PORT } from './config';

const app = express();
app.use(express.json());
app.use('/api/docs', docRoutes);
app.use('/api/markdown', markdownRoutes);
app.use(errorHandler);
app.use(express.static(path.resolve('public')));

const server = http.createServer(app);
websocketInit(server);

server.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
