configBot.tags.menuPortal = "channelWizardMenu";

const channelCreatorMenu = {
    "channelWizardMenu": true,
    "clearChannelWizardMenu": `@destroy(thisBot);`,
    "label": "create channel",
    "channelWizard": await getLink(thisBot),
    "onClick": `@   
        shout("clearChannelWizardMenu");
        links.channelWizard.initializeChannelMenu();
    `
}

const channelEditorMenu = {
    "channelWizardMenu": true,
    "clearChannelWizardMenu": `@destroy(thisBot);`,
    "label": "edit channel",
    "channelWizard": await getLink(thisBot),
    "onClick": `@   
        shout("clearChannelWizardMenu");
        links.channelWizard.editChannel();
    `
}

links.menu.abCreateMenuButton(channelCreatorMenu);
links.menu.abCreateMenuButton(channelEditorMenu);