let THREE = thisBot.vars.THREE;
if (!THREE) {
    THREE = await import('three');
    thisBot.vars.THREE = THREE;
}

function resolveColor(color: string): { r: number; g: number; b: number } {
    const c = new THREE.Color(color);
    return {
        r: Math.round(c.r * 255),
        g: Math.round(c.g * 255),
        b: Math.round(c.b * 255),
    };
}

function adjustBrightness({ color, factor }: { color: string; factor: number }): string {
    const { r, g, b } = resolveColor(color.trim());

    const ar = Math.min(255, Math.max(0, Math.round(r * factor)));
    const ag = Math.min(255, Math.max(0, Math.round(g * factor)));
    const ab = Math.min(255, Math.max(0, Math.round(b * factor)));

    const toHex = (c: number) => c.toString(16).padStart(2, '0');
    return '#' + toHex(ar) + toHex(ag) + toHex(ab);
}

return adjustBrightness(that);