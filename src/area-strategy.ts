import { HomeAssistant, LovelaceCardConfig, LovelaceConfig, LovelaceViewConfig } from "custom-card-helpers"

import { EntityRegistryEntry } from "./homeassistant/entity_registry";
import { DeviceRegistryEntry } from "./homeassistant/device_registry";
import { AreaRegistryEntry } from "./homeassistant/area_registry";

import { filterValue, hiddenFilter } from './util/filter';
import { labelSort, notNil } from './util/helper';
import { DashboardConfig, ViewConfig, HomeAssistantConfigAreaStrategyView, RowConfig, Comparator, AreaStrategyOptions, CUSTOM_ELEMENT_DASHBOARD, CUSTOM_ELEMENT_VIEW } from "./util/types";

import defaultConfig from "./defaultConfig.yml";
import { createGrid } from "./util/createGrid";

class AreaDashboardStrategy extends HTMLTemplateElement {
  static async generate(dashboardConfig: DashboardConfig, hass: HomeAssistant): Promise<LovelaceConfig> {
    const [entities, devices, areas] = await Promise.all([
      hass.callWS<Array<EntityRegistryEntry>>({ type: "config/entity_registry/list" }),
      hass.callWS<Array<DeviceRegistryEntry>>({ type: "config/device_registry/list" }),
      hass.callWS<Array<AreaRegistryEntry>>({ type: "config/area_registry/list" }),
    ]);

    const usedAreas = areas.filter((area) => {
      return !dashboardConfig.config?.areaBlacklist || dashboardConfig.config.areaBlacklist.indexOf(area.area_id) == -1;
    }).sort(labelSort);

    const areaViews: Array<HomeAssistantConfigAreaStrategyView> = usedAreas.map((area, index) => ({
      strategy: {
        type: "custom:area-view-strategy",
        meta: {
          entities,
          devices,
          areas,
        },
        config: {
          ...defaultConfig as AreaStrategyOptions,
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
  static async generate(viewConfig: ViewConfig, hass: HomeAssistant): Promise<LovelaceViewConfig> {
    const { config, meta } = viewConfig;
    const { area, tabs, replaceCards, topCards, areaColors, areaCardConfig, areaBlacklist } = config;

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
    const currentArea = areas.find(a => a.area_id == area);

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

    const navigationCard = usedAreas.reduce(
      (prev, curr, index) => {
        const areaCard = {
          ...areaCardConfig,
          type: "area",
          area: curr.area_id,
          navigation_path: `${curr.area_id}#main`,
        };
        prev.cards[0].cards.push({
          type: "conditional",
          conditions: [{
            condition: "screen",
            media_query: "(max-width: 1000px)"
          }],
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

        prev.cards[0].cards.push(
          {
            type: "conditional",
            conditions: [{
              condition: "screen",
              media_query: "(min-width: 1001px)"
            }],
            card: curr.area_id == currentArea.area_id
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
          })

        return prev;
      },
      gridTemplate
    );

    navigationCard.cards = [...(topCards || []), ...navigationCard.cards];

    const createTabElements = (tabRows: Array<RowConfig>) =>
      tabRows.reduce((prev, curr) => {
        let usedEntities = entities
          .filter(hiddenFilter)
          //in this area
          .filter((entity) => {
            return entity.area_id
              ? entity.area_id === currentArea.area_id
              : areaDevices.has(entity.device_id);
          })
          //entity in defined domain of row
          .filter((entity) => {
            const domain = entity.entity_id.split(".")[0];
            if (Array.isArray(curr.domain)) {
              return curr.domain.filter((currDomain) => currDomain == domain)
                .length > 0;
            } else {
              return curr.domain == domain;
            }
          });


        if (!!curr.filter) {
          //custom include filter in row definition
          usedEntities = usedEntities.filter((entity) => {
            const include = curr.filter?.include || [];
            return include.reduce((prev, filter) => {
              if (prev) {
                return filterValue[filter.type](entity, hass, filter.value, filter.comparator || Comparator.equal)
              } else {
                return prev;
              }
            }, true)
          })
          //custom exclude filter in row definition
          usedEntities = usedEntities.filter((entity) => {
            const exclude = curr.filter?.exclude || [];
            return exclude.reduce((prev, filter) => {
              if (prev) {
                return !filterValue[filter.type](entity, hass, filter.value, filter.comparator || Comparator.equal)
              } else {
                return prev;
              }
            }, true)
          })
        }

        const gridCards = createGrid(usedEntities, curr, curr.title, replaceCards);
        prev.push(...gridCards);

        return prev;
      }, Array<LovelaceCardConfig>());

    const generatedTabs = tabs
      .map((tab) => {
        const tabElements = createTabElements(tab.rows);
        if (tabElements.length > 0) {
          return {
            attributes: {
              label: tab.label,
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
          conditions: [{
            condition: "screen",
            media_query: "(max-width: 1000px)"
          }],
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
          conditions: [{
            condition: "screen",
            media_query: "(min-width: 1001px)"
          }],
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
      ]
    };

    return {
      panel: true,
      cards: [homeCard],
    };
  }
}

customElements.define(`${CUSTOM_ELEMENT_DASHBOARD}area-dashboard-strategy`, AreaDashboardStrategy);
customElements.define(`${CUSTOM_ELEMENT_VIEW}area-view-strategy`, AreaViewStrategy);
