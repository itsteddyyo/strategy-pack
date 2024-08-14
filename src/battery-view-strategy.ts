import { HomeAssistant, LovelaceViewConfig } from "custom-card-helpers"

import { EntityRegistryEntry } from "./homeassistant/entity_registry";
import { hiddenFilter } from "./util/filter";
import { AreaStrategyCardConfig, CUSTOM_ELEMENT_VIEW, GridStategyOptions, GridViewConfig } from "./util/types";
import { createGrid } from "./util/createGrid";
import defaultConfig from "./config/gridDefaultConfig.yml";

class BatteryViewStrategy extends HTMLTemplateElement {
    static async generate(viewConfig: GridViewConfig<"custom:battery-view-strategy">, hass: HomeAssistant): Promise<LovelaceViewConfig> {
        const { config: preMergedConfig } = viewConfig;
        const config = { ...defaultConfig as GridStategyOptions, ...preMergedConfig };
        const { minColumnWidth, replaceCards } = config;

        const [entities] = await Promise.all([
            hass.callWS<Array<EntityRegistryEntry>>({ type: "config/entity_registry/list" }),
        ]);

        const batteryCardConfig: AreaStrategyCardConfig = {
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
            }
        };

        const batteryEntities = entities.filter(hiddenFilter).filter((entity) => {
            const domain = entity.entity_id.split(".")[0];
            return (
                domain == "sensor" &&
                hass.states[entity.entity_id]?.attributes?.device_class == "battery"
            );
        });

        const otherEntities = batteryEntities.filter((entity) => {
            return !["mqtt", "switchbot"].includes(entity.platform);
        })

        const mqttEntities = batteryEntities.filter((entity) => {
            return ["mqtt"].includes(entity.platform);
        })

        const switchbotEntities = batteryEntities.filter((entity) => {
            return ["switchbot"].includes(entity.platform);
        })

        return {
            panel: true,
            cards: [
                {
                    type: "vertical-stack",
                    cards: [

                        ...(otherEntities.length > 0
                            ? createGrid(otherEntities, batteryCardConfig, minColumnWidth, "Other", replaceCards)
                            : []),
                        ...(mqttEntities.length > 0
                            ? createGrid(mqttEntities, batteryCardConfig, minColumnWidth, "Zigbee", replaceCards)
                            : []),
                        ...(switchbotEntities.length > 0
                            ? createGrid(switchbotEntities, batteryCardConfig, minColumnWidth, "Switchbot", replaceCards)
                            : []),
                    ]
                }
            ],
        };
    }
}

customElements.define(`${CUSTOM_ELEMENT_VIEW}battery-view-strategy`, BatteryViewStrategy);
