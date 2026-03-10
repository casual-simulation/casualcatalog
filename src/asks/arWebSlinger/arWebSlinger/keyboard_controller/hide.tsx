if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] invoke`);
}

if (links.keyboardBot) {
    destroy(links.keyboardBot);
    thisBot.blur();
}