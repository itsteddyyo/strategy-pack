import { HomeAssistant, LovelaceCardConfig, LovelaceConfig, LovelaceViewConfig } from "custom-card-helpers";

import { EntityRegistryEntry } from "./homeassistant/entity_registry";
import { DeviceRegistryEntry } from "./homeassistant/device_registry";
import { AreaRegistryEntry } from "./homeassistant/area_registry";

import { createRowFilter, hiddenFilter } from "./util/filter";
import { labelSort, notNil } from "./util/helper";
import {
    CUSTOM_ELEMENT_DASHBOARD,
    CUSTOM_ELEMENT_VIEW,
    FilterType,
    Comparator,
    GridStrategyCardConfig,
    RowFilterConfig,
    UniversalStrategyOptions,
    ManualConfigObject,
} from "./util/types";

import defaultConfig from "./config/areaDefaultConfig.yml";
import { createGrid } from "./util/createGrid";
import { cloneDeep, mergeWith } from "lodash";

export interface RowConfig extends GridStrategyCardConfig, RowFilterConfig {
    /**
     * @description
     * Domain or Array of domains the entity must belong to.
     * @remarks
     * Is deprecated (will be removed in a future release) and will internally be converted to a <a href="#filter">include filter</a>
     * @example
     * ```yaml
     * domain: button
     * #or
     * domain:
     *   - button
     *   - media_player
     * ```
     */
    domain: string | Array<string>;
    /**
     * @description
     * Title shown over Grid. Will not be rendered when not set.
     * @example
     * ```yaml
     * title: Buttons
     * ```
     */
    title?: string;
}

export interface TabConfig {
    /**
     * @description
     * Title shown in the Tab
     * @example
     * ```yaml
     * title: Test
     * ```
     */
    text: string;
    /**
     * @description
     * Icon shown in the Tab
     * @example
     * ```yaml
     * icon: mdi:test
     * ```
     */
    icon: string;
    /**
     * @description
     * The grid rows definition of the tab. <a href="#contentrows">More</a>
     * @example
     * ```yaml
     * rows:
     *   - title: test
     *     domain: media_player
     *     ...
     *   - title: test2
     *     domain: sensor
     *     ...
     * ```
     */
    rows: Array<RowConfig>;
}

export interface AreaStrategyOptions extends UniversalStrategyOptions {
    /**
     * @description
     * Tabs shown in the main area. <a href="#tabs">More
     * @example
     * ```yaml
     * tabs:
     *   - label: Test
     *     icon: mdi:test
     *     rows: [...]
     * ```
     */
    tabs: Array<TabConfig>;
    /**
     * @description
     * Overlay Colors for navigation area. Must be in the form of a rgba css-value. rgb defines the color and the a-channel defines transparency.
     * @remarks
     * The colors get repeated when you have more areas than colors. Leave empty for no overlay.
     * @example
     * ```yaml
     * areaColors:
     *   - rgba(0,0,0,0.5)
     * ```
     */
    areaColors: Array<string>;
    /**
     * @description
     * The config for the area card.
     * @remarks
     * Options type, area, navigation_path are not allowed!
     * @example
     * ```yaml
     * areaCardConfig:
     *   aspect_ratio: 1:1
     * ```
     */
    areaCardConfig: Exclude<LovelaceCardConfig, "type">;
    /**
     * @description
     * Which areas should be ignored (no views generated/not shown in navigation)
     * @example
     * ```yaml
     * areaBlacklist:
     *   - living_room
     *   - bathroom
     * ```
     */
    areaBlacklist?: Array<string>;
    /**
     * @description
     * Slot for cards above navigation. <a href="#topCards">More</a>
     * @example
     * ```yaml
     * topCards:
     *   - type: entity
     *     entities:
     *       - button.test
     *       - button.test2
     * ```
     */
    topCards?: Array<LovelaceCardConfig>;
    /**
     * @description
     * You can pass any extra views you want on the dashboard.
     * @example
     * ```yaml
     * extraViews:
     *   - strategy:
     *       type: custom:battery-view-strategy
     *     icon: ...
     *     ...
     * ```
     */
    extraViews?: Array<LovelaceViewConfig>;
}

export interface AreaViewConfig extends ManualConfigObject<"custom:area-view-strategy", AreaStrategyOptions & { area: string }> {
    meta?: {
        devices: Array<DeviceRegistryEntry>;
        entities: Array<EntityRegistryEntry>;
        areas: Array<AreaRegistryEntry>;
    };
}

export interface HomeAssistantConfigAreaStrategyView extends LovelaceViewConfig {
    strategy: AreaViewConfig;
}

class AreaDashboardStrategy extends HTMLTemplateElement {
    static async generate(
        dashboardConfig: ManualConfigObject<"custom:area-dashboard-strategy", AreaStrategyOptions>,
        hass: HomeAssistant,
    ): Promise<LovelaceConfig> {
        const [entities, devices, areas] = await Promise.all([
            hass.callWS<Array<EntityRegistryEntry>>({ type: "config/entity_registry/list" }),
            hass.callWS<Array<DeviceRegistryEntry>>({ type: "config/device_registry/list" }),
            hass.callWS<Array<AreaRegistryEntry>>({ type: "config/area_registry/list" }),
        ]);

        const usedAreas = areas
            .filter((area) => {
                return !dashboardConfig.config?.areaBlacklist || dashboardConfig.config.areaBlacklist.indexOf(area.area_id) == -1;
            })
            .sort(labelSort);

        const areaViews: Array<HomeAssistantConfigAreaStrategyView> = usedAreas.map((area, index) => ({
            strategy: {
                type: "custom:area-view-strategy",
                meta: {
                    entities,
                    devices,
                    areas,
                },
                config: {
                    ...(defaultConfig as AreaStrategyOptions),
                    ...(dashboardConfig.config || {}),
                    area: area.area_id,
                },
            },
            title: area.name,
            path: area.area_id,
            icon: "mdi:home",
            type: "panel",
            subview: false,
            visible: index == 0,
        }));

        // Each view is based on a strategy so we delay rendering until it's opened
        return {
            views: [...areaViews, ...(dashboardConfig.config?.extraViews || [])],
        };
    }
}

class AreaViewStrategy extends HTMLTemplateElement {
    static async generate(viewConfig: AreaViewConfig, hass: HomeAssistant): Promise<LovelaceViewConfig> {
        const { config: preMergedConfig, meta } = viewConfig;
        const config = { ...(defaultConfig as AreaStrategyOptions), ...preMergedConfig };
        const { area, tabs, minColumnWidth, replaceCards, topCards, areaColors, areaCardConfig, areaBlacklist } = config;

        let entities = Array<EntityRegistryEntry>();
        let devices = Array<DeviceRegistryEntry>();
        let areas = Array<AreaRegistryEntry>();

        if (!!meta) {
            entities = meta.entities;
            devices = meta.devices;
            areas = meta.areas;
        } else {
            const loadedMeta = await Promise.all([
                hass.callWS<Array<EntityRegistryEntry>>({ type: "config/entity_registry/list" }),
                hass.callWS<Array<DeviceRegistryEntry>>({ type: "config/device_registry/list" }),
                hass.callWS<Array<AreaRegistryEntry>>({ type: "config/area_registry/list" }),
            ]);
            entities = loadedMeta[0];
            devices = loadedMeta[1];
            areas = loadedMeta[2];
        }

        entities = [...entities].sort(labelSort);
        devices = [...devices].sort(labelSort);
        areas = [...areas].sort(labelSort);

        const usedAreas = areas.filter((area) => {
            return !areaBlacklist || areaBlacklist.indexOf(area.area_id) == -1;
        });
        const currentArea = areas.find((a) => a.area_id == area);

        if (!currentArea) throw Error("No area defined");

        const areaDevices = new Set();
        for (const device of devices) {
            if (device.area_id === currentArea.area_id) {
                areaDevices.add(device.id);
            }
        }

        const gridTemplate: LovelaceCardConfig = {
            type: "vertical-stack",
            cards: [
                {
                    type: "custom:layout-card",
                    layout_type: "custom:grid-layout",
                    layout: {
                        "grid-template-rows": "auto",
                        "grid-template-columns": "repeat(auto-fit, minmax(300px, 1fr))",
                    },
                    cards: [],
                },
            ],
        };

        const navigationCard = usedAreas.reduce((prev, curr, index) => {
            const areaCard = {
                ...areaCardConfig,
                type: "area",
                area: curr.area_id,
                navigation_path: `${curr.area_id}#main`,
            };
            prev.cards[0].cards.push({
                type: "conditional",
                conditions: [
                    {
                        condition: "screen",
                        media_query: "(max-width: 1000px)",
                    },
                ],
                card: {
                    ...areaCard,
                    card_mod: {
                        style: `
                  hui-image {
                    opacity: 0.3;
                  }
                  div.navigate {
                    background-color: ${areaColors[index]};
                  }`,
                    },
                },
            });

            prev.cards[0].cards.push({
                type: "conditional",
                conditions: [
                    {
                        condition: "screen",
                        media_query: "(min-width: 1001px)",
                    },
                ],
                card:
                    curr.area_id == currentArea.area_id
                        ? areaCard
                        : {
                              ...areaCard,
                              card_mod: {
                                  style: `
                        hui-image {
                          opacity: 0.3;
                        }
                        div.navigate {
                          background-color: ${areaColors[index]};
                        }`,
                              },
                          },
            });

            return prev;
        }, gridTemplate);

        navigationCard.cards = [...(topCards || []), ...navigationCard.cards];

        const createTabElements = (tabRows: Array<RowConfig>) =>
            tabRows.reduce((prev, curr) => {
                //convert domain to include filter
                const domainIncludeFilter: Pick<RowConfig, "filter"> = {
                    filter: {
                        include: [
                            {
                                type: FilterType.domain,
                                comparator: Array.isArray(curr.domain) ? Comparator.in : Comparator.equal,
                                value: curr.domain,
                            },
                        ],
                    },
                };

                const merged = mergeWith(cloneDeep(curr), domainIncludeFilter, (objValue, srcValue) => {
                    if (Array.isArray(objValue)) {
                        return objValue.concat(srcValue);
                    }
                });

                let usedEntities = entities
                    .filter(hiddenFilter)
                    //in this area
                    .filter((entity) => {
                        return entity.area_id ? entity.area_id === currentArea.area_id : areaDevices.has(entity.device_id);
                    })
                    //entity in defined domain of row
                    .filter(createRowFilter(merged, hass));

                const gridCards = createGrid(usedEntities, merged, minColumnWidth, curr.title, replaceCards);
                prev.push(...gridCards);

                return prev;
            }, Array<LovelaceCardConfig>());

        const generatedTabs = tabs
            .map((tab) => {
                const tabElements = createTabElements(tab.rows);
                if (tabElements.length > 0) {
                    return {
                        attributes: {
                            label: tab.text,
                            icon: tab.icon,
                            stacked: true,
                        },
                        card: {
                            type: "vertical-stack",
                            cards: tabElements,
                        },
                    };
                } else {
                    return null;
                }
            })
            .filter(notNil);

        const mainCard: LovelaceCardConfig = {
            type: "custom:tabbed-card",
            styles: {
                "--mdc-tab-text-label-color-default": "var(--primary-text-color)",
                "--mdc-tab-color-default": "var(--primary-text-color)",
            },
            tabs: generatedTabs,
        };

        const homeCard: LovelaceCardConfig = {
            type: "vertical-stack",
            cards: [
                {
                    type: "conditional",
                    conditions: [
                        {
                            condition: "screen",
                            media_query: "(max-width: 1000px)",
                        },
                    ],
                    card: {
                        type: "custom:state-switch",
                        entity: "hash",
                        default: "default",
                        states: {
                            "": {
                                type: "vertical-stack",
                                cards: [
                                    navigationCard,
                                    {
                                        type: "custom:gap-card",
                                        height: 60,
                                    },
                                ],
                            },
                            default: {
                                type: "vertical-stack",
                                cards: [
                                    mainCard,
                                    {
                                        type: "custom:mushroom-chips-card",
                                        card_mod: {
                                            style: `
                        ha-card { --chip-background: none; }
                        :host {
                          --chip-icon-size: 1em !important;
                          z-index: 2;
                          width: 100%;
                          position: fixed;
                          bottom: 0;
                          margin: 0 !important;
                          padding: 20px;
                          background: var(--app-header-background-color);
                          left: 50%;
                          transform: translateX(-50%);
                        }
                        @media (min-width: 1001px) {
                          :host {
                            display: none;
                          }
                        }`,
                                        },
                                        chips: [
                                            { type: "spacer" },
                                            {
                                                type: "template",
                                                icon: "mdi:home",
                                                icon_height: "40px",
                                                tap_action: {
                                                    action: "navigate",
                                                    navigation_path: window.location.pathname,
                                                },
                                            },
                                            { type: "spacer" },
                                        ],
                                    },
                                    {
                                        type: "custom:gap-card",
                                        height: 60,
                                    },
                                ],
                            },
                        },
                    },
                },
                {
                    type: "conditional",
                    conditions: [
                        {
                            condition: "screen",
                            media_query: "(min-width: 1001px)",
                        },
                    ],
                    card: {
                        type: "custom:layout-card",
                        layout_type: "custom:grid-layout",
                        layout: {
                            "grid-template-columns": "2fr 3fr",
                            "grid-template-areas": "navigation main",
                        },
                        cards: [navigationCard, mainCard],
                    },
                },
            ],
        };

        return {
            panel: true,
            cards: [homeCard],
        };
    }
}

customElements.define(`${CUSTOM_ELEMENT_DASHBOARD}area-dashboard-strategy`, AreaDashboardStrategy);
customElements.define(`${CUSTOM_ELEMENT_VIEW}area-view-strategy`, AreaViewStrategy);
