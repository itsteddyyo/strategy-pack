import type {
  EntityRegistryDisplayEntry,
  EntityRegistryEntry,
} from "./entity_registry";

export interface DeviceRegistryEntry {
  id: string;
  config_entries: string[];
  connections: Array<[string, string]>;
  identifiers: Array<[string, string]>;
  manufacturer: string | null;
  model: string | null;
  name: string | null;
  labels: string[];
  sw_version: string | null;
  hw_version: string | null;
  serial_number: string | null;
  via_device_id: string | null;
  area_id: string | null;
  name_by_user: string | null;
  entry_type: "service" | null;
  disabled_by: "user" | "integration" | "config_entry" | null;
  configuration_url: string | null;
}

export interface DeviceEntityDisplayLookup {
  [deviceId: string]: EntityRegistryDisplayEntry[];
}

export interface DeviceEntityLookup {
  [deviceId: string]: EntityRegistryEntry[];
}

export interface DeviceRegistryEntryMutableParams {
  area_id?: string | null;
  name_by_user?: string | null;
  disabled_by?: string | null;
  labels?: string[];
}