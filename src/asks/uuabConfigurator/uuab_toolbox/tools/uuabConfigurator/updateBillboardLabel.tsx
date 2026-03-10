if (thisBot.vars.billboardLabelBot) {
    destroy(thisBot.vars.billboardLabelBot);
    thisBot.vars.billboardLabelBot = null;
}

thisBot.vars.billboardLabelBot = ab.links.bot_factory.abCreateBillboardLabel({ 
    bot: thisBot, 
    label: tags.uuabSetupLabel,
    color: tags.uuabSetupLabelFloatingBackgroundColor,
    dimension: tags.dimension,
    // botLabelMargin: 0,
    labelColor: tags.uuabSetupLabelColor,
    space: 'tempLocal',
})