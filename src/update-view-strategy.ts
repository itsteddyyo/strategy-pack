import { HomeAssistant, LovelaceViewConfig } from "custom-card-helpers"

import { EntityRegistryEntry } from "./homeassistant/entity_registry";
import { hiddenFilter } from "./util/filter";
import { AreaStrategyCardConfig, CUSTOM_ELEMENT_VIEW, GridViewConfig } from "./util/types";
import { createGrid } from "./util/createGrid";
import defaultConfig from "./config/gridDefaultConfig.yml";

class UpdateViewStrategy extends HTMLTemplateElement {
    static async generate(viewConfig: GridViewConfig<"custom:update-view-strategy">, hass: HomeAssistant): Promise<LovelaceViewConfig> {
        const { config: preMergedConfig } = viewConfig;
        const config = { ...defaultConfig, ...preMergedConfig };
        const { minColumnWidth, replaceCards } = config;

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
                            ? createGrid(otherEntities, updateCardConfig, minColumnWidth, "Other", replaceCards)
                            : []),
                        ...(unifiEntities.length > 0
                            ? createGrid(unifiEntities, updateCardConfig, minColumnWidth, "UniFi", replaceCards)
                            : []),
                        ...(esphomeEntities.length > 0
                            ? createGrid(esphomeEntities, updateCardConfig, minColumnWidth, "ESPHome", replaceCards)
                            : []),
                    ]
                }
            ]
        };
    }
}

customElements.define(`${CUSTOM_ELEMENT_VIEW}update-view-strategy`, UpdateViewStrategy);
