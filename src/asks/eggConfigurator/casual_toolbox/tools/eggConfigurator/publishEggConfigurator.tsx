let dataResponse = await os.getData(tags.chosenStudio ?? authBot.id, tags.chosenEggName);

if (!dataResponse.success) {
    if(dataResponse.errorCode && dataResponse.errorCode == 'not_authorized') {
        await os.grantInstAdminPermission(tags.chosenStudio ?? authBot.id);
        dataResponse = await os.getData(tags.chosenStudio ?? authBot.id, tags.chosenEggName);
    }
}

if (!dataResponse.success) {
    //publish egg
    const tempBot = await create({
        space: "tempLocal",
        system: "temporary",
        abIgnore: true
    });
    const initPublish = await ab.links.store.abPublishAB({ab: tags.chosenEggName, target: tempBot, sourceEvent: 'empty_egg_config', studio: tags.chosenStudio ?? authBot.id});
    destroy(tempBot);
}

//setup menus
tags.eggConfigConfirmed = true;
thisBot.showEggSetupMenu();

thisBot.updateBillboardLabel();