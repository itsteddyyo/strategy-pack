import { HomeAssistant, LovelaceViewConfig } from "custom-card-helpers"

import { EntityRegistryEntry } from "./homeassistant/entity_registry";
import { hiddenFilter } from "./util/filter";
import { AreaStrategyCardConfig, CUSTOM_ELEMENT_VIEW, UniversalStrategyOptions, GridViewConfig } from "./util/types";
import { createGrid } from "./util/createGrid";
import defaultConfig from "./config/gridDefaultConfig.yml";

interface UpdateViewOptions extends UniversalStrategyOptions {
    platforms: Array<{ platform: string; title: string; }>;
}

class UpdateViewStrategy extends HTMLTemplateElement {
    static async generate(viewConfig: GridViewConfig<"custom:update-view-strategy", UpdateViewOptions>, hass: HomeAssistant): Promise<LovelaceViewConfig> {
        const { config: userConfig } = viewConfig;
        const config = {
            platforms:
                [
                    { platform: "unifi", title: "UniFi" },
                    { platform: "hacs", title: "HACS" },
                    { platform: "esphome", title: "ESPHome" },
                    { platform: "mqtt", title: "Zigbee" }
                ],
            ...defaultConfig as UniversalStrategyOptions,
            ...userConfig
        };
        const { minColumnWidth, replaceCards, platforms } = config;

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
            return domain == "update";
        });


        const otherFilter = (entity: EntityRegistryEntry) => {
            return !platforms.map(platform => platform.platform).includes(entity.platform);
        }

        const stackCards = createGrid(updateEntities.filter(otherFilter), updateCardConfig, minColumnWidth, "Other", replaceCards);
        platforms.forEach(platform => {
            const filter = (entity: EntityRegistryEntry) => {
                return entity.platform === platform.platform;
            }

            stackCards.push(...createGrid(updateEntities.filter(filter), updateCardConfig, minColumnWidth, platform.title, replaceCards));
        })

        return {
            panel: true,
            cards: [
                {
                    type: "vertical-stack",
                    cards: stackCards
                }
            ]
        };
    }
}

customElements.define(`${CUSTOM_ELEMENT_VIEW}update-view-strategy`, UpdateViewStrategy);
