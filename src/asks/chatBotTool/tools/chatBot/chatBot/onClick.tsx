//If console is not open, open console
if (!ab.links.console.masks.open) {
    whisper(ab.links.console, "showConsole");
    ab.links.console.masks.open = true;
}

if (thisBot.vars.menuBot) {
    destroy(thisBot.vars.menuBot);
    thisBot.vars.menuBot = null;
}

const inputMenuBot = {
    "chatBar": getLink(thisBot),
    "onSubmit": `@
        masks.menuItemText = ""; 
        links.chatBar.onSubmit({"text": that.text ?? null})`,
    "color": "white",
    "onDestroy": `@
        const currentDim = await os.getCurrentDimension();
        setTagMask(links.chatBar, currentDim, true);
    `,
    "label": "chat with everyone"
}

let menuPortal = configBot.tags.menuPortal ?? "chatBarMenu";

if (!configBot.tags.menuPortal)
{
    configBot.tags.menuPortal = menuPortal;
}

inputMenuBot[menuPortal] = true;
inputMenuBot[menuPortal + "SortOrder"] = 10000;

thisBot.vars.menuBot = await ab.links.menu.abCreateMenuInput(inputMenuBot);

//const menuPortal = configBot.tags.menuPortal ?? "menu";

masks[os.getCurrentDimension()] = false;