if (!ab.links.console.masks.open) {
    whisper(ab.links.console, "showConsole");
    ab.links.console.masks.open = true;
}

const menuPortal = configBot.tags.menuPortal ?? "rbInput";

if (!configBot.tags.menuPortal)
{
    configBot.tags.menuPortal = menuPortal;
}

configBot.tags.menuPortal = "rbChatMenu";