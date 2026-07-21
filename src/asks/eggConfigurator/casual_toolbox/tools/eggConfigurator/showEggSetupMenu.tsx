shout('clearEggSetupMenu');

configBot.tags.menuPortal = 'eggSetupMenu';

const menuTags = {
    clearEggSetupMenu: `@destroy(thisBot);`,
    eggSetupMenu: true,
    eggConfigurator: getLink(thisBot)
}

// //EGG NAME
// const eggNameButton = {
//     ...menuTags,
//     label: tags.eggConfigConfirmed ? tags.chosenEggName : "egg name: " + (tags.chosenEggName || ''),
//     color: ab.links.personality.tags.abBaseMenuColor,
//     onClick: tags.eggConfigConfirmed ? null : `@
//         const instName = await os.showInput(links.eggConfigurator.tags.chosenEggName || "", {
//             title: 'choose a name for your egg'
//         });

//         links.eggConfigurator.tags.chosenEggName = instName;
//         links.eggConfigurator.tags.label = instName;
//         links.eggConfigurator.showEggSetupMenu();
//     `,
//     eggSetupMenuSortOrder: 1
// }

// //STUDIO
// const studioButton = {
//     ...menuTags,
//     label: "studio: " + (tags.chosenStudio ?? 'user'),
//     color: ab.links.personality.tags.abBaseMenuColor,
//     onClick: tags.eggConfigConfirmed ? null : `@
//         const studioName = await os.showInput(links.eggConfigurator.tags.chosenStudio || "", {
//             title: 'provide a studio'
//         });

//         links.eggConfigurator.tags.chosenStudio = studioName;
//         links.eggConfigurator.showEggSetupMenu();
//     `,
//     eggSetupMenuSortOrder: 2
// }

// //CREATE
// const createButton = {
//     ...menuTags,
//     label: "create egg",
//     formAddress: 'add',
//     onClick: `@
//         if (links.eggConfigurator.tags.chosenEggName) {
//             if (!links.eggConfigurator.tags.chosenStudio) {
//                 links.eggConfigurator.tags.chosenStudio = authBot.id;
//             }
//             links.eggConfigurator.publishEggConfigurator();
//         } else {
//             os.toast("You must provide an egg name");
//         }
//     `,
//     eggSetupMenuSortOrder: 10,
// }

// if (!tags.chosenEggName) {
//     createButton.menuItemStyle = {
//         filter: `brightness(50%)`
//     }
// }

// if (!tags.eggConfigConfirmed) {
//     ab.links.menu.abCreateMenuButton(eggNameButton);
//     ab.links.menu.abCreateMenuButton(studioButton);
//     ab.links.menu.abCreateMenuButton(createButton);
// } else {
    const catalog = getBot(byTag("studioCatalog", true), byTag("studioId", tags.studioId));
    if (catalog) {
        //PUBLISH CHANGES
        const publishButton = {
            ...menuTags,
            label: "publish current inst to egg",
            formAddress: 'publish',
            catalog: getLink(catalog),
            homeworld: tags.homeworld,
            onClick: `@
                if (links.eggConfigurator.tags.customSaveFunction && links.eggConfigurator.links.customSaveFunctionOrigin) {
                    whisper(links.eggConfigurator.links.customSaveFunctionOrigin, links.eggConfigurator.tags.customSaveFunction);
                } else {
                    shout("clearEggSetupMenu");
                    links.catalog.onStoreMenu({baseAB: links.eggConfigurator.tags.chosenEggName});
                }
            `,
            eggSetupMenuSortOrder: 11,
        }
        ab.links.menu.abCreateMenuButton(publishButton);
    }
// }
