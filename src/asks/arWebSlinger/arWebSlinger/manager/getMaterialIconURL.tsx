const { 
    iconName,
    style = 'filled' // 'filled', 'outlined', 'round', 'sharp', 'two-tone'
} = that;

if (iconName === 'cube') {
    // Hardcoded icon supported by CasualOS.
    return 'https://cdn.jsdelivr.net/gh/casual-simulation/casualos@latest/src/aux-components/icons/Cube.svg';
} else if (iconName === 'egg') {
    // Hardcoded icon supported by CasualOS.
    return 'https://cdn.jsdelivr.net/gh/casual-simulation/casualos@latest/src/aux-components/icons/Egg.svg';
} else if (iconName === 'helix') {
    // Hardcoded icon supported by CasualOS.
    return 'https://cdn.jsdelivr.net/gh/casual-simulation/casualos@latest/src/aux-components/icons/Helix.svg';
} else {
    // Map style names to package directory names
    const styleMap = {
        'filled': 'filled',
        'outlined': 'outlined',
        'round': 'round',
        'sharp': 'sharp',
        'twotone': 'two-tone',
        'two-tone': 'two-tone'
    };

    const iconStyle = styleMap[style] ?? 'filled';

    // Using jsDelivr CDN for @material-design-icons/svg (auto-updated, latest icons)
    // [SLOP] We should not use a google CDN for this but instead our own repository (casual catalog).
    const url = `https://cdn.jsdelivr.net/npm/@material-design-icons/svg@latest/${iconStyle}/${iconName}.svg`;

    return url;
}