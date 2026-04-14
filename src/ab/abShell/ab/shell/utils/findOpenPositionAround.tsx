const {
    dimension,
    center,
    radius = 5,
    direction = 'outward',
    spacing = 1,
} = that;

assert(center, `[${tags.system}.${tagName}] center is a required parameter.`);
assert(dimension, `[${tags.system}.${tagName}] dimension is a required parameter.`);
assert(radius > 0, `[${tags.system}.${tagName}] radius must be greater than zero.`);
assert(spacing > 0, `[${tags.system}.${tagName}] spacing must be greater than zero.`);
assert(direction === 'inward' || direction === 'outward', `[${tags.system}.${tagName}] direction must be 'inward' or 'outward'.`);

const DEBUG = true;

// Helper to round to nearest spacing (avoids floating point drift)
function roundTo(value: number, spacing: number): number {
  return Math.round(value / spacing) * spacing;
}

function findOpenPosition(position: Vector2, radius: number, dimension: string, spacing: number = 1, direction: 'inward' | 'outward' = 'outward'): Vector2 | null {
    // Create a set of all occupied positions in the dimension.
    const occupied = new Set();

    // Round to avoid floating point mismatches when building the set
    const toKey = (x: number, y: number) => `${roundTo(x, spacing)},${roundTo(y, spacing)}`;

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

    // Calculate number of steps based on radius and spacing
    const steps = Math.round(radius / spacing);

    // Collect all grid positions within the circular radius (excluding the origin itself)
    const candidates: Array<{xi: number, yi: number, dist: number}> = [];
    for (let xi = -steps; xi <= steps; xi++) {
        for (let yi = -steps; yi <= steps; yi++) {
            const dist = Math.sqrt(xi * xi + yi * yi);
            if (dist > 0 && dist <= steps) {
                candidates.push({ xi, yi, dist });
            }
        }
    }

    // Sort by Euclidean distance: outward = nearest first, inward = farthest first
    candidates.sort((a, b) => direction === 'outward' ? a.dist - b.dist : b.dist - a.dist);

    for (const { xi, yi } of candidates) {
        const x = roundTo(position.x + xi * spacing, spacing);
        const y = roundTo(position.y + yi * spacing, spacing);
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

    return null;
}

const openPosition = findOpenPosition(center, radius, tags.dimension, spacing, direction);

if (DEBUG) {
    console.log(`[${tags.system}.${tagName}] openPosition:`, openPosition);
}

return openPosition;