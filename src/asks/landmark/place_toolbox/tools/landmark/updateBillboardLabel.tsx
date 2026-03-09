if (thisBot.vars.billboardLabelBot) {
    destroy(thisBot.vars.billboardLabelBot);
    thisBot.vars.billboardLabelBot = null;
}

thisBot.vars.billboardLabelBot = ab.links.bot_factory.abCreateBillboardLabel({ 
    bot: thisBot, 
    label: tags.placeLabel,
    color: tags.placeLabelFloatingBackgroundColor,
    dimension: tags.dimension ?? 'home',
    // botLabelMargin: 0,
    labelColor: tags.placeLabelColor,
    space: 'tempLocal',
})