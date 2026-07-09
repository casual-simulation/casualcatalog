return ( {
    label: `wake ${abPersonality.tags.abBuilderIdentity}`,
    formAddress: 'alarm',
    onClick: `@
        const avatar = getBot(byTag("mapAvatar", true), byTag("ownerID", authBot.id));
        const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;
        const inMap = configBot.tags.mapPortal ? true : false;

        if (avatar) {
            let posX = avatar.tags[dimension + 'X'];
            let posY = avatar.tags[dimension + 'Y'];

            let offset = inMap ? .0003 : 3;

            ab.links.manifestation.abSetAwake({awake: true, position: {x: posX + offset, y: posY - offset}});
        } else {
            ab.links.manifestation.abSetAwake({awake: true});
        }
        
        shout("abMenuRefresh");
    `
})