import { HomeAssistant, LovelaceCardConfig, LovelaceViewConfig } from "custom-card-helpers";

import { EntityRegistryEntry } from "./homeassistant/entity_registry";
import { createRowFilter } from "./util/filter";
import { CUSTOM_ELEMENT_VIEW, BaseGridOptions, GridViewConfig, GridStrategyCardConfig, RowFilterConfig } from "./util/types";
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

export interface GridViewOptions extends BaseGridOptions {
    /**
     * @description
     * The rows shown in the View. <a href="#contentrows" target="_blank">More</a>
     * @example
     * ```yaml
     * rows:
     *   - title: test
     *     card:
     *       type: tile
     *     filter: 
     *       include:
     *          - type: domain
     *            value: media_player
     *   - title: test2
     *     card:
     *       type: tile
     *     filter: 
     *       include:
     *          - type: domain
     *            value: sensor
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
            ...(defaultConfig as BaseGridOptions),
            ...userConfig,
        };
        const { minColumnWidth, replaceCards, rows } = config;

        if (!rows) throw Error("rows not defined!");

        const [entities] = await Promise.all([hass.callWS<Array<EntityRegistryEntry>>({ type: "config/entity_registry/list" })]);

        const stackCards = rows.reduce((cards, row) => {
            const rowEntities = entities.filter(createRowFilter(row, hass));
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
