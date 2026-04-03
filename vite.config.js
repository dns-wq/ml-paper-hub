import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    base: mode === 'production' ? '/ml-paper-hub/' : '/',
    server: {
      proxy: {
        '/api/anthropic': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (env.VITE_ANTHROPIC_API_KEY) {
                proxyReq.setHeader('x-api-key', env.VITE_ANTHROPIC_API_KEY);
                proxyReq.setHeader('anthropic-version', '2023-06-01');
              }
            });
          },
        },
        '/api/arxiv': {
          target: 'https://export.arxiv.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/arxiv/, ''),
        },
        '/api/s2': {
          target: 'https://api.semanticscholar.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/s2/, ''),
        },
        '/api/openalex': {
          target: 'https://api.openalex.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/openalex/, ''),
        },
        '/api/dblp': {
          target: 'https://dblp.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/dblp/, ''),
        },
      },
    },
  };
});
