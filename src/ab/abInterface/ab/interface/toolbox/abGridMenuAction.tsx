// shout("abMenuRefresh");

// configBot.masks.menuPortal = "abMenu";

// thisBot.masks.onGridClick = `@
//     shout('abMenuRefresh');
//     links.manifestation.abClick({ reset: true });
// `;
// thisBot.masks.onKeyDown = `@
//     if (that.keys.includes('Escape')) {
//         shout('abMenuRefresh');
//         links.manifestation.abClick({ reset: true });
//     }
// `;
// thisBot.masks.abMenuRefresh = `@
//     thisBot.masks.onGridClick = null;
//     thisBot.masks.onKeyDown = null;
//     thisBot.masks.abMenuRefresh = null;
// `;

// const possibleToolboxes = links.remember.tags.toolbox_array;
// const menuBot = {};

// menuBot.abMenu = true;
// menuBot.abMenuRefresh = "@ destroy(thisBot);";
// menuBot.gridData = links.remember.tags.abGridFocus;
// menuBot.manager = getLink(thisBot);
// menuBot.formAddress = "add_box";
// menuBot.manifestation = tags.manifestation;
// menuBot.onClick = `@ links.manager.toolbox_add({toolboxData: tags.toolbox_data, gridData: tags.gridData}); shout("abMenuRefresh");`;

// for (let i = 0; i < possibleToolboxes.length; i++)
// {
//     const activeToolbox = possibleToolboxes[i];
//     const extantBot = activeToolbox.studio ? getBot("abIDOrigin", activeToolbox.name): getBot(activeToolbox.name, true);

//     menuBot.toolbox_data = activeToolbox;
//     menuBot.label = activeToolbox.title ?? activeToolbox.name;

//     if (!extantBot)
//     {
//         links.menu.abCreateMenuButton(menuBot);
//     }
// }

const abArtifactShard = {
    data: {
        eggParameters: {
            gridInformation: links.remember.tags.abGridFocus
        }
    },
    dependencies: [
        {
            askID: "studioCatalog"
        }
    ]
};
ab.links.artifact.abCreateArtifactPromiseBot({
    abArtifactName: "studioCatalog",
    abArtifactInstanceID: uuid(),
    abArtifactShard,
});

shout("abMenuRefresh");
