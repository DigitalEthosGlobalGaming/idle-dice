
import { isString } from "./is-string";

/**
 * Generates a quick hash for a given string or object.
 *
 * @param str - The input string or object to hash. If the input is not a string,
 * it will be converted to a JSON string.
 * @returns The hash value as a number. Returns -1 if the input cannot be converted
 * to a string. Returns 0 if the input is null.
 */
export const quickHash = (str: any): number => {
  if (!isString(str)) {
    try {
      str = JSON.stringify(str);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return -1;
    }
  }
  let hash = 0;
  if (str == null) {
    return 0;
  }
  if (str.length === 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};


/**
 * Checks if the hash values of two objects are different.
 *
 * @param obj1 - The first object to compare.
 * @param obj2 - The second object to compare.
 * @returns `true` if the hash values of the two objects are different, `false` otherwise.
 */export const hashCheck = (obj1: any, obj2: any): boolean => {
  const hash1 = quickHash(obj1);
  const hash2 = quickHash(obj2);
  return hash1 != hash2;
};
