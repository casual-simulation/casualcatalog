if (!ab.links.console.masks.open) {
    whisper(ab.links.console, "showConsole");
    ab.links.console.masks.open = true;
}

const username = await ab.links.console.getUserName({ canSetPreferredName: true });

masks.menuItemText = "";


ab.log({message: that.text, name: username, space: "shared", rbIgnoreMessage: that.rbIgnoreMessage, messageOrigin: configBot.id, rbProcessMessage: true});