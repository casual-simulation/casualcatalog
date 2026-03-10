const aiMessageArr = await thisBot.compileMessages();

if (!ab.links.console.masks.open) {
    whisper(ab.links.console, "showConsole");
    ab.links.console.masks.open = true;
}

thisBot.askNarrator(aiMessageArr);