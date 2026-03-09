shout('clearStudioHomeConfigMenu');

configBot.masks.menuPortal = 'studioHomeConfigMenu';

const mainButton = {
    clearStudioHomeConfigMenu: `@destroy(thisBot);`,
    studioHomeConfigMenu: true,
    label: "choose a studio",
    wizard: getLink(thisBot),
    dropdownSortOrder: 1,
    dropdownOptions: [],
    defaultOpen: true
}

const studios = await os.listUserStudios();

if (!studios.success) {
    console.log("Could not list user studios");
    os.toast("No user studios found");
    return;
}

for (const studio of studios.studios) {
    const studButton = {
            label: studio.displayName,
            studioId: studio.studioId,
            clearStudioHomeConfigMenu: `@destroy(thisBot);`,
            studioHomeConfigMenu: true,
            wizard: getLink(thisBot),
            onClick: `@
                links.wizard.createStudioBot({id: tags.studioId, label: tags.label});
                shout('clearStudioHomeConfigMenu');
            `
        }
    mainButton.dropdownOptions.push(studButton);
}

if (studios.studios?.length == 0) {
    const noStudioButton = {
        clearStudioHomeConfigMenu: `@destroy(thisBot);`,
        studioHomeConfigMenu: true,
        label: "could not find any studios",
        wizard: getLink(thisBot),
        studioHomeConfigMenuSortOrder: 1,
        onClick: `@
            destroy(links.wizard);
            destroy(thisBot);`
    }

    ab.links.menu.abCreateMenuButton(noStudioButton);
} else {
    ab.links.menu.abCreateMenuDropdown(mainButton);
}
