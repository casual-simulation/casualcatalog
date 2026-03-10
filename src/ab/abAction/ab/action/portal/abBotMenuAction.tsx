
const selectedBot = links.remember.links.abBotFocus;

if (selectedBot) {
    const state = os.getInputState("keyboard", "Shift");

    if (state) {
        // Open sheet portal in new tab.
        os.openURL(configBot.tags.permalink + `&sheetPortal=${selectedBot.id}`);
    } else {
        configBot.tags.sheetPortal = selectedBot.id;
    }

    ab.log(links.personality.tags.abBuilderIdentity + ": opened bot sheet");
}
