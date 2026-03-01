import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: { host: "::", port: 8080, hmr: { overlay: false } },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt"],
      manifest: {
        name: "CogniBiome — Diet→Microbiome→Cognition Simulator",
        short_name: "CogniBiome",
        description: "Offline-first deterministic simulator for modeling diet-driven microbiome and neurotransmitter pathways.",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "favicon.ico", sizes: "64x64 32x32 24x24 16x16", type: "image/x-icon" },
        ],
      },
      workbox: {
        // Cache all JS, CSS, HTML, JSON, CSV files
        globPatterns: ["**/*.{js,css,html,json,csv,txt,md,ico,svg}"],
        // Don't cache the bundle doc itself (large)
        globIgnores: ["**/COGNIBIOME_SINGLE_UPLOAD_BUNDLE.md"],
        runtimeCaching: [
          {
            // Cache all static assets served from same origin
            urlPattern: /^\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "cognibiome-assets",
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 days
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
}));
