//thisBot.askAi(that.text);

if (!ab.links.console.masks.open) {
    whisper(ab.links.console, "showConsole");
    ab.links.console.masks.open = true;
}

const username = await ab.links.console.getUserName({ canSetPreferredName: true });

if (that.text && that.text[0] == ".") {
    ab.links.input.onChat({message: that.text});
    ab.log({message: that.text, name: username, space: "tempLocal"});
} else {
    ab.log({message: that.text, name: username, space: "tempLocal"});
}

shout("clearFinnyMenu");