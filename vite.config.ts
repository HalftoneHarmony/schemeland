import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const storagePlugin = (): Plugin => {
  return {
    name: 'vite-plugin-storage-server',
    configureServer(server) {
      server.middlewares.use('/api/storage', (req, res, next) => {
        const dbPath = path.resolve(process.cwd(), 'schemeland-db.json');

        try {
          if (req.method === 'GET') {
            if (fs.existsSync(dbPath)) {
              const data = fs.readFileSync(dbPath, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(data || '{}');
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.end('{}');
            }
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                // Ensure it's valid JSON before writing
                JSON.parse(body);
                fs.writeFileSync(dbPath, body);
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true }));
              } catch (e) {
                console.error('JSON Write Error:', e);
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
              }
            });
            return;
          }
        } catch (err) {
          console.error('Storage Server Error:', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
        }

        next();
      });
    },
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), storagePlugin()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
