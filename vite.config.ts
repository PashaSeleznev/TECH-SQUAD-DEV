import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL

  return {
    plugins: [react()],
    server: {
      proxy: {
        // '/users': 'https://yummy-ghosts-trade.loca.lt',
        // '/upload': 'https://yummy-ghosts-trade.loca.lt',
        // '/images': 'https://yummy-ghosts-trade.loca.lt',

        // '/users': 'http://localhost:8000',
        // '/upload': 'http://localhost:8000',
        // '/images': 'http://localhost:8000',
        // '/defects': 'http://localhost:8000',
        // '/replace-image': 'http://localhost:8000',
        // '/reports': 'http://localhost:8000',

        '/users': `${apiUrl}`,
        '/upload': `${apiUrl}`,
        '/images': `${apiUrl}`,
        '/defects': `${apiUrl}`,
        '/replace-image': `${apiUrl}`,
        '/reports': `${apiUrl}`,
      }
    }
  }
})
