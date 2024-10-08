import { HomeAssistant } from "custom-card-helpers";
import { EntityRegistryEntry } from "../homeassistant/entity_registry";
import { Comparator, FilterType, RowFilterConfig } from "./types";
import { DeviceRegistryEntry } from "../homeassistant/device_registry";

export const createRowFilter = (row: RowFilterConfig, hass: HomeAssistant) => {
    return (entity: EntityRegistryEntry) => {
        let ret = true;

        if (!!row.filter) {
            //custom include filter in row definition
            const include = row.filter?.include || [];
            ret = include.reduce((ret2, filter) => {
                if (!ret2) {
                    return false;
                }
                try {
                    return filterValue[filter.type](entity, hass, filter.value, filter.comparator || Comparator.equal);
                } catch (e: unknown) {
                    console.error(e);
                    return false;
                }
            }, ret);
            //custom exclude filter in row definition
            const exclude = row.filter?.exclude || [];
            ret = exclude.reduce((ret2, filter) => {
                if (!ret2) {
                    return false;
                }
                try {
                    return !filterValue[filter.type](entity, hass, filter.value, filter.comparator || Comparator.equal);
                } catch (e: unknown) {
                    console.error(e);
                    return false;
                }
            }, ret);
        }
        return ret;
    };
};

export const compare = (comparator: Comparator, a: unknown, b: unknown) => {
    const a_number = parseFloat(a as string);
    const b_number = parseFloat(b as string);

    const a_string = String(a);
    const b_string = String(b);

    switch (comparator) {
        case Comparator.equal:
            return a == b;
        case Comparator.match:
            //null/undefined should not return true
            if (!a) return false;
            return new RegExp(b_string).test(a_string);
        case Comparator.in:
            if (Array.isArray(b)) {
                return b.includes(a);
            } else {
                console.warn("Cannot compare. Value must be array.");
                return false;
            }
        case Comparator.greater_than:
            if (isNaN(a_number) || isNaN(b_number)) {
                console.warn("Cannot compare. One or more values are not numeric");
                return false;
            } else {
                return a_number > b_number;
            }
        case Comparator.lower_than:
            if (isNaN(a_number) || isNaN(b_number)) {
                console.warn("Cannot compare. One or more values are not numeric");
                return false;
            } else {
                return a_number < b_number;
            }
        case Comparator.is_null:
            return !!a;
        case Comparator.is_numeric:
            return !isNaN(a_number);
    }
};

export const filterValue: Record<FilterType, (entity: EntityRegistryEntry, hass: HomeAssistant, value: unknown, comparator: Comparator) => boolean> =
    {
        entity: (entity, hass, value, comparator) => {
            const entityId = entity.entity_id;
            return compare(comparator, entityId, value);
        },
        domain: (entity, hass, value, comparator) => {
            const domain = entity.entity_id.split(".")[0];
            return compare(comparator, domain, value);
        },
        area: (entity, hass, value, comparator) => {
            const device_area = !!entity.device_id ? ((hass as any).devices as Record<string, DeviceRegistryEntry>)[entity.device_id]?.area_id : null;
            const area = entity.area_id || device_area;
            return compare(comparator, area, value);
        },
        device: (entity, hass, value, comparator) => {
            const deviceId = entity.device_id;
            return compare(comparator, deviceId, value);
        },
        integration: (entity, hass, value, comparator) => {
            const integration = entity.platform;
            return compare(comparator, integration, value);
        },
        label: (entity, hass, value, comparator) => {
            const labels = entity.labels;
            return labels.map((label) => compare(comparator, label, value)).indexOf(true) > 0;
        },
        state: (entity, hass, value, comparator) => {
            const state = hass.states[entity.entity_id]?.state;
            return compare(comparator, state, value);
        },
        attribute: (entity, hass, value, comparator) => {
            const attributes = hass.states[entity.entity_id]?.attributes;
            const isValueFormat = (val: unknown): val is { key: string | number; value: unknown } => {
                return !!value && typeof value === "object" && value.hasOwnProperty("key") && value.hasOwnProperty("value");
            };
            if (isValueFormat(value)) {
                if (!!attributes && attributes.hasOwnProperty(value.key)) {
                    return compare(comparator, attributes[value.key], value.value);
                } else {
                    console.warn(`${value.key} does not exist on ${entity.entity_id}`);
                    return false;
                }
            } else {
                console.warn("value is not defined correctly");
                return false;
            }
        },
        disabled_by: (entity, hass, value, comparator) => {
            const disabledBy = entity.disabled_by;
            return compare(comparator, disabledBy, value);
        },
        hidden_by: (entity, hass, value, comparator) => {
            const hiddenBy = entity.hidden_by;
            return compare(comparator, hiddenBy, value);
        },
        entity_category: (entity, hass, value, comparator) => {
            const entityCategory = entity.entity_category;
            return compare(comparator, entityCategory, value);
        },
    };
