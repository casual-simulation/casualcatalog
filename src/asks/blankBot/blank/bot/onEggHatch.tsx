const gridInformation = {
    dimension: 'home',
    position: {
        x: 0,
        y: 0
    }
};

if (that.eggParameters) {
    const dimension = that.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = that.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = that.eggParameters.gridInformation?.position?.y ?? 0;

    gridInformation.dimension = dimension;
    gridInformation.position.x = dimensionX;
    gridInformation.position.y = dimensionY;
}

const newBot = create({
    creator: null,
    [gridInformation.dimension]: true,
    [gridInformation.dimension + "X"]: gridInformation.position.x,
    [gridInformation.dimension + "Y"]: gridInformation.position.y,
    color: links.personality.tags.abBaseColor,
    soundDrag: true,
    soundDrop: true,
});

ab.links.sound.abPlaySound({ value: ab.links.sound.tags.defaultCreateSound });

const newBotPosition = getBotPosition(newBot, gridInformation.dimension);

links.manifestation.abClick({ reset: true });

const armBot = ab.links.arm_tool.abCreateArm({
    originBot: links.manifestation.links.abBot,
    dimension: gridInformation.dimension,
    position: newBotPosition,
})

// Fake user selecting the bot with the arm.
armBot.onDrop({
    bot: armBot,
    to: {
        bot: newBot,
        x: newBotPosition.x,
        y: newBotPosition.y,
        z: newBotPosition.z,
        dimension: gridInformation.dimension
    },
    from: {
        x: newBotPosition.x,
        y: newBotPosition.y,
        z: newBotPosition.z,
        dimension: gridInformation.dimension
    }
});

if (!configBot.tags.blankBotDevMode) {
    destroy(thisBot);
}
