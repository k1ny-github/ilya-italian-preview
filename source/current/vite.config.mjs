import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({plugins:[react()],"base": "/ilya-italian-preview/", "build": {"outDir": "dist/client", "rollupOptions": {"input": ["index.html", "miro-shell-review.html", "miro-shell-review-frame.html"]}}});
