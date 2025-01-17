// Define growth function enums
export enum GrowthType {
    CONSTANT = "CONSTANT",
    LINEAR = "LINEAR",
    EXPONENTIAL = "EXPONENTIAL",
    LOGARITHMIC = "LOGARITHMIC",
    QUADRATIC = "QUADRATIC",
}

// Map growth functions to enums
export const growthFunctions: Record<GrowthType, (level: number, base: number) => number> = {
    [GrowthType.CONSTANT]: (_level, base) => base,
    [GrowthType.LINEAR]: (level, base) => base * level,
    [GrowthType.EXPONENTIAL]: (level, base) => base * 2 ** (level - 1),
    [GrowthType.LOGARITHMIC]: (level, base) => base * Math.log2(level + 1),
    [GrowthType.QUADRATIC]: (level, base) => base * level ** 2,
};
