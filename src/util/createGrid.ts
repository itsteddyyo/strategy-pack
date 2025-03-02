import { LovelaceCardConfig } from "custom-card-helpers";
import { BaseGridOptions, BaseRowOptions, BaseRowRefOptions, DeepPartial, GridMergeStrategy } from "./types";
import { mergeWith } from "lodash";
import { arrayCustomizer, notNil } from "./helper";
import typia from "typia";

export const mergeConfig = (...conf: Array<DeepPartial<BaseGridOptions> | undefined>): Omit<BaseGridOptions<BaseRowOptions>, "global" | "gridMergeStrategy"> => {
    const configs = conf?.filter(notNil);
    const localMerge = configs.filter(notNil).reduce((prev, curr) => {
        return { ...prev, ...curr };
    });
    localMerge.global = configs
    .map((c) => c.global)
    .filter(notNil)
    .reduce((prev, curr) => {
        return { ...prev, ...curr };
    });
    
    //grids are tested later as global will be need to be merged in first
    if (!typia.is<Omit<BaseGridOptions, "grids">>(localMerge)) {
        const state = typia.validate<BaseGridOptions>(localMerge);
        throw Error(state.success ? "Something went wrong. Check config." : JSON.stringify(state.errors));
    } 

    const grids = localMerge.gridMergeStrategy == GridMergeStrategy.reset ? configs.map(c => c.grids).filter(notNil).slice(-1)[0] : configs.flatMap((c) => c.grids).filter(notNil);
    const resolvedGrids = grids.reduce(
        (prev, curr) => {
            if (typia.is<BaseRowRefOptions>(curr)) {
                if (!!prev[curr.gridId]) {
                    //@ts-expect-error
                    prev[curr.gridId] = {
                        ...prev[curr.gridId],
                        ...curr,
                    };
                } else {
                    throw Error(`gridId '${curr.gridId}' not defined`);
                }
            } else {
                const grid = mergeWith({}, localMerge.global, curr, arrayCustomizer);
                if (!typia.is<BaseRowOptions>(grid)) {
                    const state = typia.validate<BaseRowOptions>(grid);
                    throw Error(state.success ? "Something went wrong. Check config." : JSON.stringify(state.errors));
                } 
                prev[grid.id] = grid;
            }
            return prev;
        },
        {} as Record<string, BaseRowOptions>,
    );
    //@ts-expect-error
    localMerge.grids = Object.values(resolvedGrids).sort((a, b) => (a.position || 0) - (b.position || 0));

    if (!typia.is<BaseGridOptions<BaseRowOptions>>(localMerge)) {
        const state = typia.validate<BaseGridOptions<BaseRowOptions>>(localMerge);
        throw Error(state.success ? "Something went wrong. Check config." : JSON.stringify(state.errors));
    } 

    return localMerge;
}

export const createGrid = (
    gridConfig: BaseRowOptions,
    elements: Array<Record<string, any>>,
    replaceConf: { placeholder: string; key: string, replaces?: Array<[string, string]> } = { placeholder: "$entity", key: "entity_id" },
): Array<LovelaceCardConfig> => {
    const returnCards: Array<LovelaceCardConfig> = [];
    const gridCards: Array<LovelaceCardConfig> = [];
Object.entries
    elements.forEach((element, index) => {
        const card = (gridConfig.replace || {})[element[replaceConf.key]]?.card || gridConfig.card;
        const resolvedCard = Object.entries(card)
            .filter(([_key, val]) => {
                const stringVal = JSON.stringify(val);
                return stringVal.includes(replaceConf.placeholder) || stringVal.includes("$index");
            })
            .map(([key, val]) => {
                const stringVal = JSON.stringify(val);
                let newStringVal = stringVal.replace(replaceConf.placeholder, element[replaceConf.key]);
                newStringVal = newStringVal.replace("$index", index.toString());
                if(replaceConf.replaces) {
                    replaceConf.replaces.forEach(([key, val]) => {
                        newStringVal = newStringVal.replace(key, val);
                    })
                }
                return [key, JSON.parse(newStringVal)];
            });
        gridCards.push({
            type: "conditional",
            conditions: [],
            card: {
                ...card,
                ...Object.fromEntries(resolvedCard),
            },
        });
    });
    if (gridCards.length > 0) {
        if (gridConfig.title) {
            returnCards.push({
                type: "custom:mushroom-title-card",
                title: gridConfig.title,
                subtitle_tap_action: {
                    action: "none",
                },
            });
        }
        returnCards.push({
            type: "custom:layout-card",
            layout_type: "custom:grid-layout",
            layout: {
                "grid-template-rows": "auto",
                "grid-template-columns": `repeat(auto-fit, minmax(${gridConfig.minCardWidth}px, 1fr))`,
                padding: "0px 10px",
            },
            cards: gridCards,
        });
    }
    return returnCards;
};
