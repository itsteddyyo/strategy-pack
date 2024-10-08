import { castArray } from "lodash";

export const labelSort = (a: { labels: Array<string> }, b: { labels: Array<string> }) => {
    const labelToNumberArray = (labels: Array<string>) => {
        const arr = labels.filter((label) => label.startsWith("sort_")).map((label) => label.replace("sort_", "") as unknown as number);
        arr.push(Infinity);
        return arr;
    };
    const aSort = labelToNumberArray(a.labels || [])[0];
    const bSort = labelToNumberArray(b.labels || [])[0];
    return aSort - bSort;
};

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
