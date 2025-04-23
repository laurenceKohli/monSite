import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {

  const config = {
    base: '/',
    plugins: [
      tailwindcss(),
      vue()
    ],
    server: {
      proxy : {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    }
  };

  return config;
});