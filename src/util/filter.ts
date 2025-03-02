import { HomeAssistant } from "custom-card-helpers";
import { Comparator, FilterType, RowFilterConfig } from "./types";
import { EntityRegistryEntry } from "../homeassistant/entity_registry";
import { DeviceRegistryEntry } from "../homeassistant/device_registry";
import { AreaRegistryEntry } from "../homeassistant/area_registry";

export const createRowFilter = (row: RowFilterConfig, hass: HomeAssistant) => {
    return (element: EntityRegistryEntry | AreaRegistryEntry) => {
        let ret = true;

        if (!!row.filter) {
            //custom include filter in row definition
            const include = row.filter?.include || [];
            ret = include.reduce((ret2, filter) => {
                if (!ret2) {
                    return false;
                }
                try {
                    return filterValue[filter.type](element, hass, filter.value, filter.comparator || Comparator.equal);
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
                    return !filterValue[filter.type](element, hass, filter.value, filter.comparator || Comparator.equal);
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

export const isArea = (element: EntityRegistryEntry | AreaRegistryEntry): element is AreaRegistryEntry => {
    return "floor_id" in element;
};

export const filterValue: Record<
    FilterType,
    (element: EntityRegistryEntry | AreaRegistryEntry, hass: HomeAssistant, value: unknown, comparator: Comparator) => boolean
> = {
    entity: (element, hass, value, comparator) => {
        if (isArea(element)) throw Error("filter 'entity' not supported for areas");
        const entityId = element.entity_id;
        return compare(comparator, entityId, value);
    },
    domain: (element, hass, value, comparator) => {
        if (isArea(element)) throw Error("filter 'domain' not supported for areas");
        const domain = element.entity_id.split(".")[0];
        return compare(comparator, domain, value);
    },
    area: (element, hass, value, comparator) => {
        if (isArea(element)) throw Error("filter 'area' not supported for areas");
        const device_area = !!element.device_id ? ((hass as any).devices as Record<string, DeviceRegistryEntry>)[element.device_id]?.area_id : null;
        const area = element.area_id || device_area;
        return compare(comparator, area, value);
    },
    device: (element, hass, value, comparator) => {
        if (isArea(element)) throw Error("filter 'device' not supported for areas");
        const deviceId = element.device_id;
        return compare(comparator, deviceId, value);
    },
    integration: (element, hass, value, comparator) => {
        if (isArea(element)) throw Error("filter 'integration' not supported for areas");
        const integration = element.platform;
        return compare(comparator, integration, value);
    },
    label: (element, hass, value, comparator) => {
        const labels = element.labels;
        return labels.map((label) => compare(comparator, label, value)).indexOf(true) > -1;
    },
    state: (element, hass, value, comparator) => {
        if (isArea(element)) throw Error("filter 'state' not supported for areas");
        const state = hass.states[element.entity_id]?.state;
        return compare(comparator, state, value);
    },
    attribute: (element, hass, value, comparator) => {
        if (isArea(element)) throw Error("filter 'attribute' not supported for areas");
        const attributes = hass.states[element.entity_id]?.attributes;
        const isValueFormat = (val: unknown): val is { key: string | number; value: unknown } => {
            return !!value && typeof value === "object" && value.hasOwnProperty("key") && value.hasOwnProperty("value");
        };
        if (isValueFormat(value)) {
            if (!!attributes && attributes.hasOwnProperty(value.key)) {
                return compare(comparator, attributes[value.key], value.value);
            } else {
                console.warn(`${value.key} does not exist on ${element.entity_id}`);
                return false;
            }
        } else {
            console.warn("value is not defined correctly");
            return false;
        }
    },
    disabled_by: (element, hass, value, comparator) => {
        if (isArea(element)) throw Error("filter 'disabled_by' not supported for areas");
        const disabledBy = element.disabled_by;
        return compare(comparator, disabledBy, value);
    },
    hidden_by: (element, hass, value, comparator) => {
        if (isArea(element)) throw Error("filter 'hidden_by' not supported for areas");
        const hiddenBy = element.hidden_by;
        return compare(comparator, hiddenBy, value);
    },
    entity_category: (element, hass, value, comparator) => {
        if (isArea(element)) throw Error("filter 'entity_category' not supported for areas");
        const entityCategory = element.entity_category;
        return compare(comparator, entityCategory, value);
    },
};
