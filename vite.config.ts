import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    host: true,
    proxy: {
      "/api/pmu": {
        target: "https://offline.turfinfo.api.pmu.fr",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => {
          const raw = String(path || "");
          const q = raw.indexOf("?");
          const query = q >= 0 ? raw.slice(q + 1) : "";
          const params = new URLSearchParams(query);
          const clean = String(params.get("path") || "").replace(/^\/+/, "");
          if (!/^\d{8}(?:\/R\d+\/C\d+\/[a-z0-9-]+)?$/i.test(clean)) {
            return "/rest/client/7/programme/";
          }
          return "/rest/client/7/programme/" + clean;
        },
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets",
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: "es",
        inlineDynamicImports: true,
        entryFileNames: "assets/index.js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
