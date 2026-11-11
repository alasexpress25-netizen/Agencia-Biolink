import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import http from 'http';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = http.createServer(app);

  app.use(express.json({ limit: '15mb' }));

  const configPath = path.resolve(__dirname, 'src/data/clientConfig.json');

  // API to get current clientConfig.json
  app.get('/api/config', async (req, res) => {
    try {
      const data = await fs.readFile(configPath, 'utf-8');
      res.json(JSON.parse(data));
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Error leyendo clientConfig.json' });
    }
  });

  // API to save directly to clientConfig.json on disk
  app.post('/api/save-config', async (req, res) => {
    try {
      const newConfig = req.body;
      if (!newConfig || typeof newConfig !== 'object') {
        return res.status(400).json({ error: 'Configuración inválida' });
      }
      await fs.writeFile(configPath, JSON.stringify(newConfig, null, 2), 'utf-8');
      res.json({ success: true, message: 'clientConfig.json guardado con éxito' });
    } catch (e: any) {
      console.error('Error escribiendo en clientConfig.json:', e);
      res.status(500).json({ error: e.message || 'Error guardando clientConfig.json' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
