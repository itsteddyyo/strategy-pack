import { HomeAssistant, LovelaceViewConfig } from "custom-card-helpers"

import { EntityRegistryEntry } from "./homeassistant/entity_registry";
import { hiddenFilter } from "./util/filter";
import { AreaStrategyCardConfig, CUSTOM_ELEMENT_VIEW } from "./util/types";
import { createGrid } from "./util/createGrid";

class BatteryViewStrategy extends HTMLTemplateElement {
    static async generate(_viewConfig: any, hass: HomeAssistant): Promise<LovelaceViewConfig> {
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
                            ? createGrid(otherEntities, batteryCardConfig, "Other")
                            : []),
                        ...(mqttEntities.length > 0
                            ? createGrid(mqttEntities, batteryCardConfig, "Zigbee")
                            : []),
                        ...(switchbotEntities.length > 0
                            ? createGrid(switchbotEntities, batteryCardConfig, "Switchbot")
                            : []),
                    ]
                }
            ],
        };
    }
}

customElements.define(`${CUSTOM_ELEMENT_VIEW}battery-view-strategy`, BatteryViewStrategy);
