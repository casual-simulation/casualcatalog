if (!tags.initialized)
{
    return;
}

const { bot } = that;

let isABBot = links.manifestation.links.abBot ? bot.id === links.manifestation.links.abBot.id : false;
let isMenuBot = bot.tags[configBot.tags.menuPortal] === true ? true : false;

if (globalThis.mainSceneBot && !isMenuBot && !isABBot && bot.tags.space == "shared") {
    const botInImmerse = bot.tags.immerse === true;
    const botInMainScene = bot.tags[mainSceneBot.tags.formAddress] === true;
    
    if (botInImmerse && !botInMainScene) 
    {
        thisBot.fromToDimension({ bot, from: 'immerse', to: mainSceneBot.tags.formAddress });
    }
}