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
    "finny": getLink(thisBot),
    "onSubmit": `@
        masks.menuItemText = ""; 
        links.finny.onSubmit({"text": "hey finny, " + that.text ?? null})`,
    "label": "chat with finny",
    "clearFinnyMenu": `@destroy(this)`,
    "finnyMenu": true
}

configBot.tags.menuPortal = "finnyMenu";

thisBot.vars.menuBot = await ab.links.menu.abCreateMenuInput(inputMenuBot);