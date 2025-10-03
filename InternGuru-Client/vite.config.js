import { defineConfig } from "vite";
import path from "path"
import tailwindcss from "tailwindcss"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://todo-backend-two-chi.vercel.app/api", 
        changeOrigin: true,
        secure: true, 
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
  define: {
    "process.env": {},
  },
});


