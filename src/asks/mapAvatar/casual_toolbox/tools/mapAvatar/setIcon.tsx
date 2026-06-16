let iconChoice = that;
if (!that) {
    const icons = ["antelope", "bot", "bunny", "cat", "clownfish", "duck", "flamingo", "frog", "horse", "lion", "otter", "ox", "penguin", "polarbear"]

    const iconIndex = Math.floor(Math.random() * (icons.length));
    iconChoice = icons[iconIndex];
}

if (ab.links.personality.userIcon) {
    iconChoice = ab.links.personality.userIcon;
}

tags.formAnimation = iconChoice;

// tags.color = 'clear';
// tags.strokeColor = null;

// if (links.spriteBot) {
//     destroy(links.spriteBot);
// }

// const spriteBot = await create({
//     form: 'sprite',
//     formAddress: iconURL,
//     orientationMode: 'billboard',
//     pointable: false,
//     [tags.dimension]: true,
//     anchorPoint: 'center',
//     scale: 2,
//     abIgnore: true,
//     lineTo: thisBot.id,
//     [tags.dimension + 'Z']: configBot.tags.mapPortal ? (tags[(tags.dimension ?? 'home') + 'Z'] ?? 0) + tags.scaleZ + 35 : (tags[(tags.dimension ?? 'home') + 'Z'] ?? 0) + tags.scaleZ - 1.5,
//     [tags.dimension + 'X']: tags[tags.dimension + 'X'],
//     [tags.dimension + 'Y']: tags[tags.dimension + 'Y']
// })

// links.spriteBot = getLink(spriteBot);