import { HomeAssistant, LovelaceViewConfig } from "custom-card-helpers"

import { EntityRegistryEntry } from "./homeassistant/entity_registry";
import { hiddenFilter } from "./util/filter";
import { AreaStrategyCardConfig, CUSTOM_ELEMENT_VIEW } from "./util/types";
import { createGrid } from "./util/createGrid";

class UpdateViewStrategy extends HTMLTemplateElement {
    static async generate(_viewConfig: any, hass: HomeAssistant): Promise<LovelaceViewConfig> {
        const [entities] = await Promise.all([
            hass.callWS<Array<EntityRegistryEntry>>({ type: "config/entity_registry/list" }),
        ]);

        const updateCardConfig: AreaStrategyCardConfig = {
            card: {
                type: "tile",
                entity: "$entity",
                hide_state: true,
                features: [
                    { type: "update-actions", backup: "ask" }
                ]
            }
        };

        const updateEntities = entities.filter(hiddenFilter).filter((entity) => {
            const domain = entity.entity_id.split(".")[0];
            return !entity.disabled_by && !entity.hidden_by && domain == "update";
        });

        const otherEntities = updateEntities.filter((entity) => {
            return !["unifi", "esphome"].includes(entity.platform);
        })

        const unifiEntities = updateEntities.filter((entity) => {
            return ["unifi"].includes(entity.platform);
        })

        const esphomeEntities = updateEntities.filter((entity) => {
            return ["esphome"].includes(entity.platform);
        })

        return {
            panel: true,
            cards: [
                {
                    type: "vertical-stack",
                    cards: [

                        ...(otherEntities.length > 0
                            ? createGrid(otherEntities, updateCardConfig, "Other")
                            : []),
                        ...(unifiEntities.length > 0
                            ? createGrid(unifiEntities, updateCardConfig, "UniFi")
                            : []),
                        ...(esphomeEntities.length > 0
                            ? createGrid(esphomeEntities, updateCardConfig, "ESPHome")
                            : []),
                    ]
                }
            ]
        };
    }
}

customElements.define(`${CUSTOM_ELEMENT_VIEW}update-view-strategy`, UpdateViewStrategy);
