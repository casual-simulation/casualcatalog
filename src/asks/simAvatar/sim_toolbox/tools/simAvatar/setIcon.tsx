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
    transformer: getID(thisBot),
    [tags.dimension]: true,
    anchorPoint: 'center',
    [tags.dimension + 'Z']: -.5
})

links.spriteBot = getLink(spriteBot);