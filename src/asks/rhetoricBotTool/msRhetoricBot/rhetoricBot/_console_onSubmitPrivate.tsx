if (!ab.links.console.masks.open) {
    whisper(ab.links.console, "showConsole");
    ab.links.console.masks.open = true;
}

const username = await ab.links.console.getUserName({ canSetPreferredName: true });

masks.menuItemText = "";

ab.links.input.onChat({ message: that.text, rbIgnoreMessage: that.rbIgnoreMessage, messageOrigin: configBot.id, rbProcessMessage: true });
ab.log({ message: that.text, name: username, space: "tempLocal", rbIgnoreMessage: that.rbIgnoreMessage, messageOrigin: configBot.id, rbProcessMessage: true });