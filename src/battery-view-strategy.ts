import { HomeAssistant, LovelaceViewConfig } from "custom-card-helpers";

import { EntityRegistryEntry } from "./homeassistant/entity_registry";
import { hiddenFilter } from "./util/filter";
import { CUSTOM_ELEMENT_VIEW, GridStrategyCardConfig, GridViewConfig, UniversalStrategyOptions } from "./util/types";
import { createGrid } from "./util/createGrid";
import defaultConfig from "./config/gridDefaultConfig.yml";

export interface BatteryViewOptions extends UniversalStrategyOptions {
    platforms: Array<{ platform: string; title: string }>;
}

class BatteryViewStrategy extends HTMLTemplateElement {
    static async generate(
        viewConfig: GridViewConfig<"custom:battery-view-strategy", BatteryViewOptions>,
        hass: HomeAssistant,
    ): Promise<LovelaceViewConfig> {
        const { config: userConfig } = viewConfig;
        const config = {
            platforms: [
                { platform: "mqtt", title: "Zigbee" },
                { platform: "switchbot", title: "Switchbot" },
            ],
            ...(defaultConfig as UniversalStrategyOptions),
            ...userConfig,
        };
        const { minColumnWidth, replaceCards, platforms } = config;

        const [entities] = await Promise.all([hass.callWS<Array<EntityRegistryEntry>>({ type: "config/entity_registry/list" })]);

        const batteryCardConfig: GridStrategyCardConfig = {
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
            },
        };

        const batteryEntities = entities.filter(hiddenFilter).filter((entity) => {
            const domain = entity.entity_id.split(".")[0];
            return domain == "sensor" && hass.states[entity.entity_id]?.attributes?.device_class == "battery";
        });

        const otherFilter = (entity: EntityRegistryEntry) => {
            return !platforms.map((platform) => platform.platform).includes(entity.platform);
        };

        const stackCards = createGrid(batteryEntities.filter(otherFilter), batteryCardConfig, minColumnWidth, "Other", replaceCards);
        platforms.forEach((platform) => {
            const filter = (entity: EntityRegistryEntry) => {
                return entity.platform === platform.platform;
            };

            stackCards.push(...createGrid(batteryEntities.filter(filter), batteryCardConfig, minColumnWidth, platform.title, replaceCards));
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

customElements.define(`${CUSTOM_ELEMENT_VIEW}battery-view-strategy`, BatteryViewStrategy);
