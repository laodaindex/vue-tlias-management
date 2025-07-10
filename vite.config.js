import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    // 定义Vue 3特性标志解决警告
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
    // 启用选项API支持（如果使用Composition API可忽略）
    __VUE_OPTIONS_API__: true,
    // 禁用生产环境的devtools
    __VUE_PROD_DEVTOOLS__: false
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})