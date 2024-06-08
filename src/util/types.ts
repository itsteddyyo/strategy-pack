import { LovelaceCardConfig, LovelaceViewConfig } from "custom-card-helpers";
import { EntityRegistryEntry } from "../homeassistant/entity_registry"
import { DeviceRegistryEntry } from "../homeassistant/device_registry"
import { AreaRegistryEntry } from "../homeassistant/area_registry"

export const CUSTOM_ELEMENT_DASHBOARD = "ll-strategy-dashboard-"
export const CUSTOM_ELEMENT_VIEW = "ll-strategy-view-"

export enum FilterType {
    state = "state", domain = "domain", attribute = "attribute"
}

export enum Comparator {
    equal, greater_than, is_null, is_numeric
}

export interface FilterConfig {
    type: FilterType; //TODO enum
    comparator?: Comparator; //TODO enum is_numeric
    value?: unknown;
}

export interface AreaStrategyCardConfig {
    entityAttribute: string;
    entityAttributeAsList: boolean
    card: LovelaceCardConfig;
}

export interface RowConfig extends AreaStrategyCardConfig {
    domain: string | Array<string>;
    title?: string;
    filter?: {
        exclude?: Array<FilterConfig>;
        include?: Array<FilterConfig>;
    };
}

export interface TabConfig {
    label: string;
    icon: string;
    rows: Array<RowConfig>;
}

export interface AreaStrategyOptions {
    tabs: Array<TabConfig>;
    areaColor: Array<string>;
    topCards?: Array<LovelaceCardConfig>;
    replaceCards?: Record<string, AreaStrategyCardConfig>;
}

export interface DashboardConfig {
    type: "custom:area-dashboard-strategy";
    options?: AreaStrategyOptions;
    views?: Array<LovelaceViewConfig>;
}

export interface ViewConfig {
    type: "custom:area-view-strategy";
    area: AreaRegistryEntry;
    devices: Array<DeviceRegistryEntry>;
    entities: Array<EntityRegistryEntry>;
    areas: Array<AreaRegistryEntry>;
    options: AreaStrategyOptions;
}

export interface AreaStrategyViewConfig extends LovelaceViewConfig {
    strategy: ViewConfig;
}