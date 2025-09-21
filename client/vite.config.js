import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // proxy: {
    //   // Proxy /api requests to backend (assumes backend on port 5000)
    //   "/api": {
    //     target: "https://lms-2kts.onrender.com",
    //     changeOrigin: true,
    //     secure: false
    //   }
    // }
  }
});
