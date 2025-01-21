let prototypeMaps: { [key: string]: boolean } = {};

export function isOfClassType(obj: any, t: new () => unknown): boolean {
    if (obj == null) {
        return false;
    }

    const key = obj.constructor.name + "-" + t.name;

    if (prototypeMaps[key] != null) {
        return prototypeMaps[key];
    } else {
        prototypeMaps[key] = false;
    }

    if (obj.constructor.name == t.name || obj.constroct) {
        prototypeMaps[key] = true;
        return true;
    }
    const parentConstructor = obj?.__proto__?.constructor?.__proto__?.name;
    if (parentConstructor == null) {
        return false;
    }
    if (parentConstructor == t.name) {
        prototypeMaps[key] = true;
        return true;
    }

    if (isOfClassType(obj?.__proto__?.constructor, t)) {
        prototypeMaps[key] = true;
        return true;
    }
    return false;
}
