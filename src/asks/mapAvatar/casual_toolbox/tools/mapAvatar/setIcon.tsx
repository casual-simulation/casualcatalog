let iconURL = that;
if (!that) {
    const link = '/ab/userIcons/';
    const icons = ["avatar_antelope_128.png", "avatar_bot_128.png", "avatar_bunny_128.png", "avatar_cat_128.png", "avatar_clownfish_128.png", "avatar_duck_128.png", "avatar_flamingo_128.png", "avatar_frog_128.png", "avatar_horse_128.png", "avatar_lion_128.png", "avatar_otter_128.png", "avatar_ox_128.png", "avatar_penguin_128.png", "avatar_polarbear_128.png"]

    const iconIndex = Math.floor(Math.random() * (icons.length));
    iconURL = await ab.abBuildCasualCatalogURL(link + icons[iconIndex]);
}

if (ab.links.personality.userIcon) {
    iconURL = ab.links.personality.userIcon;
}

tags.color = 'clear';
tags.strokeColor = null;

if (links.spriteBot) {
    destroy(links.spriteBot);
}

const spriteBot = await create({
    form: 'sprite',
    formAddress: iconURL,
    orientationMode: 'billboard',
    pointable: false,
    [tags.dimension]: true,
    anchorPoint: 'center',
    scale: 2,
    abIgnore: true,
    lineTo: thisBot.id,
    [tags.dimension + 'Z']: configBot.tags.mapPortal ? (tags[(tags.dimension ?? 'home') + 'Z'] ?? 0) + tags.scaleZ + 35 : (tags[(tags.dimension ?? 'home') + 'Z'] ?? 0) + tags.scaleZ - 1.5,
    [tags.dimension + 'X']: tags[tags.dimension + 'X'],
    [tags.dimension + 'Y']: tags[tags.dimension + 'Y']
})

links.spriteBot = getLink(spriteBot);