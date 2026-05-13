if (!ab.links.console.masks.open) {
    whisper(ab.links.console, "showConsole");
}

let username = tags.name;

masks.menuItemText = "";

if (that.publicMessage == true) {
    ab.log({message: that.message, name: username, space: "shared", rbProcessMessage: true, messageOrigin: configBot.id});
} else {
    ab.links.input.onChat({message: that.message});
    ab.log({message: that.message, name: username, space: "tempLocal", rbProcessMessage: true, messageOrigin: configBot.id});
}