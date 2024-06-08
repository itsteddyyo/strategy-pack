import { HomeAssistant } from "custom-card-helpers";
import { EntityRegistryEntry } from "../homeassistant/entity_registry";
import { Comparator, FilterType } from "./types";

export const hiddenFilter = (entity: EntityRegistryEntry) => {
    return !entity.disabled_by && !entity.hidden_by;
}

export const compare = (comparator: Comparator, a: unknown, b: unknown) => {
    switch (comparator) {
        case Comparator.equal:
            return a == b;
        case Comparator.greater_than:
            if (typeof a !== 'number' || typeof b !== 'number') {
                throw Error("Cannot compare. One or more values are not numeric")
            } else {
                return a > b
            }
        case Comparator.is_null:
            return !!a;
        case Comparator.is_numeric:
            return typeof a === 'number'
    }
};

export const filterValue: Record<FilterType, (entity: EntityRegistryEntry, hass: HomeAssistant, value: unknown, comparator: Comparator) => boolean> = {
    state: (entity, hass, value, comparator) => {
        const state = hass.states[entity.entity_id]?.state;
        return compare(comparator, state, value);
    },
    domain: (entity, hass, value, comparator) => {
        const domain = entity.entity_id.split(".")[0];
        return compare(comparator, domain, value);
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