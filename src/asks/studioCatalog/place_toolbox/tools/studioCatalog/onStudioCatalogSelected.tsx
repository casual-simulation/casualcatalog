if (tags.selected && that != thisBot) {
    masks.selected = null;
}

if (that == thisBot) {
    // Move kits
    const kitBots = getBots(byTag("abArtifactName", "kit"), byTag("lineTo", getID(thisBot)));

    // Stable order so each kit keeps the same slot across re-selections.
    kitBots.sort((a, b) => ((a.tags.label ?? a.id) + '').localeCompare((b.tags.label ?? b.id) + ''));

    const dimension = tags.dimension ?? configBot.tags.mapPortal ?? configBot.tags.gridPortal;
    const isMap = configBot.tags.mapPortal ? true : false;

    const center = new Vector2(tags[dimension + 'X'], tags[dimension + 'Y']);
    const count = kitBots.length;

    // Kits alternate between an inner and outer ring: even spacing, with strong
    // depth separation between neighbours to reduce occlusion under the angled
    // ortho camera.
    const baseRadius = isMap ? .0005 : 7;    // mid distance (and the odd kit's ring)
    const radiusSpread = isMap ? .0002 : 1;  // inner = base - spread, outer = base + spread

    // Below fullCircleAt, fan the kits across a partial arc in front of the
    // catalog — a few evenly-spaced kits read as a rigid polygon, a fan reads
    // natural. The arc widens with the count until it closes into a full circle
    // at the threshold. fanCenter is the direction the fan faces; flip it by
    // Math.PI if it opens away from the camera.
    const fullCircleAt = 9;
    const fanCenter = (Math.PI * 2);
    const isFullCircle = count >= fullCircleAt;
    const span = isFullCircle ? Math.PI * 2 : count * (Math.PI * 2 / fullCircleAt);

    const spacing = isMap ? .0005 : 1;

    const roundTo = (v: number) => Math.round(v / spacing) * spacing;
    const toKey = (x: number, y: number) => `${roundTo(x)},${roundTo(y)}`;

    // Track every occupied cell so kits never land on top of another bot.
    // Bots can be larger than one cell, so mark their whole footprint (derived
    // from scale), capped so a huge background bot can't blanket the grid.
    const maxFootprint = 5;
    const occupied = new Set();
    getBots((b) => {
        if (!b.tags[dimension]) return;
        const p = getBotPosition(b, dimension);
        const hx = isMap ? 0 : Math.min(maxFootprint, Math.floor((b.tags.scaleX ?? b.tags.scale ?? 1) / 2));
        const hy = isMap ? 0 : Math.min(maxFootprint, Math.floor((b.tags.scaleY ?? b.tags.scale ?? 1) / 2));
        for (let dx = -hx; dx <= hx; ++dx) {
            for (let dy = -hy; dy <= hy; ++dy) {
                occupied.add(toKey(p.x + dx * spacing, p.y + dy * spacing));
            }
        }
    });
    // The kits we're laying out are free to move, so release their cells first.
    for (const kit of kitBots) {
        const p = getBotPosition(kit, dimension);
        occupied.delete(toKey(p.x, p.y));
    }

    // Use the exact target when its cell is free (keeps the ring perfectly
    // uniform); otherwise snap outward to the nearest open grid cell.
    function findOpenCell(x: number, y: number): Vector2 {
        if (!occupied.has(toKey(x, y))) return new Vector2(x, y);
        for (let r = 1; r < 50; ++r) {
            for (let dx = -r; dx <= r; ++dx) {
                for (let dy = -r; dy <= r; ++dy) {
                    if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
                    const cx = roundTo(x + dx * spacing);
                    const cy = roundTo(y + dy * spacing);
                    if (!occupied.has(toKey(cx, cy))) return new Vector2(cx, cy);
                }
            }
        }
        return new Vector2(roundTo(x), roundTo(y));
    }

    for (let i = 0; i < count; ++i) {
        // Even angular spread across the (full or partial) arc, centred on the fan.
        const angle = fanCenter - span / 2 + (i + 0.5) * (span / count);
        // Alternate inner/outer. On a closed circle with an odd count, drop the
        // lone unpaired kit to the mid radius so the wrap is a smooth step
        // instead of two equal-length lines side by side; an open arc has no
        // wrap, so it just alternates.
        const radius = (isFullCircle && count % 2 === 1 && i === count - 1)
            ? baseRadius
            : baseRadius + (i % 2 === 0 ? -radiusSpread : radiusSpread);

        const pos = findOpenCell(center.x + Math.cos(angle) * radius, center.y + Math.sin(angle) * radius);

        occupied.add(toKey(pos.x, pos.y));
        kitBots[i].tags[dimension + 'X'] = pos.x;
        kitBots[i].tags[dimension + 'Y'] = pos.y;

        await os.sleep(0);
    }
}