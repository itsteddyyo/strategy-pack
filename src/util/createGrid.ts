import { LovelaceCardConfig } from "custom-card-helpers";
import { EntityRegistryEntry } from "../homeassistant/entity_registry";
import { AreaStrategyCardConfig } from "./types";

export const createGrid = (entities: Array<EntityRegistryEntry>, cardConfig: AreaStrategyCardConfig, title?: string, replaceCards?: Record<string, AreaStrategyCardConfig>): Array<LovelaceCardConfig> => {
    const returnCards: Array<LovelaceCardConfig> = [];
    const gridCards: Array<LovelaceCardConfig> = [];

    entities.forEach(entity => {
        const entityCardConfig = {
            card: (replaceCards || {})[entity.entity_id]?.card || cardConfig.card,
            entityAttribute:
                (replaceCards || {})[entity.entity_id]?.entityAttribute ||
                cardConfig.entityAttribute,
            entityAttributeAsList:
                (replaceCards || {})[entity.entity_id]?.entityAttributeAsList ||
                cardConfig.entityAttributeAsList,
        };
        const resolvedCard = {
            ...entityCardConfig.card,
            ...Object.fromEntries([
                [
                    entityCardConfig.entityAttribute,
                    !!entityCardConfig.entityAttributeAsList
                        ? [entity.entity_id]
                        : entity.entity_id,
                ],
            ]),
        }
        gridCards.push(resolvedCard);
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
                "grid-template-columns": "repeat(auto-fit, minmax(150px, 1fr))",
                padding: "0px 10px",
            },
            cards: gridCards,
        })
    }
    return returnCards;
}