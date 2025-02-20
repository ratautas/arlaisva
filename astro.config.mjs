import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  markdown: {
    shikiConfig: {
      theme: 'dracula',
      wrap: true
    },
    legacy: {
      collections: true,
      slug: true,
    }
  }
});