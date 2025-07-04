import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@services": resolve(__dirname, "src/services"),
      "@stores": resolve(__dirname, "src/stores"),
      "@utils": resolve(__dirname, "src/utils"),
      "@types": resolve(__dirname, "src/types"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://licitei-backend-56315dca6f6b.herokuapp.com",
        changeOrigin: true,
      },
    },
  },
})
