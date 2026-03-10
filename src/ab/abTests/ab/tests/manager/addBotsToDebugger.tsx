const d = that;
const testableBots = getBots(
    not(byTag('__test')),
    not(byTag('ab')),
    not(byTag('abID')),
    not(byID(getID(thisBot))),
    not(byTag('abTestTools')),
    not(bySpace('bootstrap'))
);

if (testableBots.length <= 0) {
    throw new Error('Unable to create test with no bots!');
}
for (let b of testableBots) {
    if (b.id === gridPortalBot.id || 
        b.id === configBot.id ||
        b.id === miniGridPortalBot.id ||
        b.id === mapPortalBot.id ||
        b.id === systemPortalBot.id ||
        b.id === sheetPortalBot.id ||
        b.id === tagPortalBot.id ||
        b.id === menuPortalBot.id ||
        b.id === idePortalBot.id ||
        b.id === meetPortalBot.id ||
        b.id === botPortalBot.id ||
        b.id === miniMapPortalBot.id ||
        b.id === leftWristPortalBot.id ||
        b.id === rightWristPortalBot.id) {
        continue;
    }

    let tags = Object.keys(b.tags);

    if (tags.length <= 0) {
        console.log('no tags!', b);
        continue;
    }
    await d.create(b, {
        __originalBotId: b.id
    });
}