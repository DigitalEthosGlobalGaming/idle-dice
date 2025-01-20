export function isArray<T>(variable: any): variable is T[] {
    return Array.isArray(variable);
}
