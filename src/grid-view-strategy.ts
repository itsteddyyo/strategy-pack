import { HomeAssistant, LovelaceCardConfig, LovelaceViewConfig } from "custom-card-helpers"

import { EntityRegistryEntry } from "./homeassistant/entity_registry";
import { createRowFilter, hiddenFilter } from "./util/filter";
import { CUSTOM_ELEMENT_VIEW, UniversalStrategyOptions, GridViewConfig, RowConfig } from "./util/types";
import { createGrid } from "./util/createGrid";
import defaultConfig from "./config/gridDefaultConfig.yml";

interface GridViewOptions extends UniversalStrategyOptions {
    rows: Array<RowConfig>
}

class GridViewStrategy extends HTMLTemplateElement {
    static async generate(viewConfig: GridViewConfig<"custom:grid-view-strategy", GridViewOptions>, hass: HomeAssistant): Promise<LovelaceViewConfig> {
        const { config: userConfig } = viewConfig;
        const config = {
            ...defaultConfig as UniversalStrategyOptions,
            ...userConfig
        };
        const { minColumnWidth, replaceCards, rows } = config;

        if(!rows) throw Error("rows not defined!");

        const [entities] = await Promise.all([
            hass.callWS<Array<EntityRegistryEntry>>({ type: "config/entity_registry/list" }),
        ]);

        const stackCards = rows.reduce((cards, row) => {
            const rowEntities = entities.filter(hiddenFilter).filter(createRowFilter(row, hass));
            cards.push(...createGrid(rowEntities, row, minColumnWidth, row.title, replaceCards));
            return cards;
        }, new Array<LovelaceCardConfig>())

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

customElements.define(`${CUSTOM_ELEMENT_VIEW}grid-view-strategy`, GridViewStrategy);
