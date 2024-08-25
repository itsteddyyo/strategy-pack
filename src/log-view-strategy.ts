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
    static async generate(viewConfig: ManualConfigObject<"custom:log-view-strategy", LogViewOptions>, hass: HomeAssistant): Promise<LovelaceViewConfig> {
        const { config: userConfig } = viewConfig;
        const config = {
            ...userConfig
        };
        const { presets } = config;

        if (!presets) throw Error("presets not defined!");

        const [entities] = await Promise.all([
            hass.callWS<Array<EntityRegistryEntry>>({ type: "config/entity_registry/list" }),
        ]);

        const presetsButtons: Array<LovelaceCardConfig> = presets.map((preset) => {
            return {
                type: "button",
                name: preset.title,
                icon: preset.icon,
                tap_action: {
                    action: "navigate",
                    navigation_path: window.location.pathname + "#" + encodeURI(preset.title)
                }
            }
        });

        const map = presets.reduce((presetMap, preset) => {
            const filteredEntities = entities.filter(createRowFilter(preset, hass));
            const logbookCard: LovelaceCardConfig = {
                type: "logbook",
                title: preset.title,
                entities: filteredEntities.map(ent => ent.entity_id)
            }
            const stackCard: LovelaceCardConfig = {
                type: "vertical-stack",
                cards: [...presetsButtons, logbookCard]
            }

            presetMap.set(encodeURI(preset.title), stackCard);
            return presetMap;
        }, new Map<string, LovelaceCardConfig>())


        return {
            panel: true,
            cards: [
                {
                    type: "custom:state-switch",
                    entity: "hash",
                    default: map.keys().next().value,
                    states: Object.fromEntries(map.entries())
                }
            ]
        };
    }
}

customElements.define(`${CUSTOM_ELEMENT_VIEW}log-view-strategy`, LogViewStrategy);
