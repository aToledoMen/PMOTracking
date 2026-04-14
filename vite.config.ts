import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Plugin to remove type="module" from script tags for Domo compatibility
function domoHtmlPlugin(): Plugin {
  return {
    name: 'domo-html-transform',
    transformIndexHtml(html) {
      // Remove type="module" and crossorigin, move script to end of body
      const scriptMatch = html.match(/<script[^>]*src="[^"]*"[^>]*><\/script>/);
      if (scriptMatch) {
        html = html.replace(scriptMatch[0], '');
        const cleanScript = scriptMatch[0].replace(/ type="module"/g, '').replace(/ crossorigin/g, '');
        html = html.replace('</body>', `  ${cleanScript}\n  </body>`);
      }
      return html;
    },
  }
}

// Vite plugin to set up Domo Ryuu proxy middleware
function domoProxyPlugin(): Plugin {
  return {
    name: 'domo-ryuu-proxy',
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          try {
            // Dynamically import to handle potential errors gracefully
            const { getProxyMiddleware } = await import('./proxy-setup.js')
            const proxyMiddleware = getProxyMiddleware()
            
            // Use the proxy middleware
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            proxyMiddleware(req as any, res as any, next)
          } catch (error) {
            // If proxy setup fails, continue without it
            console.warn('⚠️  Domo proxy not available:', error instanceof Error ? error.message : error)
            console.warn('Make sure you have:')
            console.warn('  1. public/manifest.json with valid configuration')
            console.warn('  2. Run "domo login" to authenticate')
            next()
          }
        })
      }
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    domoProxyPlugin(),
    domoHtmlPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // The proxy middleware is configured via the domoProxyPlugin above
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
  },
  base: './',
})
