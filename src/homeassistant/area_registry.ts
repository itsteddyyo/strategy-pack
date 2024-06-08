import { HomeAssistant } from "custom-card-helpers";
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

export const createAreaRegistryEntry = (
  hass: HomeAssistant,
  values: AreaRegistryEntryMutableParams
) =>
  hass.callWS<AreaRegistryEntry>({
    type: "config/area_registry/create",
    ...values,
  });

export const updateAreaRegistryEntry = (
  hass: HomeAssistant,
  areaId: string,
  updates: Partial<AreaRegistryEntryMutableParams>
) =>
  hass.callWS<AreaRegistryEntry>({
    type: "config/area_registry/update",
    area_id: areaId,
    ...updates,
  });

export const deleteAreaRegistryEntry = (hass: HomeAssistant, areaId: string) =>
  hass.callWS({
    type: "config/area_registry/delete",
    area_id: areaId,
  });

export const getAreaEntityLookup = (
  entities: EntityRegistryEntry[]
): AreaEntityLookup => {
  const areaEntityLookup: AreaEntityLookup = {};
  for (const entity of entities) {
    if (!entity.area_id) {
      continue;
    }
    if (!(entity.area_id in areaEntityLookup)) {
      areaEntityLookup[entity.area_id] = [];
    }
    areaEntityLookup[entity.area_id].push(entity);
  }
  return areaEntityLookup;
};

export const getAreaDeviceLookup = (
  devices: DeviceRegistryEntry[]
): AreaDeviceLookup => {
  const areaDeviceLookup: AreaDeviceLookup = {};
  for (const device of devices) {
    if (!device.area_id) {
      continue;
    }
    if (!(device.area_id in areaDeviceLookup)) {
      areaDeviceLookup[device.area_id] = [];
    }
    areaDeviceLookup[device.area_id].push(device);
  }
  return areaDeviceLookup;
};