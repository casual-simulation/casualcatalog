if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] invoke`);
}


whisper(links.targetBot, 'onKeyboardBlur');
shout('onAnyKeyboardBlur', { targetBot: links.targetBot });

masks.targetBot = null;
masks.targetBotId = null;