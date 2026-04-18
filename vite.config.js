import path from "path";
import {defineConfig} from "vite";

import ViteYaml from "@modyfi/vite-plugin-yaml";
import UnpluginTypia from "@typia/unplugin/vite";

export default defineConfig({
    plugins: [ViteYaml(), UnpluginTypia()],
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "strategy-pack",
            fileName: (format) => `strategy-pack.${format}.js`,
        },
    },
});
