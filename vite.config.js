import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env so that server-side variables like DEEPSEEK_API_KEY are available
  // to the API handlers during local development and preview.
  // (In production these are provided by Vercel's environment.)
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of Object.keys(env)) {
    if (!key.startsWith('VITE_') && process.env[key] === undefined) {
      process.env[key] = env[key]
    }
  }

  return {
    plugins: [react(), localApiPlugin()],
    optimizeDeps: {
      // lottie-react imports lottie-web as a default import, but lottie-web's
      // ESM has no default export. Force-bundle both so Vite/esbuild produces
      // a proper CJS↔ESM interop shim. The component is imported via a
      // namespace+inner-default workaround in PrivacySection.jsx.
      include: ['lottie-react', 'lottie-web'],
    },
    build: {
      // Split heavy vendors out of the main app chunk so the initial
      // payload stays small and big libraries (three.js, framer-motion,
      // lottie-web) load in parallel / on demand.
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined
            if (id.includes('three') || id.includes('@react-three')) return 'vendor-three'
            if (id.includes('lottie-')) return 'vendor-lottie'
            if (id.includes('motion') || id.includes('framer-motion')) return 'vendor-motion'
            if (id.includes('gsap')) return 'vendor-gsap'
            if (id.includes('react-router')) return 'vendor-router'
            if (id.includes('lucide-react')) return 'vendor-icons'
            return undefined
          },
        },
      },
      chunkSizeWarningLimit: 800,
    },
  }
})

function localApiPlugin() {
  const endpoints = new Set(['/api/ai-search', '/api/enquiries', '/api/admin', '/api/site-settings'])
  function configure(server) {
    server.middlewares.use(async (req, res, next) => {
      const endpoint = req.url?.split('?')[0]
      if (!endpoints.has(endpoint)) return next()
      try {
        const handlerPath = path.resolve(server.config.root, `.${endpoint}.js`)
        const { default: handler } = await import(pathToFileURL(handlerPath).href)
        await handler(req, res)
      } catch (error) {
        console.error('[local site API]', endpoint, error.code ?? error.name)
        if (!res.headersSent) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'The request could not be completed. Please try again.' }))
        } else if (!res.writableEnded) {
          res.end()
        }
      }
    })
  }

  return {
    name: 'mwft-local-api',
    configureServer: configure,
    configurePreviewServer: configure,
  }
}
