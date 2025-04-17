import {LovelaceCardConfig} from "custom-card-helpers";

export const CUSTOM_ELEMENT_DASHBOARD = "ll-strategy-dashboard-";
export const CUSTOM_ELEMENT_VIEW = "ll-strategy-view-";

export enum ValueType {
    /**
     * @description
     * Filter on the entity_id of the entity.
     * @remarks
     * entity_id not Entity Name or Display Name! Some ways to find it explained <a href="https://community.home-assistant.io/t/device-id-entity-id-where-to-find/289230/12">here</a>
     * @example
     * ```yaml
     * - type: entity
     *   comparator: equal
     *   value: sensor.test123
     * ```
     */
    entity = "entity",
    /**
     * @description
     * Filter on the domain of the entity.
     * @example
     * ```yaml
     * - type: domain
     *   comparator: equal
     *   value: sensor
     * ```
     */
    domain = "domain",
    /**
     * @description
     * Filter on the parent device_id of the entity.
     * @remarks
     * device_id not Device Name or Display Name! Some ways to find it explained <a href="https://community.home-assistant.io/t/device-id-entity-id-where-to-find/289230/12">here</a>
     * @example
     * ```yaml
     * - type: device
     *   comparator: equal
     *   value: 98b750a482bbf28ea959269981813219
     * ```
     */
    device = "device",
    /**
     * @description
     * Filter on the area_id of the entity.
     * @remarks
     * area_id not Area Name or Display Name! Find at "https://YourHA/config/areas/dashboard". Edit Area = shows area_id
     * @example
     * ```yaml
     * - type: area
     *   comparator: equal
     *   value: living_room
     * ```
     */
    area = "area",
    /**
     * @description
     * Filter on the floor_id of the area.
     * @remarks
     * floor_id not Floor Name or Floor Name! Find at "https://YourHA/config/areas/dashboard". Edit Floor = shows floor_id
     * @example
     * ```yaml
     * - type: floor
     *   comparator: equal
     *   value: first_floor
     * ```
     */
    floor = "floor",
    /**
     * @description
     * Filter on the integration of the entity.
     * @remarks
     * Needs to be the id of the integration not the name! More on how to find it <a href="https://community.home-assistant.io/t/how-to-get-an-integration-name-for-an-entity/447635">here</a>
     * @example
     * ```yaml
     * - type: integration
     *   comparator: equal
     *   value: mqtt
     * ```
     */
    integration = "integration",
    /**
     * @description
     * Filter on the label of the entity.
     * @remarks
     * Needs to be the id of the label not the name! More on how to find it <a href="https://www.home-assistant.io/docs/configuration/templating/#labels">here</a>
     * @example
     * ```yaml
     * - type: label
     *   config:
     *     label: ^sort_\d+$
     *   comparator: equal
     *   value: sort_1
     * ```
     */
    label = "label",
    /**
     * @description
     * Filter on the state of the entity.
     * @example
     * ```yaml
     * - type: state
     *   comparator: equal
     *   value: on
     * ```
     */
    state = "state",
    /**
     * @description
     * Filter on an attribute of the entity.
     * @remarks
     * Needs a special value structure with another object with key + value, where key is the desired attribute
     * @example
     * ```yaml
     * - type: attribute
     *   comparator: equal
     *   config:
     *     key: volume
     *   value: 100
     * ```
     */
    attribute = "attribute",
    /**
     * @description
     * Filter on the disabled_by state of the entity.
     * @remarks
     * Possible Disablers <a href="https://github.com/home-assistant/core/blob/dev/homeassistant/helpers/entity_registry.py#L104" target="_blank">here</a>
     * @example
     * ```yaml
     * - type: disabled_by
     *   comparator: match
     *   value: .*
     * ```
     */
    disabled_by = "disabled_by",
    /**
     * @description
     * Filter on the hidden_by state of the entity.
     * @remarks
     * Possible Hiders <a href="https://github.com/home-assistant/core/blob/dev/homeassistant/helpers/entity_registry.py#L104" target="_blank">here</a>
     * @example
     * ```yaml
     * - type: hidden_by
     *   comparator: match
     *   value: .*
     * ```
     */
    hidden_by = "hidden_by",
    /**
     * @description
     * Filter on the category of the entity.
     * @example
     * ```yaml
     * - type: entity_category
     *   comparator: equal
     *   value: diagnostic
     * ```
     */
    entity_category = "entity_category",
}

export enum FilterComparator {
    /**
     * @description
     * Check if the selected type value of the entity and the passed value are equal.
     * @example
     * ```yaml
     * - type: state
     *   comparator: equal
     *   value: on
     * ```
     */
    equal = "equal",
    /**
     * @description
     * Check if the selected type value of the entity matches against the passed regexp value.
     * @remarks
     * Regexp can be tested <a href="https://regex101.com/">here</a>
     * @example
     * ```yaml
     * - type: entity
     *   comparator: match
     *   value: ^.*_occupancy$
     * ```
     */
    match = "match",
    /**
     * @description
     * Check if the selected type value of the entity is in the list of defined values.
     * @remarks
     * value needs to be an array!
     * @example
     * ```yaml
     * - type: state
     *   comparator: in
     *   value:
     *     - on
     *     - off
     * ```
     */
    in = "in",
    /**
     * @description
     * Check if the selected type value of the entity is greater than the defined value.
     * @remarks
     * Works only on numeric type values and defined values!
     * @example
     * ```yaml
     * - type: state
     *   comparator: greater_than
     *   value: 5
     * ```
     */
    greater_than = "greater_than",
    /**
     * @description
     * Check if the selected type value of the entity is lower than the defined value.
     * @remarks
     * Works only on numeric type values and defined values!
     * @example
     * ```yaml
     * - type: state
     *   comparator: lower_than
     *   value: 5
     * ```
     */
    lower_than = "lower_than",
    /**
     * @description
     * Check if the selected type value of the entity is null.
     * @remarks
     * Does not need a value defined! Exception is type: attribute as it needs key for attribute name!
     * @example
     * ```yaml
     * - type: state
     *   comparator: is_null
     * ```
     */
    is_null = "is_null",
    /**
     * @description
     * Check if the selected type value of the entity is numeric.
     * @remarks
     * Does not need a value defined! Exception is type: attribute as it needs key for attribute name!
     * @example
     * ```yaml
     * - type: attribute
     *   comparator: is_numeric
     *   value:
     *     key: volume
     * ```
     */
    is_numeric = "is_numeric",
}

export enum SortComparator {
    /**
     * @description
     * Sort the grid ascending.
     * @example
     * ```yaml
     * - type: integration
     *   comparator: ascending
     * ```
     */
    ascending = "ascending",
    /**
     * @description
     * Sort the grid descending.
     * @example
     * ```yaml
     * - type: label
     *   config:
     *     label: ^sort_\d+$
     *   comparator: descending
     * ```
     */
    descending = "descending",
}

export enum GridMergeStrategy {
    /**
     * @description
     * Add new grids to existing configuration.
     * @remarks
     * Edit existing configuration options by specifying gridId instead of id.
     * @example
     * gridMergeStrategy: add
     */
    add = "add",
    /**
     * @description
     * Reset existing configuration when specifying own grids.
     * @example
     * gridMergeStrategy: reset
     */
    reset = "reset",
}

export interface TypeConfig {
    key?: string;
    label?: string;
}

export interface ValueConfig {
    /**
     * @description
     * The type of filter to determine the value from the entity/area.
     * @link #value-type
     * @example
     * type: state
     */
    type: ValueType;
    /**
     * @description
     * Extra configuration options for the filter type.
     * @remarks
     * Only required and applied for label/attribute!
     * @example
     * config:
     *   key: device_class
     */
    config?: TypeConfig;
}

export interface FilterConfig extends ValueConfig {
    /**
     * @description
     * Compare method for value 1 (extracted from entity/area) and value 2 (specified by user)
     * @link #filter-comparator
     * @defaultValue equal
     * @example
     * comparator: equal
     */
    comparator?: FilterComparator;
    /**
     * @description
     * The user specified value
     * @remarks
     * Not needed for is_numeric and is_null
     * @example
     * value: on
     */
    value?: unknown;
}

export interface SortConfig extends ValueConfig {
    /**
     * @description
     * Compare method used for sorting all entities/areas by their respective extracted values
     * @link #sort-comparator
     * @defaultValue ascending
     * @example
     * comparator: ascending
     */
    comparator?: SortComparator;
}
/**
 * @description
 * Controls which entities/areas get displayed in the grid.
 */
export interface FilterObject {
    exclude?: Array<FilterConfig>;
    include?: Array<FilterConfig>;
}

export interface RowFilterConfig {
    /**
     * @description
     * Controls which entities/areas get displayed in the grid.
     * @link #filter
     * @remarks
     * Must match all include filters to be included. Needs to match only one exclude filter to be excluded.
     * @example
     * ```yaml
     * filter:
     *   include:
     *     - type: domain
     *       value: binary_sensor
     *     - type: state
     *       value: on
     *   exclude:
     *     - type: entity
     *       value: sensor.test123
     *     - type: state
     *       comparator: is_null
     *     - type: area
     *       value: living_room
     * ```
     */
    filter?: FilterObject;
}

export interface RowSortConfig {
    /**
     * @description
     * Controls the order of the entities in the grid
     * @link #sort
     * @example
     * ```yaml
     * sort:
     *   - type: integration
     *   - type: label
     *     config:
     *       label: ^sort_\d+$
     *     comparator: descending
     *   - type: attribute
     *     config:
     *       key: device_class
     *     comparator: ascending
     * ```
     */
    sort?: Array<SortConfig>;
}

export interface GridStrategyCardConfig {
    /**
     * @description
     * The config for the card that should be rendered for every entity in the grid.
     * @remarks
     * Insert the entity/area with the $entity/$area variable.
     * @example
     * ```yaml
     * card:
     *   type: tile
     *   entity: $entity
     *   iconColor: red
     * ```
     */
    card: LovelaceCardConfig;
}

export interface BaseRowOptions extends RowFilterConfig, RowSortConfig, GridStrategyCardConfig {
    /**
     * @description
     * id used for referencing grid
     * @example
     * ```yaml
     * id: test
     * ```
     */
    id: string;
    /**
     * @description
     * title shown over the grid
     * @example
     * ```yaml
     * title: Test
     * ```
     */
    title?: string;
    /**
     * @description
     * position of the grid in the list of grids. 0 if not specified.
     * @remarks
     * lower numbers come first
     * @example
     * ```yaml
     * position: 1
     * ```
     */
    position?: number;
    /**
     * @description
     * minimal card width in the grid
     * @defaultValue https://github.com/itsteddyyo/strategy-pack/blob/main/src/config/gridDefaultConfig.yaml#L2
     * @example
     * ```yaml
     * minCardWidth: 300
     * ```
     */
    minCardWidth: number;
    /**
     * @description
     * You can set a card to be used for a specific entity/area. Overrides grid card config
     * @example
     * ```yaml
     * replace:
     *   button.test:
     *     type: entity
     *     entities:
     *       - $entity
     * ```
     */
    replace?: Record<string, GridStrategyCardConfig>;
}

export interface BaseRowRefOptions extends DeepPartial<BaseRowOptions> {
    /**
     * @description
     * reference to existing grid
     * @remarks
     * Use this id in gridId for overwriting grid!
     * @example
     * ```yaml
     * gridId: test
     * ```
     */
    gridId: string;
}

export interface BaseGridOptions<T = BaseRowOptions | BaseRowRefOptions> {
    /**
     * @description
     * global grid config that gets merged with every entry in grids to easily define options that are the same on every grid
     * @link #grid
     * @remarks
     * Only partial config required (global + grids need to satisfy all required fields!)
     * @defaultValue https://github.com/itsteddyyo/strategy-pack/blob/main/src/config/gridDefaultConfig.yaml#L1
     * @example
     * ```yaml
     * global:
     *   minCardWith: 400
     *   filter:
     *     exclude:
     *       - type: integration
     *         value: mqtt
     * ```
     */
    global?: DeepPartial<BaseRowOptions>;
    /**
     * @description
     * list of grids to be shown on the dashboard
     * @link #grid
     * @remarks
     * Only partial config required (global + grids need to satisfy all required fields!)
     * @example
     * ```yaml
     * grids:
     *   - id: test
     *     title: Test
     *     filter:
     *         include:
     *             - type: domain
     *               value: alarm_control_panel
     *     sort:
     *       - type: integration
     *         comparator: descending
     *     card:
     *         type: tile
     *         entity: $entity
     *   - id: test_2
     *     title: Test2
     *     minCardWith: 500
     *     filter:
     *         include:
     *             - type: domain
     *               value: media_player
     *     card:
     *         type: custom:mushroom-media-player-card
     *         entity: $entity
     *   - gridId: test
     *     id: newId
     *     minCardWith: 400
     * ```
     */
    grids: Array<T>;
    /**
     * @description
     * how to merge base config and user config
     * @link #gridMergeStrategy
     * @defaultValue https://github.com/itsteddyyo/strategy-pack/blob/main/src/config/gridDefaultConfig.yaml#L11
     * @example
     * ```yaml
     * gridMergeStrategy: add
     * ```
     */
    gridMergeStrategy: GridMergeStrategy;
}

export type MakeRequired<T, K extends keyof T> = Omit<T, K> & {[P in K]-?: T[P]};

export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends Function
        ? T[K] // Keep functions but make them optional
        : T[K] extends Array<infer U>
          ? Array<DeepPartial<U>> // Recursively process array elements
          : T[K] extends object
            ? DeepPartial<T[K]> // Recursively process nested objects
            : T[K]; // Keep primitives as they are
};

export interface ManualConfigObject<T extends string, C> {
    type: T;
    config?: DeepPartial<C>;
}

export interface GridViewConfig<T extends string, C extends BaseGridOptions> extends ManualConfigObject<T, C> {}
