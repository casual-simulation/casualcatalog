tags.name = "chat bot " + String(thisBot.id).substring(0, 4);
tags.label = "cb " + String(thisBot.id).substring(0, 4);

if (that.eggParameters) {
    const dimension = that.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = that.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = that.eggParameters.gridInformation?.position?.y ?? 0;

    tags[dimension] = true;
    tags[dimension + 'X'] = dimensionX;
    tags[dimension + 'Y'] = dimensionY;
    tags.fgFX = dimensionX;
    tags.fgFY = dimensionY;
    tags.fgFZ = 0;
}

await os.sleep(500);

configBot.tags.menuPortal = "rbMenu";
configBot.tags.mapPortal ? tags.hideMemory = true : null;

// if (links.brainLink == null) {
//     thisBot.importFGB();
//     masks.abMenu = null;
// }
// else {
//     thisBot.openABConsole();
// }

if (!getBot(byTag("system", "tools.chatBot.chatBot"))) {
    const dim = configBot.tags.gridPortal;
    const dimX = tags[dim + "X"];
    const dimY = tags[dim + "Y"];

    ab.links.search.onLookupAskID({
        askID: "chatBotTool",
        eggParameters: {
            toolboxBot: tags.toolbox ?? "",
            gridInformation: {
                dimension: dim ?? "home",
                position: {
                    x: dimX ? dimX + 2 : 2,
                    y: dimY ?? 0
                }
            },
        },
    })
}

thisBot._fg_importForceGraph();
// abRemember.tags.abGridSnapState = false;

// ab.links.search.onLookupAskID({askID: "chatBotTool"})