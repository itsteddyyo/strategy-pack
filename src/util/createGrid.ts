import { LovelaceCardConfig } from "custom-card-helpers";
import { EntityRegistryEntry } from "../homeassistant/entity_registry";
import { GridStrategyCardConfig } from "./types";

export const createGrid = (entities: Array<EntityRegistryEntry>, cardConfig: GridStrategyCardConfig, minColumnWidth: number, title?: string, replaceCards?: Record<string, GridStrategyCardConfig>): Array<LovelaceCardConfig> => {
    const returnCards: Array<LovelaceCardConfig> = [];
    const gridCards: Array<LovelaceCardConfig> = [];

    entities.forEach(entity => {
        const card = (replaceCards || {})[entity.entity_id]?.card || cardConfig.card;
        const resolvedCard = Object.entries(card)
            .filter(([key, val]) => {
                const stringVal = JSON.stringify(val);
                return stringVal.includes("$entity");
            })
            .map(([key, val]) => {
                const stringVal = JSON.stringify(val);
                return [key, JSON.parse(stringVal.replace("$entity", entity.entity_id))]
            });
        gridCards.push({
            ...card,
            ...Object.fromEntries(resolvedCard)
        });
    })
    if (gridCards.length > 0) {
        if (title) {
            returnCards.push({
                type: "custom:mushroom-title-card",
                title: title,
                subtitle_tap_action: {
                    action: "none",
                },
            })
        }
        returnCards.push({
            type: "custom:layout-card",
            layout_type: "custom:grid-layout",
            layout: {
                "grid-template-rows": "auto",
                "grid-template-columns": `repeat(auto-fit, minmax(${minColumnWidth}px, 1fr))`,
                padding: "0px 10px",
            },
            cards: gridCards,
        })
    }
    return returnCards;
}