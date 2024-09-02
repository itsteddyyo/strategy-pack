import { HomeAssistant, LovelaceViewConfig } from "custom-card-helpers";

import { EntityRegistryEntry } from "./homeassistant/entity_registry";
import { hiddenFilter } from "./util/filter";
import { CUSTOM_ELEMENT_VIEW, BaseGridOptions, GridViewConfig, GridStrategyCardConfig } from "./util/types";
import { createGrid } from "./util/createGrid";
import defaultConfig from "./config/gridDefaultConfig.yml";

export interface UpdateViewOptions extends BaseGridOptions {
    /**
     * @description
     * Platforms (= integrations) for which the strategy should generate rows
     * @defaultValue
     * UniFi, HACS, ESPHome, Zigbee, Other (always present everything that is not defined in platforms!)
     * @remarks
     * You need the internal HA id of the integration. <a href="https://community.home-assistant.io/t/how-to-get-an-integration-name-for-an-entity/447635">Here</a> is described how to obtain it
     * @example
     * ```yaml
     * platforms:
     *   - platform: hacs
     *     title: HACS
     *   - platform: MQTT
     *     title: Everything MQTT
     * ```
     */
    platforms: Array<{ platform: string; title: string }>;
}

class UpdateViewStrategy extends HTMLTemplateElement {
    static async generate(
        viewConfig: GridViewConfig<"custom:update-view-strategy", UpdateViewOptions>,
        hass: HomeAssistant,
    ): Promise<LovelaceViewConfig> {
        const { config: userConfig } = viewConfig;
        const config = {
            platforms: [
                { platform: "unifi", title: "UniFi" },
                { platform: "hacs", title: "HACS" },
                { platform: "esphome", title: "ESPHome" },
                { platform: "mqtt", title: "Zigbee" },
            ],
            ...(defaultConfig as BaseGridOptions),
            ...userConfig,
        };
        const { minColumnWidth, replaceCards, platforms } = config;

        const [entities] = await Promise.all([hass.callWS<Array<EntityRegistryEntry>>({ type: "config/entity_registry/list" })]);

        const updateCardConfig: GridStrategyCardConfig = {
            card: {
                type: "tile",
                entity: "$entity",
                hide_state: true,
                features: [{ type: "update-actions", backup: "ask" }],
            },
        };

        const updateEntities = entities.filter(hiddenFilter).filter((entity) => {
            const domain = entity.entity_id.split(".")[0];
            return domain == "update";
        });

        const otherFilter = (entity: EntityRegistryEntry) => {
            return !platforms.map((platform) => platform.platform).includes(entity.platform);
        };

        const stackCards = createGrid(updateEntities.filter(otherFilter), updateCardConfig, minColumnWidth, "Other", replaceCards);
        platforms.forEach((platform) => {
            const filter = (entity: EntityRegistryEntry) => {
                return entity.platform === platform.platform;
            };

            stackCards.push(...createGrid(updateEntities.filter(filter), updateCardConfig, minColumnWidth, platform.title, replaceCards));
        });

        return {
            panel: true,
            cards: [
                {
                    type: "vertical-stack",
                    cards: stackCards,
                },
            ],
        };
    }
}

customElements.define(`${CUSTOM_ELEMENT_VIEW}update-view-strategy`, UpdateViewStrategy);
