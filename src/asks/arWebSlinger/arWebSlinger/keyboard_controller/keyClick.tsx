const { key, physical } = that;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

if (links.targetBot) {
    whisper(links.targetBot, 'onKeyboardClick', { key });
}

if (!physical) {
    ab.links.sound.abPlaySound({ value: tags.keyboardClickSound })
}

shout('onAnyKeyboardClick', { key, targetBot: links.targetBot });