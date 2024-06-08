import { HomeAssistant, LovelaceCardConfig } from "custom-card-helpers"

import { EntityRegistryEntry } from "./homeassistant/entity_registry";
import { DeviceRegistryEntry } from "./homeassistant/device_registry";
import { AreaRegistryEntry } from "./homeassistant/area_registry";

import { filterValue } from './filter';
import { labelSort } from './helper';
import { DashboardConfig, StrategyConfig, CreateViewConfig, RowConfig, Comparator } from "./types";

import defaultConfig from "./defaultConfig.yml";

class AreaStrategyDashboard extends HTMLTemplateElement {
  static async generate(dashboardConfig: DashboardConfig, hass: HomeAssistant) {
    // Query all data we need. We will make it available to views by storing it in strategy options.
    const [areas, devices, entities] = await Promise.all([
      hass.callWS<Array<AreaRegistryEntry>>({ type: "config/area_registry/list" }),
      hass.callWS<Array<DeviceRegistryEntry>>({ type: "config/device_registry/list" }),
      hass.callWS<Array<EntityRegistryEntry>>({ type: "config/entity_registry/list" }),
    ]);

    const usedAreas = areas.filter((area) => {
      return (
        area.labels.filter((label) => label == "area_deactivate").length == 0
      );
    });

    const mergedOptions = {
      ...defaultConfig,
      ...dashboardConfig.options,
    };

    const areaViews: Array<CreateViewConfig> = usedAreas.sort(labelSort).map((area, index) => ({
      strategy: {
        type: "custom:area-strategy",
        area,
        devices,
        entities,
        areas: usedAreas,
        options: mergedOptions,
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
      views: areaViews,
    };
  }
}

class AreaStrategyView extends HTMLTemplateElement {
  static async generate(viewConfig: StrategyConfig, hass: HomeAssistant) {
    const { area, devices, entities, areas, options } = viewConfig;
    const { tabs, replaceCards, topCards, areaColor } = options;

    const areaDevices = new Set();

    // Find all devices linked to this area
    for (const device of devices) {
      if (device.area_id === area.area_id) {
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

    const navigationCard = areas.reduce(
      (prev, curr, index) => {
        const areaCard = {
          type: "area",
          aspect_ratio: "35:15",
          area: curr.area_id,
          navigation_path: `${curr.area_id}#main`,
          alert_classes: ["occupancy"],
          sensor_classes: ["temperature", "moisture"],
        };
        prev.cards[0].cards.push({
          type: "custom:state-switch",
          entity: "mediaquery",
          states: {
            "(max-width: 1000px)": {
              ...areaCard,
              card_mod: {
                style: `
                  hui-image {
                    opacity: 0.3;
                  }
                  div.navigate {
                    background-color: ${areaColor[index]};
                  }`,
              },
            },
            all:
              curr.area_id == area.area_id
                ? areaCard
                : {
                  ...areaCard,
                  card_mod: {
                    style: `
                        hui-image {
                          opacity: 0.3;
                        }
                        div.navigate {
                          background-color: ${areaColor[index]};
                        }`,
                  },
                },
          },
        });

        return prev;
      },
      gridTemplate
    );

    navigationCard.cards = [...(topCards || []), ...navigationCard.cards];

    const createTabElements = (tabRows: Array<RowConfig>) =>
      tabRows.reduce((prev, curr) => {
        const gridCards: Array<LovelaceCardConfig> = [];
        for (const entity of entities) {
          if (
            entity.area_id
              ? entity.area_id === area.area_id
              : areaDevices.has(entity.device_id) &&
              !entity.disabled_by &&
              !entity.hidden_by
          ) {
            const domain = entity.entity_id.split(".")[0];

            let keep = false;
            if (Array.isArray(curr.domain)) {
              keep =
                curr.domain.filter((currDomain) => currDomain == domain)
                  .length > 0;
            } else {
              keep = curr.domain == domain;
            }

            if (!!curr.filter) {
              if (keep) {
                const include = curr.filter.include || [];
                keep = include.reduce((prev, filter) => {
                  if (prev) {
                    return filterValue[filter.type](entity, hass, filter.value, filter.comparator || Comparator.equal)
                  } else {
                    return prev;
                  }
                }, true)
              }

              if (keep) {
                const exclude = curr.filter.exclude || [];
                keep = exclude.reduce((prev, filter) => {
                  if (prev) {
                    return !filterValue[filter.type](entity, hass, filter.value, filter.comparator || Comparator.equal)
                  } else {
                    return prev;
                  }
                }, true)
              }
            }

            const cardConfig = {
              card: (replaceCards || {})[entity.entity_id]?.card || curr.card,
              entityAttribute:
                (replaceCards || {})[entity.entity_id]?.entityAttribute ||
                curr.entityAttribute,
              entityAttributeAsList:
                (replaceCards || {})[entity.entity_id]?.entityAttributeAsList ||
                curr.entityAttributeAsList,
            };

            if (keep) {
              gridCards.push({
                ...cardConfig.card,
                ...Object.fromEntries([
                  [
                    cardConfig.entityAttribute,
                    !!cardConfig.entityAttributeAsList
                      ? [entity.entity_id]
                      : entity.entity_id,
                  ],
                ]),
              });
            }
          }
        }

        if (gridCards.length > 0) {
          if (curr.title) {
            prev.push({
              type: "custom:mushroom-title-card",
              title: curr.title,
              subtitle_tap_action: {
                action: "none",
              },
            });
          }
          prev.push({
            type: "custom:layout-card",
            layout_type: "custom:grid-layout",
            layout: {
              "grid-template-rows": "auto",
              "grid-template-columns": "repeat(auto-fit, minmax(150px, 1fr))",
              padding: "0px 10px",
            },
            cards: gridCards,
          });
        }
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
      .filter((tab) => !!tab);

    const mainCard = {
      type: "custom:tabbed-card",
      styles: {
        "--mdc-tab-text-label-color-default": "var(--primary-text-color)",
        "--mdc-tab-color-default": "var(--primary-text-color)",
      },
      tabs: generatedTabs,
    };

    const homeCard = {
      type: "custom:state-switch",
      entity: "mediaquery",
      states: {
        "(max-width: 1000px)": {
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
        all: {
          type: "custom:layout-card",
          layout_type: "custom:grid-layout",
          layout: {
            "grid-template-columns": "2fr 3fr",
            "grid-template-areas": "navigation main",
          },
          cards: [navigationCard, mainCard],
        },
      },
    };

    return homeCard;
  }
}

customElements.define(
  "ll-strategy-dashboard-area-strategy",
  AreaStrategyDashboard
);
customElements.define("ll-strategy-view-area-strategy", AreaStrategyView);
