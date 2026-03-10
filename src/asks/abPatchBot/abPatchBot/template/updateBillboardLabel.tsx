if (thisBot.vars.billboardLabelBot) {
    destroy(thisBot.vars.billboardLabelBot);
    thisBot.vars.billboardLabelBot = null;
}

const currentDimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;
const botInDimension = currentDimension && thisBot.tags[currentDimension] === true;

if (botInDimension) {
    thisBot.vars.billboardLabelBot = ab.links.bot_factory.abCreateBillboardLabel({ 
        bot: thisBot,
        label: tags.abPatchLabel,
        labelColor: tags.abPatchLabelColor,
        color: tags.abPatchLabelBackgroundColor,
        dimension: currentDimension,
        space: 'tempLocal',
    })
}

