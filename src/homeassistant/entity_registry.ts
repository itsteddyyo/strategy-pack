type LightColor = unknown;
type EntityCategory = "config" | "diagnostic";

export interface EntityRegistryDisplayEntry {
    entity_id: string;
    name?: string;
    icon?: string;
    device_id?: string;
    area_id?: string;
    labels: string[];
    hidden?: boolean;
    entity_category?: EntityCategory;
    translation_key?: string;
    platform?: string;
    display_precision?: number;
}

export interface EntityRegistryDisplayEntryResponse {
    entities: {
        ei: string;
        di?: string;
        ai?: string;
        lb: string[];
        ec?: number;
        en?: string;
        ic?: string;
        pl?: string;
        tk?: string;
        hb?: boolean;
        dp?: number;
    }[];
    entity_categories: Record<number, EntityCategory>;
}

export interface EntityRegistryEntry {
    id: string;
    entity_id: string;
    name: string | null;
    icon: string | null;
    platform: string;
    config_entry_id: string | null;
    device_id: string | null;
    area_id: string | null;
    labels: string[];
    disabled_by: "user" | "device" | "integration" | "config_entry" | null;
    hidden_by: Exclude<EntityRegistryEntry["disabled_by"], "config_entry">;
    entity_category: EntityCategory | null;
    has_entity_name: boolean;
    original_name?: string;
    unique_id: string;
    translation_key?: string;
    options: EntityRegistryOptions | null;
    categories: { [scope: string]: string };
}

export interface ExtEntityRegistryEntry extends EntityRegistryEntry {
    capabilities: Record<string, unknown>;
    original_icon?: string;
    device_class?: string;
    original_device_class?: string;
    aliases: string[];
}

export interface UpdateEntityRegistryEntryResult {
    entity_entry: ExtEntityRegistryEntry;
    reload_delay?: number;
    require_restart?: boolean;
}

export interface SensorEntityOptions {
    display_precision?: number | null;
    suggested_display_precision?: number | null;
    unit_of_measurement?: string | null;
}

export interface LightEntityOptions {
    favorite_colors?: LightColor[];
}

export interface NumberEntityOptions {
    unit_of_measurement?: string | null;
}

export interface LockEntityOptions {
    default_code?: string | null;
}

export interface AlarmControlPanelEntityOptions {
    default_code?: string | null;
}

export interface WeatherEntityOptions {
    precipitation_unit?: string | null;
    pressure_unit?: string | null;
    temperature_unit?: string | null;
    visibility_unit?: string | null;
    wind_speed_unit?: string | null;
}

export interface SwitchAsXEntityOptions {
    entity_id: string;
    invert: boolean;
}

export interface EntityRegistryOptions {
    number?: NumberEntityOptions;
    sensor?: SensorEntityOptions;
    alarm_control_panel?: AlarmControlPanelEntityOptions;
    lock?: LockEntityOptions;
    weather?: WeatherEntityOptions;
    light?: LightEntityOptions;
    switch_as_x?: SwitchAsXEntityOptions;
    conversation?: Record<string, unknown>;
    "cloud.alexa"?: Record<string, unknown>;
    "cloud.google_assistant"?: Record<string, unknown>;
}

export interface EntityRegistryEntryUpdateParams {
    name?: string | null;
    icon?: string | null;
    device_class?: string | null;
    area_id?: string | null;
    disabled_by?: string | null;
    hidden_by: string | null;
    new_entity_id?: string;
    options_domain?: string;
    options?:
        | SensorEntityOptions
        | NumberEntityOptions
        | LockEntityOptions
        | AlarmControlPanelEntityOptions
        | WeatherEntityOptions
        | LightEntityOptions;
    aliases?: string[];
    labels?: string[];
    categories?: { [scope: string]: string | null };
}
