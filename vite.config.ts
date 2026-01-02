import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// ============================================
// Session Lock System
// ============================================

interface ActiveSession {
  sessionId: string;
  connectedAt: string;
  lastHeartbeat: string;
}

// 메모리에 활성 세션 추적 (서버 재시작 시 초기화됨)
let activeSession: ActiveSession | null = null;
const SESSION_TIMEOUT_MS = 30000; // 30초 동안 heartbeat 없으면 세션 만료

const isSessionExpired = (session: ActiveSession): boolean => {
  const lastBeat = new Date(session.lastHeartbeat).getTime();
  return Date.now() - lastBeat > SESSION_TIMEOUT_MS;
};

const storagePlugin = (): Plugin => {
  return {
    name: 'vite-plugin-storage-server',
    configureServer(server) {
      // ========== Session Management API ==========
      server.middlewares.use('/api/session', (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.end();
          return;
        }

        try {
          // GET: 현재 활성 세션 정보 조회
          if (req.method === 'GET') {
            // 만료된 세션 정리
            if (activeSession && isSessionExpired(activeSession)) {
              console.log(`[Session] Expired: ${activeSession.sessionId.slice(0, 8)}...`);
              activeSession = null;
            }

            res.end(JSON.stringify({
              hasActiveSession: !!activeSession,
              activeSession: activeSession ? {
                sessionId: activeSession.sessionId,
                connectedAt: activeSession.connectedAt,
                isOwner: false // 요청자가 owner인지는 클라이언트에서 판단
              } : null
            }));
            return;
          }

          // POST: 세션 등록 또는 heartbeat
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                const { sessionId, action } = data;

                // 만료된 세션 정리
                if (activeSession && isSessionExpired(activeSession)) {
                  console.log(`[Session] Auto-expired: ${activeSession.sessionId.slice(0, 8)}...`);
                  activeSession = null;
                }

                if (action === 'register') {
                  // 새 세션 등록 시도
                  if (!activeSession) {
                    // 활성 세션 없음 → 이 세션이 Owner
                    activeSession = {
                      sessionId,
                      connectedAt: new Date().toISOString(),
                      lastHeartbeat: new Date().toISOString()
                    };
                    console.log(`[Session] ✅ New owner: ${sessionId.slice(0, 8)}...`);
                    res.end(JSON.stringify({
                      success: true,
                      isOwner: true,
                      message: 'You are the session owner'
                    }));
                  } else if (activeSession.sessionId === sessionId) {
                    // 이미 본인이 Owner
                    activeSession.lastHeartbeat = new Date().toISOString();
                    res.end(JSON.stringify({
                      success: true,
                      isOwner: true,
                      message: 'Session refreshed'
                    }));
                  } else {
                    // 다른 활성 세션 존재
                    console.log(`[Session] ⚠️ Blocked: ${sessionId.slice(0, 8)}... (owner: ${activeSession.sessionId.slice(0, 8)}...)`);
                    res.end(JSON.stringify({
                      success: true,
                      isOwner: false,
                      ownerId: activeSession.sessionId,
                      ownerConnectedAt: activeSession.connectedAt,
                      message: 'Another session is active'
                    }));
                  }
                } else if (action === 'heartbeat') {
                  // Heartbeat 업데이트
                  if (activeSession?.sessionId === sessionId) {
                    activeSession.lastHeartbeat = new Date().toISOString();
                    res.end(JSON.stringify({ success: true, isOwner: true }));
                  } else {
                    res.end(JSON.stringify({ success: true, isOwner: false }));
                  }
                } else {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Invalid action' }));
                }
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
              }
            });
            return;
          }

          // DELETE: 세션 해제 (브라우저 닫을 때)
          if (req.method === 'DELETE') {
            let body = '';
            req.on('data', (chunk) => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const { sessionId } = JSON.parse(body);
                if (activeSession?.sessionId === sessionId) {
                  console.log(`[Session] Released: ${sessionId.slice(0, 8)}...`);
                  activeSession = null;
                  res.end(JSON.stringify({ success: true }));
                } else {
                  res.end(JSON.stringify({ success: false, message: 'Not the owner' }));
                }
              } catch {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
              }
            });
            return;
          }
        } catch (err) {
          console.error('[Session] Error:', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
        }

        next();
      });

      // ========== Storage API (with Session Check) ==========
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
            req.on('data', (chunk) => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body);
                const requestSessionId = parsed._meta?.lastUpdatedBy;

                // 만료된 세션 정리
                if (activeSession && isSessionExpired(activeSession)) {
                  activeSession = null;
                }

                // 세션 잠금 체크
                if (activeSession && requestSessionId && activeSession.sessionId !== requestSessionId) {
                  console.log(`[Storage] ❌ Write blocked for ${requestSessionId?.slice(0, 8) || 'unknown'}... (owner: ${activeSession.sessionId.slice(0, 8)}...)`);
                  res.statusCode = 403;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    error: 'SESSION_LOCKED',
                    message: 'Another session owns the write lock',
                    ownerId: activeSession.sessionId
                  }));
                  return;
                }

                fs.writeFileSync(dbPath, body);
                console.log(`[Storage] ✅ Saved by ${requestSessionId?.slice(0, 8) || 'unknown'}...`);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
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
