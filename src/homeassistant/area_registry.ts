import { DeviceRegistryEntry } from "./device_registry";
import { EntityRegistryEntry } from "./entity_registry";

export interface AreaRegistryEntry {
  area_id: string;
  floor_id: string | null;
  name: string;
  picture: string | null;
  icon: string | null;
  labels: string[];
  aliases: string[];
}

export interface AreaEntityLookup {
  [areaId: string]: EntityRegistryEntry[];
}

export interface AreaDeviceLookup {
  [areaId: string]: DeviceRegistryEntry[];
}

export interface AreaRegistryEntryMutableParams {
  name: string;
  floor_id?: string | null;
  picture?: string | null;
  icon?: string | null;
  aliases?: string[];
  labels?: string[];
}