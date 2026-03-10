const {
    dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal
} = that ?? {}

if (!dimension) {
    return;
}

shout("abMenuRefresh");
shout('clearAiKitAgentBotMenu');

configBot.tags.menuPortal = "ai_kit_bot_menu";

const menuOptions = {
    ai_kit_bot_menu: true,
    color: 'white',
}

const aiMenu = {
    onClick: `@`,
    ...menuOptions,
    groupSortOrder: 1,
    clearAiKitAgentBotMenu: `@destroy(this);`
}

const aiChatModels = configBot.tags.aiChatModels ?? [];

if (aiChatModels.length > 0) {
    const providerDropdowns = {};

    for (let i = 0; i < aiChatModels.length; ++i) {
        let dropdown = providerDropdowns[aiChatModels[i].provider];

        if (!dropdown) {
            dropdown = {
                menuItemType: "dropdown",
                label: aiChatModels[i].provider,
                dropdownOptions: []
            }

            providerDropdowns[aiChatModels[i].provider] = dropdown;
        }
        
        const option = {
            label: aiChatModels[i].name,
            aiProvider: aiChatModels[i].provider,
            aiModel: aiChatModels[i].name,
            color: 'white',
            botGen: await getLink(thisBot),
            dimension,
            onClick: `@
                links.botGen.createAIAgent({
                    dimension: tags.dimension,
                    aiModel: tags.aiModel,
                    aiProvider: tags.aiProvider
                });
            `,
        }

        dropdown.dropdownOptions.push(option);
    }

    const menuItems = [];
    for (let provider in providerDropdowns) {
        menuItems.push(providerDropdowns[provider]);
    }
    aiMenu["menuItems"] = menuItems;

    ab.links.menu.abCreateMenuGroup(aiMenu);
} else {
    if (authBot) {
        os.showAlert({
            title: 'something went wrong',
            content: 'failed to get list of ai chat models.'
        })
    } else {
        os.showAlert({
            title: 'sign in required',
            content: 'you must sign in to use ai.'
        })
    }
}

thisBot.animateSpin();