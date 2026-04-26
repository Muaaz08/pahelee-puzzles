import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { createRequire } from "node:module";
import path from "path";
import { componentTagger } from "lovable-tagger";

const require = createRequire(import.meta.url);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react-chessboard": require.resolve("react-chessboard/dist/index.esm.js"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  optimizeDeps: {
    exclude: ["react-chessboard"],
  },
  assetsInclude: [
    "**/*.png",
    "**/*.jpg",
    "**/*.jpeg",
    "**/*.gif",
    "**/*.svg",
    "**/*.webp",
    "**/*.avif",
    "**/*.mp4",
    "**/*.webm",
    "**/*.ogg",
    "**/*.mp3",
    "**/*.wav",
    "**/*.flac",
    "**/*.aac",
    "**/*.ico",
  ],
}));
