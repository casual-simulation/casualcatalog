
let copyText;
try {
    copyText = await navigator.clipboard.readText();
} catch (err) {
    console.error("Failed to read rich data:", err);
}

const menuItems = [];

const activeMenu = configBot.tags.menuPortal;

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);

const copy = {
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
        links.skillBot.abCopyBotsToClipboard(selectedBots);
    }),  
}

const paste = {
    ...menuOptions,
    label: `paste`,
    copyText: copyText,
    formAddress: "content_paste",
    onClick: ListenerString(() => {
       links.skillBot.onPaste({text: tags.copyText})
    }),  
}

menuItems.push(copy);

if (copyText) {
   menuItems.push(paste); 
}

masks.menuItems = menuItems;