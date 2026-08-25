const menuItems = [];

const activeMenu = configBot.tags.menuPortal;

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);

const copyButton = {
    ...menuOptions,
    label: `copy`,
    formAddress: "content_copy",
    onClick: ListenerString(() => {
        let selectedBots = [];

        if (ab.links.remember.links.abBotFocus) {
            selectedBots.push(ab.links.remember.links.abBotFocus);
        }
        else if (ab.links.remember.links.abMultipleBotFocus) {
            for (let i = 0; i < ab.links.remember.links.abMultipleBotFocus.length; i++) {
                selectedBots.push(ab.links.remember.links.abMultipleBotFocus[i]);
        }
        }
        links.skillBot.abCopyBotsToClipboard({bots: selectedBots}); 
    }),  
}

const duplicateButton = {
    ...menuOptions,
    label: `duplicate`,
    formAddress: "copy_all",
    onClick: ListenerString(() => {
        links.skillBot.handleDuplicate();
    }),  
}

menuItems.push(copyButton);
menuItems.push(duplicateButton);

masks.menuItems = menuItems;