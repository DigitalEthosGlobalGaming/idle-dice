import { isArray } from "./is-array";

export function forceArray<T>(item: T | T[]): T[] {
  if (!isArray(item)) {
    return [item] as T[];
  }
  return item as T[];
}
