import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  console.log(env)

  return {
    server: {
      proxy: {
        [env.VITE_API_PREFIX]: {
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
        "@src": path.resolve(__dirname, "./src"),
        "@tests": path.resolve(__dirname, "./tests"),
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
