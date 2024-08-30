import path from "path";
import { defineConfig } from "vite";

import ViteYaml from "@modyfi/vite-plugin-yaml";

export default defineConfig({
    plugins: [ViteYaml()],
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "strategy-pack",
            fileName: (format) => `strategy-pack.${format}.js`,
        },
    },
});
