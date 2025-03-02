import { LovelaceCardConfig } from "custom-card-helpers";

export const CUSTOM_ELEMENT_DASHBOARD = "ll-strategy-dashboard-";
export const CUSTOM_ELEMENT_VIEW = "ll-strategy-view-";

export enum FilterType {
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
     *   value:
     *     key: volume
     *     value: 100
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

export enum Comparator {
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
     *   value: .*_occupancy
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

export enum GridMergeStrategy {
    /**
     * @description
     * Add new grids to existing configuration. Edit existing configuration options by specifying gridId instead of id.
     */
    replace = "replace",
    /**
     * @description
     * Reset existing configuration when specifying own grids.
     */
    reset = "reset",
}

export interface FilterConfig {
    /**
     * @description
     * The type of filter to determine the value or just specify the filter
     * @example
     * type: state
     */
    type: FilterType;
    /**
     * @description
     * The comparator to use to compare the left value (the value in the entity described by the type) and the right value (the user specified value)
     * @example
     * comparator: equal
     */
    comparator?: Comparator;
    /**
     * @description
     * The user specified value
     * @example
     * value: on
     */
    value?: unknown;
}

export interface RowFilterConfig {
    /**
     * @description
     * Define include and exclude function for more fine-grained control of entities selected for row than only domain.
     * @remarks
     * A entity needs to match all include filters to be included but it needs only to match one of the exclude filters to be excluded!
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
    filter?: {
        exclude?: Array<FilterConfig>;
        include?: Array<FilterConfig>;
    };
    sort?: Array<unknown>;
}

export interface GridStrategyCardConfig {
    /**
     * @description
     * The cardConfig of the card that should be rendered for every entity in the grid. You can use all cards you would normally use in your dashboard!
     * @remarks
     * You can insert the entityId of the entity with the $entity variable which will be replaced in the whole object by the entities entity_id.
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

export interface BaseRowOptions extends RowFilterConfig, GridStrategyCardConfig {
    /**
     * @description
     * Id used for referencing grid
     * @example
     * ```yaml
     * id: test
     * ```
     */
    id: string;
    /**
     * @description
     * Title shown over the Grid
     * @example
     * ```yaml
     * title: Test
     * ```
     */
    title?: string;
    /**
     * @description
     * Position of the grid if there`s multiple. 0 if not specified.
     * @example
     * ```yaml
     * position: 1
     * ```
     */
    position?: number;
    /**
     * @description
     * Minimal Card Width in the Grid.
     * @defaultValue
     * <a href="https://github.com/itsteddyyo/strategy-pack/blob/main/src/config/areaDefaultConfig.yml#L1" target="_blank">set for area-dashboard-strategy</a><br />
     * <a href="https://github.com/itsteddyyo/strategy-pack/blob/main/src/config/gridDefaultConfig.yml#L1" target="_blank">set for all other strategies</a><br />
     * @example
     * ```yaml
     * minCardWidth: 300
     * ```
     */
    minCardWidth: number;
    /**
     * @description
     * You can set a card to be used for a specific entity. Overwrites default card config
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
     * Reference to existing grid
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
     * TODO
     * @defaultValue
     * <a href="https://github.com/itsteddyyo/strategy-pack/blob/main/src/config/areaDefaultConfig.yml#L1" target="_blank">set for area-dashboard-strategy</a><br />
     * <a href="https://github.com/itsteddyyo/strategy-pack/blob/main/src/config/gridDefaultConfig.yml#L1" target="_blank">set for all other strategies</a><br />
     * @example
     * ```yaml
     * minColumnWidth: 300
     * ```
     */
    global?: DeepPartial<BaseRowOptions>;
    /**
     * @description
     * TODO
     * @example
     * ```yaml
     * replaceCards:
     *   button.test:
     *     type: entity
     *     entities:
     *       - $entity
     * ```
     */
    grids: Array<T>;
    gridMergeStrategy: GridMergeStrategy;
}

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
