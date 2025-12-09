import express from 'express';
import path from 'path';

export function serveStatic(app: express.Application) {
  const clientPath = path.join(process.cwd(), 'dist/public');
  app.use(express.static(clientPath));
  
  // Handle SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}