const { targetBot } = that;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

assert(targetBot && targetBot.id && targetBot.tags, `[${tags.system}.${tagName}] targetBot is a required Bot parameter.`);

masks.targetBot = getLink(targetBot);
masks.targetBotId = targetBot.id;

whisper(links.targetBot, 'onKeyboardFocus');
shout('onAnyKeyboardFocus', { targetBot });
