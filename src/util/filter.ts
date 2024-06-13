import { HomeAssistant } from "custom-card-helpers";
import { EntityRegistryEntry } from "../homeassistant/entity_registry";
import { Comparator, FilterType } from "./types";

export const hiddenFilter = (entity: EntityRegistryEntry) => {
    return !entity.disabled_by && !entity.hidden_by;
}

export const compare = (comparator: Comparator, a: unknown, b: unknown) => {
    const a_number = parseFloat(a as string);
    const b_number = parseFloat(b as string);
    switch (comparator) {
        case Comparator.equal:
            return a == b;
        case Comparator.in:
            if (Array.isArray(b)) {
                return b.includes(a);
            } else {
                throw Error("Cannot compare. Value must be array.")
            }
        case Comparator.greater_than:
            if (isNaN(a_number) || isNaN(b_number)) {
                throw Error("Cannot compare. One or more values are not numeric")
            } else {
                return a_number > b_number
            }
        case Comparator.lower_than:
            if (isNaN(a_number) || isNaN(b_number)) {
                throw Error("Cannot compare. One or more values are not numeric")
            } else {
                return a_number < b_number
            }
        case Comparator.is_null:
            return !!a;
        case Comparator.is_numeric:
            return !isNaN(a_number);
    }
};

export const filterValue: Record<FilterType, (entity: EntityRegistryEntry, hass: HomeAssistant, value: unknown, comparator: Comparator) => boolean> = {
    entity: (entity, hass, value, comparator) => {
        const entityId = entity.entity_id
        return compare(comparator, entityId, value);
    },
    domain: (entity, hass, value, comparator) => {
        const domain = entity.entity_id.split(".")[0];
        return compare(comparator, domain, value);
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
        return labels.map(label => compare(comparator, label, value)).indexOf(true) > 0;
    },
    state: (entity, hass, value, comparator) => {
        const state = hass.states[entity.entity_id]?.state;
        return compare(comparator, state, value);
    },
    attribute: (entity, hass, value, comparator) => {
        const attributes = hass.states[entity.entity_id]?.attributes;
        const isValueFormat = (val: unknown): val is { key: string | number; value: unknown; } => {
            return !!value && typeof value === 'object' && value.hasOwnProperty('key') && value.hasOwnProperty('value');
        }
        if (isValueFormat(value)) {
            return compare(comparator, attributes[value.key], value.value);
        } else {
            throw Error("value is not defined correctly");
        }
    },
}