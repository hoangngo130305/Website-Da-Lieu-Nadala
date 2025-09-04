import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "tailwindcss";

import autoprefixer from "autoprefixer";

export default defineConfig({
  
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog"],
        },
      },
    },
    sourcemap: true,
    minify: "esbuild",
  },
  preview: {
    port: 4173,
    open: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./components"),
      "@/utils": path.resolve(__dirname, "./utils"),
      "@/contexts": path.resolve(__dirname, "./contexts"),
      "@/styles": path.resolve(__dirname, "./styles"),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
    devSourcemap: true,
  },

  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});
