let THREE = thisBot.vars.THREE;
if (!THREE) {
    THREE = await import('three');
    thisBot.vars.THREE = THREE;
}

function getContrastColor(color: string): string {
    const c = new THREE.Color(color);
    const luminance = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
    return luminance > 0.5 ? 'black' : 'white';
}

return getContrastColor(that);