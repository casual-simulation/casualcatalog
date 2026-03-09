if (!tags.initialized)
{
    return;
}

const dragBot = that.bot;

if (dragBot.tags.mainSceneHandlerObserving) {
    if (tags.debug) {
        console.log(`[${tags.system}] on handled bot dropped`);
    }

    dragBot.tags.mainSceneHandlerObserving = null;
    
    const botInHome = dragBot.tags.home === true;
    const botInMainScene = dragBot.tags[mainSceneBot.tags.formAddress] === true;

    if (botInHome && !botInMainScene) {
        // If a bot that was being handled somehow ends up in the home dimension, then move it back to the mainScene dimension.
        thisBot.fromToDimension({ bot: dragBot, from: 'home', to: mainSceneBot.tags.formAddress });
    }
}