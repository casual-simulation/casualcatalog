const {
    dimension,             // Dimension to search within; only bots tagged with it count as occupied.
    center,                // Vector2 the annular search is centered on.
    radius = 5,            // Outer search radius (inclusive), in tiles.
    innerRadius = 0,       // Inner search radius (exclusive); tiles at/inside it are skipped.
    direction = 'outward', // 'outward' tries the nearest ring first, 'inward' the farthest.
    spacing = 1,           // Grid step between candidate tiles.
    randomizeAngle = false,// Randomize where the per-ring angular sweep starts (ignored if a prefer angle is set).
    preferToward = null,   // Vector2 to bias toward: rings are searched starting from the angle center→preferToward.
    preferAngle = null,    // Explicit bias angle in radians; takes precedence over preferToward.
} = that;

assert(center, `[${tags.system}.${tagName}] center is a required parameter.`);
assert(dimension, `[${tags.system}.${tagName}] dimension is a required parameter.`);
assert(radius > 0, `[${tags.system}.${tagName}] radius must be greater than zero.`);
assert(innerRadius >= 0, `[${tags.system}.${tagName}] innerRadius must be greater than or equal to zero.`);
assert(innerRadius < radius, `[${tags.system}.${tagName}] innerRadius must be less than radius.`);
assert(spacing > 0, `[${tags.system}.${tagName}] spacing must be greater than zero.`);
assert(direction === 'inward' || direction === 'outward', `[${tags.system}.${tagName}] direction must be 'inward' or 'outward'.`);

const DEBUG = false;

// Helper to round to nearest spacing (avoids floating point drift)
function roundTo(value: number, spacing: number): number {
  return Math.round(value / spacing) * spacing;
}

function findOpenPosition(position: Vector2, radius: number, innerRadius: number, dimension: string, spacing: number = 1, direction: 'inward' | 'outward' = 'outward', randomizeAngle: boolean = false, preferredAngle: number | null = null): Vector2 | null {
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
    const innerSteps = Math.round(innerRadius / spacing);

    // Collect all grid positions within the annular search area
    const candidates: Array<{xi: number, yi: number, dist: number}> = [];
    for (let xi = -steps; xi <= steps; xi++) {
        for (let yi = -steps; yi <= steps; yi++) {
            const dist = Math.sqrt(xi * xi + yi * yi);
            if (dist > innerSteps && dist <= steps) {
                candidates.push({ xi, yi, dist });
            }
        }
    }

    // Pick a random angle offset once before sorting (avoid calling Math.random inside comparator)
    const angleOffset = randomizeAngle ? Math.random() * Math.PI * 2 : 0;

    // Smallest absolute difference between two angles, wrapped into [0, PI].
    const angularDistance = (a: number, b: number) => {
        const d = Math.abs(a - b) % (Math.PI * 2);
        return d > Math.PI ? Math.PI * 2 - d : d;
    };

    // Sort by distance (respecting direction). Within each ring, when a preferred angle
    // is given (e.g. the direction the requesting bot is approaching from), order tiles by
    // how close their angle is to it so the search starts on that side and fans outward —
    // yielding the natural shortest-path spot. Otherwise fall back to absolute angle order.
    candidates.sort((a, b) => {
        const distDiff = direction === 'outward' ? a.dist - b.dist : b.dist - a.dist;
        if (distDiff !== 0) return distDiff;
        if (preferredAngle !== null) {
            const da = angularDistance(Math.atan2(a.yi, a.xi), preferredAngle);
            const db = angularDistance(Math.atan2(b.yi, b.xi), preferredAngle);
            return da - db;
        }
        const angleA = (Math.atan2(a.yi, a.xi) + angleOffset + Math.PI * 2) % (Math.PI * 2);
        const angleB = (Math.atan2(b.yi, b.xi) + angleOffset + Math.PI * 2) % (Math.PI * 2);
        return angleA - angleB;
    });

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

// Resolve the optional search bias: an explicit preferAngle (radians) wins, otherwise
// derive the angle from center toward preferToward (the requesting bot's position).
let preferredAngle: number | null = null;
if (typeof preferAngle === 'number') {
    preferredAngle = preferAngle;
} else if (preferToward) {
    preferredAngle = Math.atan2(preferToward.y - center.y, preferToward.x - center.x);
}

const openPosition = findOpenPosition(center, radius, innerRadius, dimension, spacing, direction, randomizeAngle, preferredAngle);

if (DEBUG) {
    console.log(`[${tags.system}.${tagName}] openPosition:`, openPosition);
}

return openPosition;