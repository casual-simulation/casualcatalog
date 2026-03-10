//thisBot.askAi(that.text);

if (!ab.links.console.masks.open) {
    whisper(ab.links.console, "showConsole");
    ab.links.console.masks.open = true;
}

let username = "user";

if (authBot && authBot.tags.name) {
    username = authBot.tags.name;
} else if (ab.links.console.masks.preferredName) {
    username = ab.links.console.masks.preferredName;
} else {
    username = await os.showInput("", {
        title: "What would you like me to call you?"
    });
    ab.links.console.masks.preferredName = username;
}

if (that.text && that.text[0] == ".") {
    ab.links.input.onChat({message: that.text});
    ab.log({message: that.text, name: username, space: "tempLocal"});
} else {
    ab.log({message: that.text, name: username, space: "tempLocal"});
}

shout("clearFinnyMenu");