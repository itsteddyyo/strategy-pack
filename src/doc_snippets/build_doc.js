import fs from "fs";
import { Liquid } from "liquidjs";

const engine = new Liquid();

engine.registerFilter("ternary", (value, truthyValue, falsyValue) => {
    return !!value ? truthyValue : falsyValue;
});

const jsonContent = fs.readFileSync("docs/typedoc.json", "utf-8");
const typedoc = JSON.parse(jsonContent);

createMarkdown({
    file: "documentation/markdown/area/configuration2.md",
    parts: [
        { markdown: "src/doc_snippets/area/configuration.md", doc: "area-strategy.ts" },
        { markdown: "src/doc_snippets/area/tab.md", doc: "area-strategy.ts" },
        { markdown: "src/doc_snippets/common/rows.md", doc: "area-strategy.ts" },
        { markdown: "src/doc_snippets/common/filter.md", doc: "types.ts" },
    ],
});

function createMarkdown(config) {
    const markdown = config.parts.reduce(async (prev, curr) => {
        const text = fs.readFileSync(curr.markdown, "utf8");
        const context = getMergedDocumentationForFile(typedoc, curr.doc);
        const resolved = await engine.parseAndRender(text, context);
        const prevResolved = await prev;
        return [prevResolved, resolved].join("\r\n");
    }, Promise.resolve(""));

    markdown.then((ret) => fs.writeFileSync(config.file, ret));
}

function getMergedDocumentationForFile(json, fileName) {
    const mergedDocs = {};

    // Recursive function to traverse and collect documentation
    function collectDocs(node) {
        if (node.sources?.some((source) => source.fileName.endsWith(fileName))) {
            const doc = [];

            // Collect own properties
            if (node.children) {
                node.children.forEach((child) => {
                    if (child.kind === 1024 && !!child?.comment) {
                        // Property with documentation
                        doc.push({
                            annotations: child.comment.blockTags.map((tag) => ({
                                tag: tag.tag,
                                content: tag.content
                                    .map((content) => content.text.replace("```ts", "").replace("```yaml", "").replace("```", ""))
                                    .join("\r\n"),
                            })),
                            flags: child.flags,
                            type: child.type,
                            name: child.name,
                        });
                    }
                });
            }

            // Merge documentation from extended types
            if (node.extendedTypes) {
                node.extendedTypes.forEach((extendedType) => {
                    const baseNode = findNodeByName(json, extendedType.name);
                    if (baseNode) {
                        doc.push(...(collectDocs(baseNode) || []));
                    }
                });
            }

            mergedDocs[node.name] = doc;
        }

        // Recurse into children
        if (node.children) {
            node.children.forEach(collectDocs);
        }
    }

    // Recursive function to find a node by name
    function findNodeByName(node, name) {
        if (node.name === name) return node;
        if (node.children) {
            for (const child of node.children) {
                const found = findNodeByName(child, name);
                if (found) return found;
            }
        }
        return null;
    }

    // Start processing from the root node
    collectDocs(json);

    return mergedDocs;
}
