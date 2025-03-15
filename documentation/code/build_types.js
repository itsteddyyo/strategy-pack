import fs from "fs";
import { parse } from "yaml";

const areaFile = fs.readFileSync("src/config/areaDefaultConfig.yml", "utf-8");
const gridFile = fs.readFileSync("src/config/gridDefaultConfig.yml", "utf-8");
const typedocFile = fs.readFileSync(".typedoc/typedoc.json", "utf-8");

const area = parse(areaFile, { merge: true });
const grid = parse(gridFile, { merge: true });
const typedoc = JSON.parse(typedocFile);

const json = Object.values(typedoc.files.entries).reduce((prev, curr) => {
    prev[curr] = getMergedDocumentationForFile(typedoc, curr);
    return prev;
}, {});

fs.writeFileSync("documentation/_data/area.json", JSON.stringify(area), { flag: "wx" });
fs.writeFileSync("documentation/_data/grid.json", JSON.stringify(grid), { flag: "wx" });
fs.writeFileSync("documentation/_data/types.json", JSON.stringify(json), { flag: "wx" });

function getMergedDocumentationForFile(json, fileName) {
    const mergedDocs = {};

    // Recursive function to traverse and collect documentation
    function collectDocs(node) {
        if (node.sources?.some((source) => source.fileName.endsWith(fileName))) {
            const doc = [];

            // Collect own properties
            if (node.children) {
                node.children.forEach((child) => {
                    switch (node.kind) {
                        //enums
                        case 8:
                            if (child.kind === 16 && !!child?.comment) {
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
                            break;
                        //interfaces and other
                        default:
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
                            break;
                    }
                });
            }

            // Merge documentation from extended types in interfaces
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
