const tools = tags.tools ?? [];

const menuItems = [
    // {
    //     label: "catalog",
    //     formAddress: "local_mall",
    //     onClick: ListenerString(() => {
    //         const abArtifactShard = {
    //             data: {
    //                 eggParameters: {
    //                     gridInformation: ab.links.remember.tags.abGridFocus
    //                 }
    //             },
    //             dependencies: [
    //                 {
    //                     askID: "studioCatalog"
    //                 }
    //             ]
    //         };
    //         ab.links.artifact.abCreateArtifactPromiseBot({
    //             abArtifactName: "studioCatalog",
    //             abArtifactInstanceID: uuid(),
    //             abArtifactShard,
    //         });

    //         const abBot = ab.links.manifestation.links.abBot;
    //         if (abBot && abBot.links.armBot) {
    //             destroy(abBot.links.armBot);
    //         }

    //         shout("abMenuRefresh");
    //     }),
    // },
];

if (Array.isArray(tools) && tools.length > 0) {
    const recentItems = await links.menu.abCreateToolboxDropdownOptions({
        toolboxName: "recent tools",
        toolArray: tools,
        gridInformation: that?.gridInformation,
    });
    menuItems.push(...recentItems);
}

setTagMask(thisBot, "menuItems", menuItems);
