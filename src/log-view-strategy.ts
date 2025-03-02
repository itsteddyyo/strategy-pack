import { HomeAssistant, LovelaceCardConfig, LovelaceViewConfig } from "custom-card-helpers";

import { EntityRegistryEntry } from "./homeassistant/entity_registry";
import { createRowFilter } from "./util/filter";
import { CUSTOM_ELEMENT_VIEW, DeepPartial, ManualConfigObject, RowFilterConfig } from "./util/types";
import { notNil } from "./util/helper";
import typia from "typia";

export interface LogPreset extends RowFilterConfig {
    /**
     * @description
     * The title shown in the Preset Button and the Log Card
     * @example
     * ```yaml
     * title: Test
     * ```
     */
    title: string;
    /**
     * @description
     * The icon shown in the Preset Button
     * @example
     * ```yaml
     * icon: mdi:test
     * ```
     */
    icon: string;
}

export interface LogViewOptions {
    /**
     * @description
     * The presets for which there will be buttons which load the history of the specified (filtered) entities.
     * @example
     * ```yaml
     * presets:
     *   - icon: mdi:motion-sensor
     *     title: Occupancy
     *     filter:
     *       include:
     *         - type: entity
     *           comparator: match
     *           value: binary_sensor\..*_occupancy
     *   - icon: mdi:light-bulb
     *     title: Lights (but not Living Room)
     *     filter:
     *       include:
     *         - type: domain
     *           value:
     *       exclude:
     *         - type: area
     *           value: living_room
     * ```
     */
    presets: Array<LogPreset>;
}

export const mergeStrategyConfig = (...configs: Array<DeepPartial<LogViewOptions> | undefined>): LogViewOptions => {
    const localMerge = configs.filter(notNil).reduce((prev, curr) => {
        return { ...prev, ...curr };
    });

    if (!typia.is<LogViewOptions>(localMerge)) {
        const state = typia.validate<LogViewOptions>(localMerge);
        throw Error(state.success ? "Something went wrong. Check config." : JSON.stringify(state.errors));
    }

    return localMerge;
};

class LogViewStrategy extends HTMLTemplateElement {
    static async generate(
        viewConfig: ManualConfigObject<"custom:log-view-strategy", LogViewOptions>,
        hass: HomeAssistant,
    ): Promise<LovelaceViewConfig & { type: "masonry" | "panel" | "sidebar" }> {
        const { config: userConfig } = viewConfig;
        const config = {
            ...userConfig,
        };
        const { presets } = mergeStrategyConfig(config);

        if (!presets) throw Error("presets not defined!");

        const [entities] = await Promise.all([hass.callWS<Array<EntityRegistryEntry>>({ type: "config/entity_registry/list" })]);

        const verticalStack: LovelaceCardConfig = {
            type: "vertical-stack",
            cards: [],
            view_layout: {
                position: "sidebar",
            },
        };

        const presetButtons = presets.reduce((horizontalCard, preset) => {
            horizontalCard.cards.push({
                type: "button",
                name: preset.title,
                icon: preset.icon,
                tap_action: {
                    action: "navigate",
                    navigation_path: window.location.pathname + "#" + encodeURI(preset.title),
                },
            });
            return horizontalCard;
        }, verticalStack);

        const map = presets.reduce((presetMap, preset) => {
            const filteredEntities = entities.filter(createRowFilter(preset, hass));
            const logbookCard: LovelaceCardConfig = {
                type: "logbook",
                title: preset.title,
                entities: filteredEntities.map((ent) => ent.entity_id),
            };
            const stackCard: LovelaceCardConfig = {
                type: "vertical-stack",
                cards: [logbookCard],
            };

            presetMap.set(encodeURI(preset.title), stackCard);
            return presetMap;
        }, new Map<string, LovelaceCardConfig>());

        return {
            type: "sidebar",
            cards: [
                {
                    type: "custom:state-switch",
                    entity: "hash",
                    default: map.keys().next().value,
                    states: Object.fromEntries(map.entries()),
                },
                presetButtons,
            ],
        };
    }
}

customElements.define(`${CUSTOM_ELEMENT_VIEW}log-view-strategy`, LogViewStrategy);
