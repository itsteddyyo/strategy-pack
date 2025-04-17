import {HomeAssistant, LovelaceCardConfig, LovelaceViewConfig} from "custom-card-helpers";

import {EntityRegistryEntry} from "./homeassistant/entity_registry";
import {createRowFilter, createRowSort} from "./util/filter";
import {CUSTOM_ELEMENT_VIEW, BaseGridOptions, GridViewConfig, BaseRowOptions} from "./util/types";
import {createGrid, mergeConfig} from "./util/createGrid";
import defaultConfig from "./config/gridDefaultConfig.yaml";

class GridViewStrategy extends HTMLTemplateElement {
    static async generate(
        viewConfig: GridViewConfig<"custom:grid-view-strategy", BaseGridOptions<BaseRowOptions>>,
        hass: HomeAssistant,
    ): Promise<LovelaceViewConfig> {
        const {config: userConfig} = viewConfig;
        const config = mergeConfig(defaultConfig as BaseGridOptions, userConfig);
        const {grids} = config;

        const [entities] = await Promise.all([hass.callWS<Array<EntityRegistryEntry>>({type: "config/entity_registry/list"})]);

        const stackCards = grids.reduce((cards, row) => {
            const rowEntities = entities.filter(createRowFilter(row, hass)).sort(createRowSort(row, hass));
            cards.push(...createGrid(row, rowEntities));
            return cards;
        }, new Array<LovelaceCardConfig>());

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

customElements.define(`${CUSTOM_ELEMENT_VIEW}grid-view-strategy`, GridViewStrategy);
