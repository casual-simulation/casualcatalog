if (!links.abBot) {
    return;
}

if (links.input) {
    links.input.abChatBarClose();
}

const reset = that ? that.reset : false;
const menu = that ? that.menu : "core";
const state = os.getInputState("keyboard", "Shift");

if (!reset && (links.abBot.tags.interval || configBot.masks.menuPortal || state)) {
    const abMenuBots = getBots("abMenu", true);

    whisper(abMenuBots, "abMenuRefresh");

    clearInterval(links.abBot.tags.interval);

    links.abBot.masks.interval = null;

    clearAnimations(links.abBot);

    const rotZ = links.abBot.tags.dimension + "RotationZ";

    if (state && menu == "core") {
        links.menu.abEnvironmentMenu();
    }
    else {
        links.menu.abOpenMenu(menu);
    }

    animateTag(links.abBot, {
        fromValue: {
            [rotZ]: links.abBot.tags[rotZ]
        },
        toValue: {
            [rotZ]: 0
        },
        easing: {
            type: "sinusoidal",
            mode: "inout"
        },
        duration: 0.5
    }).catch(e => {})
}
else {
    links.abBot.animateBot();

    links.abBot.masks.lineTo = null;

    shout("abMenuRefresh");

    clearInterval(links.abBot.tags.interval);
    links.abBot.masks.interval = setInterval(() => links.abBot.animateBot(), links.abBot.tags.spinIntervalMS);
}

shout('onABClick', { abBot: links.abBot, dimension: links.abBot.tags.dimension, menu, shiftKey: !!state, reset });