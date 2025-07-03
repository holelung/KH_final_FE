import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 💡 Spring Boot 서버 주소
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
