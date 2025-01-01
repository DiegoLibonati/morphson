import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

import { resolve } from "path";

import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

const root = resolve(__dirname);

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      proxy: {
        "/api/v1": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
      port: 5173,
      watch: {
        usePolling: true,
      },
    },
    resolve: {
      alias: {
        "@/src": resolve(root, "src"),
      },
    },
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    },
    plugins: [react()],
  };
});
