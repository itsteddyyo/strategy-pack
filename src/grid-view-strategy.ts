import { HomeAssistant, LovelaceCardConfig, LovelaceViewConfig } from "custom-card-helpers";

import { EntityRegistryEntry } from "./homeassistant/entity_registry";
import { createRowFilter, hiddenFilter } from "./util/filter";
import { CUSTOM_ELEMENT_VIEW, UniversalStrategyOptions, GridViewConfig, GridStrategyCardConfig, RowFilterConfig } from "./util/types";
import { createGrid } from "./util/createGrid";
import defaultConfig from "./config/gridDefaultConfig.yml";

export interface RowConfig extends GridStrategyCardConfig, RowFilterConfig {
    /**
     * @description
     * Title shown over Grid. Will not be rendered when not set.
     * @example
     * ```yaml
     * title: Buttons
     * ```
     */
    title?: string;
}

export interface GridViewOptions extends UniversalStrategyOptions {
    /**
     * @description
     * The grid rows definition of the tab. <a href="#contentrows">More</a>
     * @example
     * ```yaml
     * rows:
     *   - title: test
     *     domain: media_player
     *     card:
     *       type: tile
     *     filter:
     *       - filterConfig here
     *   - title: test2
     *     domain: sensor
     *     card:
     *       type: tile
     *     filter:
     *       - filterConfig here
     * ```
     */
    rows: Array<RowConfig>;
}

class GridViewStrategy extends HTMLTemplateElement {
    static async generate(
        viewConfig: GridViewConfig<"custom:grid-view-strategy", GridViewOptions>,
        hass: HomeAssistant,
    ): Promise<LovelaceViewConfig> {
        const { config: userConfig } = viewConfig;
        const config = {
            ...(defaultConfig as UniversalStrategyOptions),
            ...userConfig,
        };
        const { minColumnWidth, replaceCards, rows } = config;

        if (!rows) throw Error("rows not defined!");

        const [entities] = await Promise.all([hass.callWS<Array<EntityRegistryEntry>>({ type: "config/entity_registry/list" })]);

        const stackCards = rows.reduce((cards, row) => {
            const rowEntities = entities.filter(hiddenFilter).filter(createRowFilter(row, hass));
            cards.push(...createGrid(rowEntities, row, minColumnWidth, row.title, replaceCards));
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
