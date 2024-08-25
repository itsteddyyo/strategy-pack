import { HomeAssistant, LovelaceCardConfig, LovelaceViewConfig } from "custom-card-helpers"

import { EntityRegistryEntry } from "./homeassistant/entity_registry";
import { createRowFilter } from "./util/filter";
import { CUSTOM_ELEMENT_VIEW, ManualConfigObject, RowFilterConfig } from "./util/types";

interface LogPreset extends RowFilterConfig {
    title: string;
    icon: string;
}

interface LogViewOptions {
    presets: Array<LogPreset>
}

class LogViewStrategy extends HTMLTemplateElement {
    static async generate(viewConfig: ManualConfigObject<"custom:log-view-strategy", LogViewOptions>, hass: HomeAssistant): Promise<LovelaceViewConfig & { type: "masonry" | "panel" | "sidebar"; }> {
        const { config: userConfig } = viewConfig;
        const config = {
            ...userConfig
        };
        const { presets } = config;

        if (!presets) throw Error("presets not defined!");

        const [entities] = await Promise.all([
            hass.callWS<Array<EntityRegistryEntry>>({ type: "config/entity_registry/list" }),
        ]);

        const verticalStack: LovelaceCardConfig = {
            type: "vertical-stack",
            cards: [],
            view_layout: {
                position: "sidebar"
            }
        };

        const presetButtons = presets.reduce((horizontalCard, preset) => {
            horizontalCard.cards.push({
                type: "button",
                name: preset.title,
                icon: preset.icon,
                tap_action: {
                    action: "navigate",
                    navigation_path: window.location.pathname + "#" + encodeURI(preset.title)
                }
            });
            return horizontalCard;
        }, verticalStack);

        const map = presets.reduce((presetMap, preset) => {
            const filteredEntities = entities.filter(createRowFilter(preset, hass));
            const logbookCard: LovelaceCardConfig = {
                type: "logbook",
                title: preset.title,
                entities: filteredEntities.map(ent => ent.entity_id)
            }
            const stackCard: LovelaceCardConfig = {
                type: "vertical-stack",
                cards: [logbookCard]
            }

            presetMap.set(encodeURI(preset.title), stackCard);
            return presetMap;
        }, new Map<string, LovelaceCardConfig>())


        return {
            type: "sidebar",
            cards: [
                {
                    type: "custom:state-switch",
                    entity: "hash",
                    default: map.keys().next().value,
                    states: Object.fromEntries(map.entries())
                },
                presetButtons
            ]
        };
    }
}

customElements.define(`${CUSTOM_ELEMENT_VIEW}log-view-strategy`, LogViewStrategy);
