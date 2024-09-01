import fs from "fs";
import { Liquid } from "liquidjs";
import { stringify, parse } from "yaml";

const engine = new Liquid();

engine.registerFilter("ternary", (value, truthyValue, falsyValue) => {
    return !!value ? truthyValue : falsyValue;
});

engine.registerFilter("toYAML", (value) => {
    return stringify(value);
});

const jsonContent = fs.readFileSync("docs/typedoc.json", "utf-8");
const typedoc = JSON.parse(jsonContent);

const example = (type, strategyName) => {
    const ret = type.reduce((prev, curr) => {
        const example = curr.annotations.find((ann) => ann.tag == "@example");
        const parsedExample = parse(example.content);
        prev.set(curr.name, parsedExample[curr.name]);
        return prev;
    }, new Map());
    if (!!strategyName && strategyName.includes("-view-")) {
        return {
            strategy: { type: "custom:" + strategyName, config: Object.fromEntries(ret.entries()) },
            icon: "mdi:test",
            path: "test",
            title: "Test",
        };
    }
    if (!!strategyName && strategyName.includes("-dashboard-")) {
        return { strategy: { type: "custom:" + strategyName, config: Object.fromEntries(ret.entries()) } };
    }
    return Object.fromEntries(ret.entries());
};

const filter = [
    { markdown: "src/doc_snippets/common/filter.md" },
    {
        markdown: "src/doc_snippets/common/table.md",
        ctx: { doc: "types.ts", resolver: (ctx) => ({ options: ctx.FilterConfig, disable: { default: true } }) },
    },
    {
        markdown: "src/doc_snippets/common/example.md",
        ctx: { doc: "types.ts", resolver: (ctx) => ({ example: example(ctx.FilterConfig) }) },
    },
    {
        text: `
#### Filter Type

These are the options for filter type.`,
    },
    {
        markdown: "src/doc_snippets/common/table.md",
        ctx: { doc: "types.ts", resolver: (ctx) => ({ options: ctx.FilterType, disable: { type: true, required: true, default: true } }) },
    },
    {
        text: `
#### Filter Comparator

These are the options for filter comparator.`,
    },
    {
        markdown: "src/doc_snippets/common/table.md",
        ctx: { doc: "types.ts", resolver: (ctx) => ({ options: ctx.Comparator, disable: { type: true, required: true, default: true } }) },
    },
];

createMarkdown({
    file: "documentation/markdown/area/CONFIGURATION.md",
    parts: [
        {
            text: `
# Configuration

## Configuration Options`,
        },
        {
            markdown: "src/doc_snippets/common/table.md",
            ctx: { doc: "area-strategy.ts", resolver: (ctx) => ({ options: ctx.AreaStrategyOptions }) },
        },
        {
            markdown: "src/doc_snippets/common/example.md",
            ctx: { doc: "area-strategy.ts", resolver: (ctx) => ({ example: example(ctx.AreaStrategyOptions, "area-dashboard-strategy") }) },
        },
        { text: "More on the default configuration [here](#default-config-explained)" },
        { markdown: "src/doc_snippets/area/tab.md" },
        {
            markdown: "src/doc_snippets/common/table.md",
            ctx: { doc: "area-strategy.ts", resolver: (ctx) => ({ options: ctx.TabConfig, disable: { default: true } }) },
        },
        {
            markdown: "src/doc_snippets/common/example.md",
            ctx: { doc: "area-strategy.ts", resolver: (ctx) => ({ example: example(ctx.TabConfig) }) },
        },
        { markdown: "src/doc_snippets/common/rows.md" },
        {
            markdown: "src/doc_snippets/common/table.md",
            ctx: { doc: "area-strategy.ts", resolver: (ctx) => ({ options: ctx.RowConfig, disable: { default: true } }) },
        },
        {
            markdown: "src/doc_snippets/common/example.md",
            ctx: { doc: "area-strategy.ts", resolver: (ctx) => ({ example: example(ctx.RowConfig) }) },
        },
        ...filter,
        { markdown: "src/doc_snippets/area/default-config.md" },
    ],
});

createMarkdown({
    file: "documentation/markdown/battery/CONFIGURATION.md",
    parts: [
        {
            text: `
# Configuration

## Configuration Options`,
        },
        {
            markdown: "src/doc_snippets/common/table.md",
            ctx: { doc: "battery-view-strategy.ts", resolver: (ctx) => ({ options: ctx.BatteryViewOptions }) },
        },
        {
            markdown: "src/doc_snippets/common/example.md",
            ctx: { doc: "battery-view-strategy.ts", resolver: (ctx) => ({ example: example(ctx.BatteryViewOptions, "battery-view-strategy") }) },
        },
        { markdown: "src/doc_snippets/battery/default-config.md" },
    ],
});

createMarkdown({
    file: "documentation/markdown/update/CONFIGURATION.md",
    parts: [
        {
            text: `
# Configuration

## Configuration Options`,
        },
        {
            markdown: "src/doc_snippets/common/table.md",
            ctx: { doc: "update-view-strategy.ts", resolver: (ctx) => ({ options: ctx.UpdateViewOptions }) },
        },
        {
            markdown: "src/doc_snippets/common/example.md",
            ctx: { doc: "update-view-strategy.ts", resolver: (ctx) => ({ example: example(ctx.UpdateViewOptions, "update-view-strategy") }) },
        },
        { markdown: "src/doc_snippets/update/default-config.md" },
    ],
});

function createMarkdown(config) {
    const markdown = config.parts.reduce(async (prev, curr) => {
        let text = "";
        if (curr.markdown) {
            text = fs.readFileSync(curr.markdown, "utf8").trim();
        }
        if (curr.text) {
            text = curr.text.trim();
        }
        const context = !!curr.ctx ? curr.ctx.resolver(getMergedDocumentationForFile(typedoc, curr.ctx.doc)) : {};
        const resolved = await engine.parseAndRender(text, context);
        const prevResolved = await prev;
        return [prevResolved, resolved].join("\r\n\r\n");
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
