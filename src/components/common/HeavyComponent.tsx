/**
 * Don't change this file
 */
export const HeavyComponent = () => {
    const start = performance.now();
    while (performance.now() - start < 1) {
        // Do nothing
    }
    return null;
};
