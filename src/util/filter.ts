import { HomeAssistant } from "custom-card-helpers";
import { FilterComparator, SortComparator, ValueType, RowFilterConfig, FilterConfig, RowSortConfig, TypeConfig, MakeRequired } from "./types";
import { EntityRegistryEntry } from "../homeassistant/entity_registry";
import { DeviceRegistryEntry } from "../homeassistant/device_registry";
import { AreaRegistryEntry } from "../homeassistant/area_registry";
import typia from "typia";

export const createRowFilter = (row: RowFilterConfig, hass: HomeAssistant) => {
    return (element: EntityRegistryEntry | AreaRegistryEntry) => {
        let ret = true;

        if (!!row.filter) {
            //custom include filter in row definition
            const include = row.filter?.include || new Array<FilterConfig>();
            ret = include.reduce((ret2, filter) => {
                if (!ret2) {
                    return false;
                }
                try {
                    const value = getValue(filter.type, element, filter.config, hass);
                    return compare(filter.comparator || FilterComparator.equal, value, filter.value);
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
                    const value = getValue(filter.type, element, filter.config, hass);
                    return !compare(filter.comparator || FilterComparator.equal, value, filter.value);
                } catch (e: unknown) {
                    console.error(e);
                    return false;
                }
            }, ret);
        }
        return ret;
    };
};

export const createRowSort = (row: RowSortConfig, hass: HomeAssistant) => {
    return (element1: EntityRegistryEntry | AreaRegistryEntry, element2: EntityRegistryEntry | AreaRegistryEntry) => {
        let ret = 0;
        if (!!row.sort) {
            row.sort.find((sort) => {
                const val1 = getValue(sort.type, element1, sort.config, hass);
                const val2 = getValue(sort.type, element2, sort.config, hass);
                ret = compare(sort.comparator || SortComparator.ascending, val1, val2);
                return ret;
            });
        }
        return ret;
    };
};

function isFilterComparator(value: FilterComparator | SortComparator): value is FilterComparator {
    //@ts-expect-error
    return Object.values(FilterComparator).includes(value);
}

function isSortComparator(value: FilterComparator | SortComparator): value is SortComparator {
    //@ts-expect-error
    return Object.values(SortComparator).includes(value);
}

export type FilterResult<T> = T extends FilterComparator ? boolean : number;

export const compare = <T extends FilterComparator | SortComparator = FilterComparator | SortComparator>(
    comparator: T,
    a: unknown,
    b: unknown,
): FilterResult<T> => {
    const a_number = parseFloat(a as string);
    const b_number = parseFloat(b as string);

    const a_string = String(a);
    const b_string = String(b);

    const [a_val, b_val] = isNaN(a_number) || isNaN(b_number) ? [a_string, b_string] : [a_number, b_number];

    if (isSortComparator(comparator)) {
        switch (comparator) {
            case SortComparator.ascending:
                if (a_val > b_val) {
                    return 1 as FilterResult<T>;
                }
                if (a_val < b_val) {
                    return -1 as FilterResult<T>;
                }
                return 0 as FilterResult<T>;
            case SortComparator.descending:
                if (a_val < b_val) {
                    return 1 as FilterResult<T>;
                }
                if (a_val > b_val) {
                    return -1 as FilterResult<T>;
                }
                return 0 as FilterResult<T>;
        }
    }

    if (isFilterComparator(comparator)) {
        switch (comparator) {
            case FilterComparator.equal:
                return (a == b) as FilterResult<T>;
            case FilterComparator.match:
                //null/undefined should not return true
                if (!a) return false as FilterResult<T>;
                return new RegExp(b_string).test(a_string) as FilterResult<T>;
            case FilterComparator.in:
                if (Array.isArray(b)) {
                    return b.includes(a) as FilterResult<T>;
                } else {
                    console.warn("Cannot compare. Value must be array.");
                    return false as FilterResult<T>;
                }
            case FilterComparator.greater_than:
                if (isNaN(a_number) || isNaN(b_number)) {
                    console.warn("Cannot compare. One or more values are not numeric");
                    return false as FilterResult<T>;
                } else {
                    return (a_number > b_number) as FilterResult<T>;
                }
            case FilterComparator.lower_than:
                if (isNaN(a_number) || isNaN(b_number)) {
                    console.warn("Cannot compare. One or more values are not numeric");
                    return false as FilterResult<T>;
                } else {
                    return (a_number < b_number) as FilterResult<T>;
                }
            case FilterComparator.is_null:
                return !!a as FilterResult<T>;
            case FilterComparator.is_numeric:
                return !isNaN(a_number) as FilterResult<T>;
        }
    }
    throw Error(`comparator '${comparator}' not implement`);
};

export const isArea = (element: EntityRegistryEntry | AreaRegistryEntry): element is AreaRegistryEntry => {
    return "floor_id" in element;
};

export const getValue = (
    valueType: ValueType,
    element: EntityRegistryEntry | AreaRegistryEntry,
    config: TypeConfig | undefined,
    hass: HomeAssistant,
): string | number | boolean | bigint | symbol | undefined => {
    switch (valueType) {
        case ValueType.entity:
            if (isArea(element)) throw Error(`valueType '${valueType}' not supported for areas`);
            const entityId = element.entity_id;
            return entityId;
        case ValueType.domain:
            if (isArea(element)) throw Error(`valueType '${valueType}' not supported for areas`);
            const domain = element.entity_id.split(".")[0];
            return domain;
        case ValueType.area:
            const device_area =
                !isArea(element) && !!element.device_id
                    ? ((hass as any).devices as Record<string, DeviceRegistryEntry>)[element.device_id]?.area_id
                    : undefined;
            const area = element.area_id || device_area;
            return area || undefined;
        case ValueType.device:
            if (isArea(element)) throw Error(`valueType '${valueType}' not supported for areas`);
            const deviceId = element.device_id;
            return deviceId || undefined;
        case ValueType.integration:
            if (isArea(element)) throw Error(`valueType '${valueType}' not supported for areas`);
            const integration = element.platform;
            return integration;
        case ValueType.label:
            const labels = element.labels;
            if (typia.is<MakeRequired<TypeConfig, "label">>(config)) {
                return labels.find((label) => new RegExp(config.label).test(label)) || undefined;
            } else {
                return undefined;
            }
        case ValueType.state:
            if (isArea(element)) throw Error(`valueType '${valueType}' not supported for areas`);
            const state = hass.states[element.entity_id]?.state;
            return state;
        case ValueType.attribute:
            if (isArea(element)) throw Error(`valueType '${valueType}' not supported for areas`);
            const attributes = hass.states[element.entity_id]?.attributes;

            if (typia.is<MakeRequired<TypeConfig, "key">>(config)) {
                if (!!attributes && attributes.hasOwnProperty(config.key)) {
                    return attributes[config.key];
                } else {
                    console.warn(`'${config.key}' does not exist on '${element.entity_id}'`);
                    return undefined;
                }
            } else {
                console.warn("value is not defined correctly");
                return undefined;
            }
        case ValueType.disabled_by:
            if (isArea(element)) throw Error(`valueType '${valueType}' not supported for areas`);
            const disabledBy = element.disabled_by;
            return disabledBy || undefined;
        case ValueType.hidden_by:
            if (isArea(element)) throw Error(`valueType '${valueType}' not supported for areas`);
            const hiddenBy = element.hidden_by;
            return hiddenBy || undefined;
        case ValueType.entity_category:
            if (isArea(element)) throw Error(`valueType '${valueType}' not supported for areas`);
            const entityCategory = element.entity_category;
            return entityCategory || undefined;
    }
};
