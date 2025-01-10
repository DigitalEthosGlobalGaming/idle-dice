export const easing = {
  easeOutElastic: (x: number): number => {
    const c4 = (2 * Math.PI) / 3;
    
    return x === 0
      ? 0
      : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  },
  diceRollEasing(t: number, steps: number): number {
    if (t < 0 || t > 1) {
      throw new Error("t must be between 0 and 1");
    }
    
    const easeOutExpo = (x: number) => 1 - Math.pow(2, -10 * x); // Ease out function for the slow-down effect
    
    // Apply the easing function
    const easedT = easeOutExpo(t);
    
    // Map easedT to the nearest step
    const stepIndex = Math.floor(easedT * steps);
    const normalizedStep = stepIndex / steps;
    
    return normalizedStep;
  }
}

export function ease<T extends keyof typeof easing>(type: T, ...args: Parameters<typeof easing[T]>): ReturnType<typeof easing[T]> {
  const easingFunction: any = easing[type];
  return easingFunction(...args);
}