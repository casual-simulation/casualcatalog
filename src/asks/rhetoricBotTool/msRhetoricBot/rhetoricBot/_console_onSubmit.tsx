if (!ab.links.console.masks.open) {
    whisper(ab.links.console, "showConsole");
    ab.links.console.masks.open = true;
}

let username = "user";

if (authBot && authBot.tags.name && authBot.tags.name != "") {
    username = authBot.tags.name;
} else if (ab.links.console.masks.preferredName) {
    username = ab.links.console.masks.preferredName;
} else {
    username = await os.showInput("", {
        title: "What would you like me to call you?"
    });
    ab.links.console.masks.preferredName = username;
}

masks.menuItemText = "";


ab.log({message: that.text, name: username, space: "shared", rbIgnoreMessage: that.rbIgnoreMessage, messageOrigin: configBot.id, rbProcessMessage: true});