import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import visualizer from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [react(), visualizer({ open: true, filename: 'stats.html' })],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      }
    }
  },
  build: {
    minify: 'terser',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    cssCodeSplit: true,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['redux', 'react-redux'],
          'vendor-icons': ['react-icons'],
          'vendor-utils': ['axios', 'react-hot-toast']
        }
      }
    },
    target: 'es2022'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux', 'axios', 'react-hot-toast'],
    exclude: ['react-icons/fa6']
  }
})

