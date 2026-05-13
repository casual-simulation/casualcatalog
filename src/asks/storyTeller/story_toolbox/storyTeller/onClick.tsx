const aiMessageArr = await thisBot.compileMessages();

if (!ab.links.console.masks.open) {
    whisper(ab.links.console, "showConsole");
}

thisBot.askNarrator(aiMessageArr);