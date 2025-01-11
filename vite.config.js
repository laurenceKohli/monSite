import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {

  const config = {
    base: '/',
    plugins: [
      vue()
    ],
    server: {
      proxy : {
        '/api': {
          //target: 'https://cobex-uu6t.onrender.com',
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    }
  };

  return config;
});