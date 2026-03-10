shout("clearABBasemapOptionsMenu");

shout("abMenuRefresh");
configBot.tags.menuPortal = 'abBasemapOptionsMenu';

for (const option of tags.mapOptions) {
    if (option.id == mapPortalBot.tags.mapPortalBasemap) {
        continue;
    }
    const optionObj = 
    {
        abBasemapOptionsMenu: true,
        clearABBasemapOptionsMenu: `@destroy(thisBot);`,
        mapID: option.id,
        label: option.name,
        onClick: `@
            mapPortalBot.tags.mapPortalBasemap = tags.mapID;
            shout('abPersonalityChange', { abMapPortalBase: tags.mapID}); 
            shout("clearABBasemapOptionsMenu");
        `
    }

    ab.links.menu.abCreateMenuButton(optionObj);
}