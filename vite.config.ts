import { fileURLToPath, URL } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { siteConfig } from "./src/config/siteConfig.ts";

/**
 * Injeta os dados de SEO do siteConfig no index.html em tempo de build,
 * para que título, descrição e Open Graph fiquem no HTML estático (visível para buscadores e redes sociais).
 */
function siteMeta(): Plugin {
  const siteUrl = siteConfig.url.replace(/\/+$/, "");
  const values: Record<string, string> = {
    SITE_URL: siteUrl,
    SITE_NAME: siteConfig.name,
    SEO_TITLE: siteConfig.seo.title,
    SEO_DESCRIPTION: siteConfig.seo.description,
    SEO_KEYWORDS: siteConfig.seo.keywords.join(", "),
    OG_IMAGE: `${siteUrl}/og-image.jpg`,
    THEME_COLOR: "#020203",
  };
  const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  return {
    name: "cidadela-site-meta",
    transformIndexHtml(html) {
      return html.replace(/\{\{(\w+)\}\}/g, (match, key: string) => (key in values ? escape(values[key]) : match));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteMeta()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-dom/client", "framer-motion", "lucide-react", "react-icons/si"],
  },
  build: {
    target: "es2022",
    cssMinify: true,
    assetsInlineLimit: 2048,
  },
});
