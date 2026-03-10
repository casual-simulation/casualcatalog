// debug tool for resetting the rhetoric bot back to a starting state with the assistance of some helper bots
if (ab.links.console.masks.open) {
    whisper(ab.links.console, "hideConsole");
    ab.links.console.masks.open = null;
}

const menuPortal = configBot.tags.menuPortal ?? "menu";
masks[menuPortal] = false;