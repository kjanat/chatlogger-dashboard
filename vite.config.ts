import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from "@cloudflare/vite-plugin";
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Load env variables
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [react(), cloudflare()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@/utils': path.resolve(__dirname, './src/react-app/utils'),
            },
        },
        server: {
            proxy: {
                // Handle both /api/v1 format (used internally) and environment variable format
                '/api/v1': {
                    target: 'http://localhost:3000',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api\/v1/, '/api'),
                },
            },
        },
        define: {
            'import.meta.env.API_URL': JSON.stringify(env.API_URL || '/api/v1'),
        },
    }
}) 
