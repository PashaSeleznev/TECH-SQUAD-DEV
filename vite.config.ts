import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL

  return {
    plugins: [react()],
    server: {
      proxy: {
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
