import {HomeAssistant, LovelaceCardConfig, LovelaceConfig, LovelaceViewConfig} from "custom-card-helpers";

import {EntityRegistryEntry} from "./homeassistant/entity_registry";
import {AreaRegistryEntry} from "./homeassistant/area_registry";

import {createRowFilter, createRowSort} from "./util/filter";
import {arrayCustomizer, notNil} from "./util/helper";
import {
    CUSTOM_ELEMENT_DASHBOARD,
    CUSTOM_ELEMENT_VIEW,
    ValueType,
    BaseGridOptions,
    ManualConfigObject,
    BaseRowOptions,
    DeepPartial,
} from "./util/types";

import defaultConfig from "./config/areaDefaultConfig.yaml";
import {createGrid, mergeConfig} from "./util/createGrid";
import {cloneDeep, mergeWith} from "lodash";
import typia from "typia";

export interface TabConfig {
    /**
     * @description
     * title shown in the tab
     * @example
     * ```yaml
     * title: Test
     * ```
     */
    title: string;
    /**
     * @description
     * icon shown in the tab
     * @example
     * ```yaml
     * icon: mdi:test
     * ```
     */
    icon: string;
    /**
     * @description
     * Which grids should be shown in this tab. Match the id of the grids with regexp.
     * @remarks
     * Regexp can be tested <a href="https://regex101.com/">here</a>
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
     * global grid config that gets merged with every entry in grids to easily define options that are the same on every grid
     * @link #grid
     * @remarks
     * Only partial config required (global + grids need to satisfy all required fields!)
     * @defaultValue https://github.com/itsteddyyo/strategy-pack/blob/main/src/config/areaDefaultConfig.yaml#L21
     * @example
     * ```yaml
     * global:
     *   minCardWith: 400
     *   filter:
     *     exclude:
     *       - type: integration
     *         value: mqtt
     * ```
     */
    global?: BaseGridOptions["global"];
    /**
     * @description
     * list of grids to be shown on the dashboard
     * @link #grid
     * @defaultValue https://github.com/itsteddyyo/strategy-pack/blob/main/src/config/areaDefaultConfig.yaml#L41
     * @remarks
     * config here and global grid config needs to satisfy every required field
     * You can specify "incomplete" configs to override existing grid configs by specifying gridId instead of id. Those two grid configs will then be merged.
     * @example
     * ```yaml
     * grids:
     *   - id: test
     *     title: Test
     *     filter:
     *         include:
     *             - type: domain
     *               value: alarm_control_panel
     *     sort:
     *       - type: integration
     *         comparator: descending
     *     card:
     *         type: tile
     *         entity: $entity
     *   - id: test_2
     *     title: Test2
     *     minCardWith: 500
     *     filter:
     *         include:
     *             - type: domain
     *               value: media_player
     *     card:
     *         type: tile
     *         entity: $entity
     *   - gridId: test
     *     id: newId
     *     minCardWith: 400
     * ```
     */
    grids: BaseGridOptions["grids"];
    /**
     * @description
     * how to merge base config and user config
     * @link #gridMergeStrategy
     * @defaultValue https://github.com/itsteddyyo/strategy-pack/blob/main/src/config/areaDefaultConfig.yaml#L294
     * @example
     * ```yaml
     * gridMergeStrategy: add
     * ```
     */
    gridMergeStrategy: BaseGridOptions["gridMergeStrategy"];
    /**
     * @description
     * tabs shown in main area
     * @link #main
     * @defaultValue https://github.com/itsteddyyo/strategy-pack/blob/main/src/config/areaDefaultConfig.yaml#L340
     * @example
     * ```yaml
     * main:
     *   - label: Test
     *     icon: mdi:test
     *     match: ^test_.*$
     * ```
     */
    main: Array<TabConfig>;
    /**
     * @description
     * navigation area for selecting view
     * @link #navigation
     * @remarks
     * Will not get merged with global!
     * Must have an navigation path that navigates to "$area#main" for strategy to work correctly!
     * @defaultValue https://github.com/itsteddyyo/strategy-pack/blob/main/src/config/areaDefaultConfig.yaml#L246
     * @example
     * ```yaml
     * navigation:
     *   id: area
     *   card:
     *     type: area
     *     display_type: picture
     *     area: $area
     *     navigation_path: $area#main
     *     aspect_ratio: 40:15
     *     alert_classes:
     *       - occupancy
     *     sensor_classes:
     *       - temperature
     *       - humidity
     *     features_position: inline
     *     features:
     *       - type: area-controls
     *         controls:
     *           - light
     *           - fan
     * ```
     */
    navigation: BaseRowOptions;
    /**
     * @description
     * Slot for cards above navigation
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
     * @link https://www.home-assistant.io/dashboards/views/
     * @example
     * ```yaml
     * extraViews:
     *   - strategy:
     *       type: custom:grid-view-strategy
     *       config: ...
     *     icon: mdi:test
     *     path: test
     *     title: Test
     * ```
     */
    extraViews?: Array<LovelaceViewConfig>;
}

export interface AreaViewConfig extends ManualConfigObject<"custom:area-view-strategy", AreaStrategyOptions & {area: string}> {
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
        return {...prev, ...curr};
    });

    localMerge.navigation = configs
        .map((c) => c?.navigation)
        .filter(notNil)
        .reduce((prev, curr) => {
            return {...prev, ...curr};
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
            hass.callWS<Array<EntityRegistryEntry>>({type: "config/entity_registry/list"}),
            hass.callWS<Array<AreaRegistryEntry>>({type: "config/area_registry/list"}),
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
                config: {...dashboardConfig.config, area: area.area_id},
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
        const {meta} = viewConfig;
        const area = viewConfig.config?.area;
        const config = mergeStrategyConfig(defaultConfig as AreaStrategyOptions, viewConfig.config);
        const {main, navigation, topCards} = config;
        const {grids} = mergeConfig(defaultConfig as AreaStrategyOptions, viewConfig.config);

        let entities = Array<EntityRegistryEntry>();
        let areas = Array<AreaRegistryEntry>();

        if (!!meta) {
            entities = meta.entities;
            areas = meta.areas;
        } else {
            const loadedMeta = await Promise.all([
                hass.callWS<Array<EntityRegistryEntry>>({type: "config/entity_registry/list"}),
                hass.callWS<Array<AreaRegistryEntry>>({type: "config/area_registry/list"}),
            ]);
            entities = loadedMeta[0];
            areas = loadedMeta[1];
        }

        const filter = createRowFilter(navigation, hass);
        const sort = createRowSort(navigation, hass);
        const usedAreas = areas.filter(filter).sort(sort);
        const currentArea = usedAreas.find((a) => a.area_id == area);

        if (!currentArea) throw Error("No area defined");

        const navCards = createGrid(navigation, usedAreas, {placeholder: "$area", key: "area_id", replaces: [["$currArea", currentArea.area_id]]});

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
                            cards: [
                                {
                                    type: "custom:gap-card",
                                    height: 20,
                                },
                                ...tabElements,
                            ],
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
                                            {type: "spacer"},
                                            {
                                                type: "template",
                                                icon: "mdi:home",
                                                icon_height: "40px",
                                                tap_action: {
                                                    action: "navigate",
                                                    navigation_path: window.location.pathname,
                                                },
                                            },
                                            {type: "spacer"},
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
