import { LovelaceCardConfig } from "custom-card-helpers";

export const CUSTOM_ELEMENT_DASHBOARD = "ll-strategy-dashboard-"
export const CUSTOM_ELEMENT_VIEW = "ll-strategy-view-"

export enum FilterType {
    entity = "entity",
    domain = "domain",
    device = "device",
    area = "area",
    integration = "integration",
    label = "label",
    state = "state",
    attribute = "attribute"
}

export enum Comparator {
    equal = "equal",
    match = "match",
    in = "in",
    greater_than = "greater_than",
    lower_than = "lower_than",
    is_null = "is_null",
    is_numeric = "is_numeric"
}

export interface FilterConfig {
    type: FilterType;
    comparator?: Comparator;
    value?: unknown;
}

export interface RowFilterConfig {
    filter?: {
        exclude?: Array<FilterConfig>;
        include?: Array<FilterConfig>;
    };
}

export interface GridStrategyCardConfig {
    card: LovelaceCardConfig;
}

export interface UniversalStrategyOptions {
    minColumnWidth: number;
    replaceCards?: Record<string, GridStrategyCardConfig>;
}

export interface ManualConfigObject<T extends string, C> {
    type: T;
    config?: C;
}

export interface GridViewConfig<T extends string, C extends UniversalStrategyOptions> extends ManualConfigObject<T, C> { };

