//that
//bot?
//position?
//text
//dimension?
//scale?
//color?
//space?
//fontSize?
//wrapMode?

const currentDim = that.dimension ?? links.remember.tags.abActiveDimension ?? 'home';

let posX;
let posY;
let posZ;



if (that.bot) {
    posX = that.bot.tags[currentDim + 'X'];
    posY = that.bot.tags[currentDim + 'Y'];
    posZ = that.bot.tags[currentDim + 'Z'] ?? 0;
} else if (that.position) {
    posX = that.position.x;
    posY = that.position.y;
    posZ = that.position.z ?? 1;
}

if ((!posX && posX != 0) || (!posY && posY != 0)) {
    return;
}

const cueBot = await create({
    space: that.space ?? 'tempLocal',
    label: that.text ?? '',
    labelColor: that.color ?? "white",
    scale: that.scale ?? '.5',
    [currentDim]: true,
    [currentDim + 'X']: posX,
    [currentDim + 'Y']: posY,
    [currentDim + 'Z']: posZ,
    color: 'clear',
    labelOpacity: 1,
    labelWordWrapMode: that.wrapMode ?? 'breakWords',
    labelFontSize: that.fontSize ?? undefined,
    labelPosition: 'floatingBillboard',
    labelFloatingBackgroundColor: 'clear',
    pointable: false,
    onBotAdded: `@
        await animateTag(thisBot, {
            fromValue: {
                ['${currentDim}' + 'Z']: ${posZ},
                labelOpacity: 1
            },
            toValue: {
                ['${currentDim}' + 'Z']: ${posZ} + 3,
                labelOpacity: 0
            },
            duration: 2,
            tagMaskSpace: false
        })
        destroy(thisBot);
    `
})