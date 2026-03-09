console.log("importing msForceGraphTool")

// const forceGraphToolBot = getBot(byTag('abIDOrigin', 'msForceGraphTool'))
const forceGraphToolBot = getBot(byTag("system", "ms-forceGraph.init"))

console.log("forceGraphTool bot found: ", !!forceGraphToolBot, forceGraphToolBot);

if (!forceGraphToolBot) {
    // await shout("hatch", {abID: "msForceGraphTool", recordKey: "6db28ddc-1835-4fb4-8ed3-5ccf26c02217", autoHatch: true, eggParameters: {defaultBots: false, abIgnore: true}});

    ab.links.search.onLookupAskID({
        askID: "fgTool",
        eggParameters: {
            toolboxBot: tags.toolbox ?? "",
            gridInformation: tags.gridInformation,
            defaultBots: false
        },
    })
}