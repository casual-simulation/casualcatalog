if (!globalThis.ab) {
    return;
}

if (thisBot.vars.billboardLabel) {
    destroy(thisBot.vars.billboardLabel);
    thisBot.vars.billboardLabel = null;
}

thisBot.vars.billboardLabel = ab.links.bot_factory.abCreateBillboardLabel({ bot: thisBot, dimension: 'home', label: tags.billboardLabel });