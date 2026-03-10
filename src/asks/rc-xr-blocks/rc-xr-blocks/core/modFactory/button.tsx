const { 
    space= 'tempLocal',
    label = 'Button',
    onClick = `@os.toast('button clicked')`,
    dimension,
    dimensionX = 0,
    dimensionY = 0,
    dimensionZ = 0,
    onAdded,
} = that;

assert(dimension, '[button] dimension parameter is required');

const buttonMod = {
    space,
    label,
    onButtonClick: onClick,
    scaleX: 1.9,
    scaleY: 0.9,
    scaleZ: 0.3,
    draggable: false,
    [dimension]: true,
    [dimension + 'X']: dimensionX,
    [dimension + 'Y']: dimensionY,
    [dimension + 'Z']: dimensionZ,
    onAdded,
    onBotAdded: `@
        whisper(thisBot, 'onAdded');
    `,
    onClick: `@
        whisper(thisBot, 'onButtonClick');
        masks.color = null;
        masks.scaleZ = null;
    `,
    onPointerDown: `@
        masks.color = 'royalblue';
        masks.scaleZ = 0.1;
    `,
    onPointerUp: `@
        masks.scaleZ = null;
    `,
    onPointerEnter: `@
        masks.color = 'skyblue';
    `,
    onPointerExit: `@
        masks.color = null;
        masks.scaleZ = null;
    `,
}

return [ buttonMod ];