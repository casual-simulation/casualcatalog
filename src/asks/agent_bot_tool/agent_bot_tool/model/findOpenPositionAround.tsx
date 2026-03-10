const { 
    originPosition, 
    distance, 
    dimension,
    interval,
} = that;

assert(originPosition, `[${tags.system}.${tagName}] originPosition is a required parameter.`);
assert(distance > 0, `[${tags.system}.${tagName}] distance must be greater than zero.`);
assert(dimension, `[${tags.system}.${tagName}] dimension is a required parameter.`);
assert(interval > 0, `[${tags.system}.${tagName}] interval must be greater than zero.`);

const DEBUG = true;

// Helper to round to nearest interval (avoids floating point drift)
function roundTo(value: number, interval: number): number {
  return Math.round(value / interval) * interval;
}

function findOpenPosition(position: Vector2, distance: number, dimension: string, interval: number = 1): Vector2 | null {
    // Create a set of all occupied positions in the dimension.
    const occupied = new Set();

    // Round to avoid floating point mismatches when building the set
    const toKey = (x: number, y: number) => `${roundTo(x, interval)},${roundTo(y, interval)}`;

    // Create a set of all occupied positions in the dimensions.
    getBots((b) => {
        if (b.tags[dimension]) {
            const pos = getBotPosition(b, dimension);
            occupied.add(toKey(pos.x, pos.y));
        }
    });

    if (DEBUG) {
        console.log(`[${tags.system}.${tagName}] occupied:`, occupied);
    }

    // Calculate number of steps based on distance and interval
    const steps = Math.round(distance / interval);

    // Start from outer shell, work inward
    for (let d = steps; d >= 1; d--) {
        for (let xi = -d; xi <= d; xi++) {
            for (let yi = -d; yi <= d; yi++) {
                if (Math.abs(xi) === d || Math.abs(yi) === d) {
                    const x = roundTo(position.x + xi * interval, interval);
                    const y = roundTo(position.y + yi * interval, interval);
                    const key = toKey(x, y);
                    
                    if (DEBUG) {
                        console.log(`[${tags.system}.${tagName}] key:`, key);
                    }

                    if (!occupied.has(key)) {
                        if (DEBUG) {
                            console.log(`[${tags.system}.${tagName}] occupied does not have:`, key);
                        }
                        return new Vector2(x, y);
                    } else {
                        if (DEBUG) {
                            console.log(`[${tags.system}.${tagName}] occupied has:`, key);
                        }
                    }
                }
            }
        }
    }

    return null;
}

const openPosition = findOpenPosition(originPosition, distance, tags.dimension, 1);

if (DEBUG) {
    console.log(`[${tags.system}.${tagName}] openPosition:`, openPosition);
}

return openPosition;