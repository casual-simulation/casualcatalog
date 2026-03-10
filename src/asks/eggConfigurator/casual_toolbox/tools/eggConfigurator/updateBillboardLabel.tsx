if (thisBot.vars.billboardLabelBot) {
    destroy(thisBot.vars.billboardLabelBot);
    thisBot.vars.billboardLabelBot = null;
}

if (tags.chosenEggName && authBot && tags.eggConfigConfirmed) {
    let dataResponse = await os.getData(tags.chosenStudio ?? authBot.id, tags.chosenEggName);

    if (!dataResponse.success) {
        if(dataResponse.errorCode && dataResponse.errorCode == 'not_authorized') {
            await os.grantInstAdminPermission(tags.chosenStudio ?? authBot.id);
            dataResponse = await os.getData(tags.chosenStudio ?? authBot.id, tags.chosenEggName);
        }
    }

    if (dataResponse.success) {
        tags.eggSetupLabel = tags.chosenEggName + ' v' + dataResponse.data.maxVersion;
        tags.maxEggVersion = dataResponse.data.maxVersion;
    }
}

thisBot.vars.billboardLabelBot = ab.links.bot_factory.abCreateBillboardLabel({ 
    bot: thisBot, 
    label: tags.eggSetupLabel,
    color: tags.eggSetupLabelFloatingBackgroundColor,
    dimension: tags.dimension,
    // botLabelMargin: 0,
    labelColor: tags.eggSetupLabelColor,
    space: 'tempLocal',
})