if (thisBot.vars.billboardLabelBot) {
    destroy(thisBot.vars.billboardLabelBot);
    thisBot.vars.billboardLabelBot = null;
}

thisBot.vars.billboardLabelBot = ab.links.bot_factory.abCreateBillboardLabel({ 
    bot: thisBot, 
    label: tags.studioHomeLabel,
    color: tags.studioHomeLabelFloatingBackgroundColor,
    dimension: configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? 'home',
    // botLabelMargin: 0,
    labelColor: tags.studioHomeLabelColor,
    space: 'tempLocal',
})