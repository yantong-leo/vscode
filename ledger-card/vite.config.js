import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["xlsx"], // 確保 Vite 預處理 xlsx
  },
});
