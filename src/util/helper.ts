import { castArray } from "lodash";
import { DeepPartial } from "./types";
import typia from "typia";

export function notNil<T>(val: T | null | undefined): val is T {
    return val !== null && val !== undefined;
}

export function arrayCustomizer(objValue: unknown, srcValue: unknown) {
    if (Array.isArray(objValue) || Array.isArray(srcValue)) {
        const firstArray = castArray(objValue).filter(notNil);
        const secondArray = castArray(srcValue).filter(notNil);
        return firstArray.concat(secondArray);
    }
}
