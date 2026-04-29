import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// 跨平台路径处理：使用 path.resolve 兼容 Windows / macOS / Linux
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
});
