if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

shout('abMenuRefresh');

configBot.masks.menuPortal = null;
configBot.tags.menuPortal = 'home_place_menu';

const BASE_MENU_TAGS = {
    home_place_menu: true,
    clearHomePlaceMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    place: getLink(thisBot)
}

if (tags.studioId) {

    if (tags.abEquipmentBaseSelected) {
        return;
    }

    const shareButton = {
        ...BASE_MENU_TAGS,
        label: 'share',
        formAddress: 'ios_share',
        onClick: `@
            //shout('clearHomePlaceMenu');
            links.place.onStoreMenu();
        `
    };

    ab.links.menu.abCreateMenuButton(shareButton);

} else {

    //STUDIO CHOICE
    const studioGroup = {
        ...BASE_MENU_TAGS,
        label: 'which studio catalog?',
        dropdownSortOrder: 1,
        defaultOpen: true,
        dropdownOptions: []
    }

    const username = await ab.links.console.getUserName({ canSetPreferredName: false });

    studioGroup.dropdownOptions.push( {
        ...BASE_MENU_TAGS,
        label: 'user studio',
        formAddress: 'radio_button_unchecked',
        studioData: {
            studioId: authBot?.id,
            displayName: username ? username + "'s" : 'user studio'
        },
        onClick: `@
            ab.links.equipment.onEquipmentBaseSelected(links.place);
            links.place.setStudio(tags.studioData);
            shout('clearHomePlaceMenu');
        `
    })   

    let studioData = await os.listUserStudios();

    if (studioData.success) {
        const studios = studioData.studios;
        for (let i = 0; i < studios.length; ++i) {
            studioGroup.dropdownOptions.push( {
                ...BASE_MENU_TAGS,
                label: studios[i].displayName.toLocaleLowerCase(),
                studioData: studios[i],
                formAddress: 'radio_button_unchecked',
                onClick: `@
                    ab.links.equipment.onEquipmentBaseSelected(links.place);
                    links.place.setStudio(tags.studioData);
                    shout('clearHomePlaceMenu');
                `
            })
        }
    }
    ab.links.menu.abCreateMenuDropdown(studioGroup);
}