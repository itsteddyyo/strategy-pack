import { LovelaceCardConfig, LovelaceViewConfig } from "custom-card-helpers";
import { EntityRegistryEntry } from "../homeassistant/entity_registry"
import { DeviceRegistryEntry } from "../homeassistant/device_registry"
import { AreaRegistryEntry } from "../homeassistant/area_registry"

export const CUSTOM_ELEMENT_DASHBOARD = "ll-strategy-dashboard-"
export const CUSTOM_ELEMENT_VIEW = "ll-strategy-view-"

export enum FilterType {
    entity = "entity",
    domain = "domain",
    device = "device",
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

export interface AreaStrategyCardConfig {
    card: LovelaceCardConfig;
}

export interface RowFilterConfig {
    filter?: {
        exclude?: Array<FilterConfig>;
        include?: Array<FilterConfig>;
    };
}

export interface RowConfig extends AreaStrategyCardConfig, RowFilterConfig {
    domain: string | Array<string>;
    title?: string;
}

export interface TabConfig {
    label: string;
    icon: string;
    rows: Array<RowConfig>;
}

export interface UniversalStrategyOptions {
    minColumnWidth: number;
    replaceCards?: Record<string, AreaStrategyCardConfig>;
}

export interface AreaStrategyOptions extends UniversalStrategyOptions {
    tabs: Array<TabConfig>;
    areaColors: Array<string>;
    areaCardConfig: Exclude<LovelaceCardConfig, "type">;
    areaBlacklist?: Array<string>;
    topCards?: Array<LovelaceCardConfig>;
    extraViews?: Array<LovelaceViewConfig>;
}

export interface ManualConfigObject<T extends string, C> {
    type: T;
    config?: C;
}

export interface GridViewConfig<T extends string, C extends UniversalStrategyOptions> extends ManualConfigObject<T, C> { };

export interface AreaDashboardConfig extends ManualConfigObject<"custom:area-dashboard-strategy", AreaStrategyOptions> { }

export interface AreaViewConfig extends ManualConfigObject<"custom:area-view-strategy", AreaStrategyOptions & { area: string; }> {
    meta?: {
        devices: Array<DeviceRegistryEntry>;
        entities: Array<EntityRegistryEntry>;
        areas: Array<AreaRegistryEntry>;
    }
}

export interface HomeAssistantConfigAreaStrategyView extends LovelaceViewConfig {
    strategy: AreaViewConfig;
}