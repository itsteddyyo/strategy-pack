import { HomeAssistant, LovelaceViewConfig } from "custom-card-helpers";

import { EntityRegistryEntry } from "./homeassistant/entity_registry";
import { createRowFilter } from "./util/filter";
import { CUSTOM_ELEMENT_VIEW, GridStrategyCardConfig, GridViewConfig, BaseGridOptions, RowFilterConfig, FilterType, Comparator } from "./util/types";
import { createGrid } from "./util/createGrid";
import defaultConfig from "./config/gridDefaultConfig.yml";
import { mergeWith } from "lodash";
import { arrayCustomizer } from "./util/helper";

export interface BatteryViewOptions extends BaseGridOptions {
    /**
     * @description
     * Platforms (= integrations) for which the strategy should generate rows
     * @defaultValue
     * Zigbee, Switchbot, Other (always present everything that is not defined in platforms!)
     * @remarks
     * You need the internal HA id of the integration. <a href="https://community.home-assistant.io/t/how-to-get-an-integration-name-for-an-entity/447635" target="_blank">Here</a> is described how to obtain it
     * @example
     * ```yaml
     * platforms:
     *   - platform: hacs
     *     title: HACS
     *   - platform: MQTT
     *     title: Everything MQTT
     * ```
     */
    platforms: Array<{ platform: string; title: string }>;
}

class BatteryViewStrategy extends HTMLTemplateElement {
    static async generate(
        viewConfig: GridViewConfig<"custom:battery-view-strategy", BatteryViewOptions>,
        hass: HomeAssistant,
    ): Promise<LovelaceViewConfig> {
        const { config: userConfig } = viewConfig;
        const config = {
            platforms: [
                { platform: "mqtt", title: "Zigbee" },
                { platform: "switchbot", title: "Switchbot" },
            ],
            ...(defaultConfig as BaseGridOptions),
            ...userConfig,
        };
        const { minColumnWidth, replaceCards, platforms } = config;

        const [entities] = await Promise.all([hass.callWS<Array<EntityRegistryEntry>>({ type: "config/entity_registry/list" })]);

        const batteryCardConfig: GridStrategyCardConfig = {
            card: {
                type: "custom:mini-graph-card",
                entities: ["$entity"],
                align_header: "left",
                align_icon: "left",
                align_state: "center",
                font_size: 50,
                font_size_header: 12,
                lower_bound: 0,
                upper_bound: 100,
                card_mod: {
                    style: `
              .header {
                max-width: 80%;
              }
              .line--rect,
              .fill--rect,
              .line--points {
                fill: amber;
                stroke: amber;
              }`,
                },
            },
        };

        const baseFilter: RowFilterConfig = {
            filter: {
                include: [
                    { type: FilterType.domain, value: "sensor" },
                    { type: FilterType.attribute, value: { key: "device_class", value: "battery" } },
                ],
                exclude: [
                    { type: FilterType.disabled_by, comparator: Comparator.match, value: ".*" },
                    { type: FilterType.hidden_by, comparator: Comparator.match, value: ".*" },
                ],
            },
        };

        const otherFilter: RowFilterConfig = mergeWith<unknown, RowFilterConfig, RowFilterConfig>(
            {},
            baseFilter,
            {
                filter: {
                    exclude: [{ type: FilterType.integration, comparator: Comparator.in, value: platforms.map((platform) => platform.platform) }],
                },
            },
            arrayCustomizer,
        );

        const stackCards = platforms.reduce(
            (prev, curr) => {
                const platformFilter: RowFilterConfig = {
                    filter: {
                        include: [{ type: FilterType.integration, value: curr.platform }],
                    },
                };
                const filterConfig = mergeWith({}, baseFilter, platformFilter, arrayCustomizer);
                const rowEntities = entities.filter(createRowFilter(filterConfig, hass));
                prev.push(...createGrid(rowEntities, batteryCardConfig, minColumnWidth, curr.title, replaceCards));
                return prev;
            },
            createGrid(entities.filter(createRowFilter(otherFilter, hass)), batteryCardConfig, minColumnWidth, "Other", replaceCards),
        );

        return {
            panel: true,
            cards: [
                {
                    type: "vertical-stack",
                    cards: stackCards,
                },
            ],
        };
    }
}

customElements.define(`${CUSTOM_ELEMENT_VIEW}battery-view-strategy`, BatteryViewStrategy);
