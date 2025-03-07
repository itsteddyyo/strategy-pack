import { HomeAssistant, LovelaceCardConfig, LovelaceConfig, LovelaceViewConfig } from "custom-card-helpers";

import { EntityRegistryEntry } from "./homeassistant/entity_registry";
import { AreaRegistryEntry } from "./homeassistant/area_registry";

import { createRowFilter, createRowSort } from "./util/filter";
import { arrayCustomizer, notNil } from "./util/helper";
import {
    CUSTOM_ELEMENT_DASHBOARD,
    CUSTOM_ELEMENT_VIEW,
    ValueType,
    BaseGridOptions,
    ManualConfigObject,
    BaseRowOptions,
    DeepPartial,
} from "./util/types";

import defaultConfig from "./config/areaDefaultConfig.yml";
import { createGrid, mergeConfig } from "./util/createGrid";
import { cloneDeep, mergeWith } from "lodash";
import typia from "typia";

export interface TabConfig {
    /**
     * @description
     * Title shown in the Tab
     * @example
     * ```yaml
     * title: Test
     * ```
     */
    title: string;
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
     * Which grids should be shown in the tab. Match the id of the grid.
     * @example
     * ```yaml
     * match: ^control_.*$
     * ```
     */
    match: string;
}

export interface AreaStrategyOptions extends BaseGridOptions {
    /**
     * @description
     * Tabs shown in the main area. <a href="#tabs" target="_blank">More</a>
     * @defaultValue
     * <a href="https://github.com/itsteddyyo/strategy-pack/blob/main/src/config/areaDefaultConfig.yml#L2" target="_blank">set</a>
     * @remarks
     * You can also reference tab entries from the <a href="https://github.com/itsteddyyo/strategy-pack/blob/main/src/config/areaDefaultConfig.yml" target="_blank">default config</a> by just writing '~' + title of tab.
     * With that you can easily change a single tab while just referencing the other without the need to copy the whole config. Example: - ~Stats instead of whole config
     * @example
     * ```yaml
     * tabs:
     *   - label: Test
     *     icon: mdi:test
     *     rows: #Row Config here
     *   - ~Camera
     *   - ~Stats
     * ```
     */
    main: Array<TabConfig>;
    /**
     * @description
     * The config for the area card.
     * @defaultValue
     * <a href="https://github.com/itsteddyyo/strategy-pack/blob/main/src/config/areaDefaultConfig.yml#L246" target="_blank">set</a>
     * @remarks
     * Options type, area, navigation_path are not allowed!
     * @example
     * ```yaml
     * areaCardConfig:
     *   aspect_ratio: 1:1
     * ```
     */
    navigation: BaseRowOptions;
    /**
     * @description
     * Slot for cards above navigation. <a href="#topCards" target="_blank">More</a>
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
     *     icon: mdi:test
     *     path: test
     *     title: Test
     * ```
     */
    extraViews?: Array<LovelaceViewConfig>;
}

export interface AreaViewConfig extends ManualConfigObject<"custom:area-view-strategy", AreaStrategyOptions & { area: string }> {
    meta?: {
        entities: Array<EntityRegistryEntry>;
        areas: Array<AreaRegistryEntry>;
    };
}

export interface HomeAssistantConfigAreaStrategyView extends LovelaceViewConfig {
    strategy: AreaViewConfig;
}

export const mergeStrategyConfig = (
    ...configs: Array<DeepPartial<AreaStrategyOptions> | undefined>
): Omit<AreaStrategyOptions, keyof BaseGridOptions> => {
    const localMerge = configs.filter(notNil).reduce((prev, curr) => {
        return { ...prev, ...curr };
    });

    localMerge.navigation = configs
        .map((c) => c?.navigation)
        .filter(notNil)
        .reduce((prev, curr) => {
            return { ...prev, ...curr };
        });

    if (!typia.is<Omit<AreaStrategyOptions, keyof BaseGridOptions>>(localMerge)) {
        const state = typia.validate<Omit<AreaStrategyOptions, keyof BaseGridOptions>>(localMerge);
        throw Error(state.success ? "Something went wrong. Check config." : JSON.stringify(state.errors));
    }

    return localMerge;
};

class AreaDashboardStrategy extends HTMLTemplateElement {
    static async generate(
        dashboardConfig: ManualConfigObject<"custom:area-dashboard-strategy", AreaStrategyOptions>,
        hass: HomeAssistant,
    ): Promise<LovelaceConfig> {
        const [entities, areas] = await Promise.all([
            hass.callWS<Array<EntityRegistryEntry>>({ type: "config/entity_registry/list" }),
            hass.callWS<Array<AreaRegistryEntry>>({ type: "config/area_registry/list" }),
        ]);

        const strategyConfig = mergeStrategyConfig(defaultConfig as AreaStrategyOptions, dashboardConfig?.config);

        const filter = createRowFilter(strategyConfig.navigation, hass);
        const sort = createRowSort(strategyConfig.navigation, hass);
        const usedAreas = areas.filter(filter).sort(sort);

        const areaViews: Array<HomeAssistantConfigAreaStrategyView> = usedAreas.map((area, index) => ({
            strategy: {
                type: "custom:area-view-strategy",
                meta: {
                    entities,
                    areas,
                },
                config: { ...dashboardConfig.config, area: area.area_id },
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
        const { meta } = viewConfig;
        const area = viewConfig.config?.area;
        const config = mergeStrategyConfig(defaultConfig as AreaStrategyOptions, viewConfig.config);
        const { main, navigation, topCards } = config;
        const { grids } = mergeConfig(defaultConfig as AreaStrategyOptions, viewConfig.config);

        let entities = Array<EntityRegistryEntry>();
        let areas = Array<AreaRegistryEntry>();

        if (!!meta) {
            entities = meta.entities;
            areas = meta.areas;
        } else {
            const loadedMeta = await Promise.all([
                hass.callWS<Array<EntityRegistryEntry>>({ type: "config/entity_registry/list" }),
                hass.callWS<Array<AreaRegistryEntry>>({ type: "config/area_registry/list" }),
            ]);
            entities = loadedMeta[0];
            areas = loadedMeta[1];
        }

        const filter = createRowFilter(navigation, hass);
        const sort = createRowSort(navigation, hass);
        const usedAreas = areas.filter(filter).sort(sort);
        const currentArea = usedAreas.find((a) => a.area_id == area);

        if (!currentArea) throw Error("No area defined");

        const navCards = createGrid(navigation, usedAreas, { placeholder: "$area", key: "area_id", replaces: [["$currArea", currentArea.area_id]] });

        const navigationCard: LovelaceCardConfig = {
            type: "vertical-stack",
            cards: [
                ...(topCards || []),
                ...navCards,
                {
                    type: "custom:gap-card",
                    height: 60,
                },
            ],
        };

        const generatedTabs = main
            .map((tab) => {
                const tabGrids = grids.filter((grid) => new RegExp(tab.match).test(grid.id));
                const tabElements = tabGrids.flatMap((grid) => {
                    const baseFilter: Pick<BaseRowOptions, "filter"> = {
                        filter: {
                            include: [
                                {
                                    type: ValueType.area,
                                    value: currentArea.area_id,
                                },
                            ],
                        },
                    };

                    const merge = mergeWith({}, baseFilter, cloneDeep(grid), arrayCustomizer);

                    const filter = createRowFilter(merge, hass);
                    const sort = createRowSort(merge, hass);
                    const filteredEntities = entities.filter(filter).sort(sort);
                    return createGrid(grid, filteredEntities);
                });
                if (tabElements.length > 0) {
                    return {
                        attributes: {
                            label: tab.title,
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
                            "": navigationCard,
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
