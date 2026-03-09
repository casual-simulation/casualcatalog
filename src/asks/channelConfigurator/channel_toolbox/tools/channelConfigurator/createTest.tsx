const dimension = configBot.tags.mapPortal ? "map" : "grid";

let gridInfo;
if (dimension == "map") {
    gridInfo = {    
        "dimension":tags.dimension,
        "position":
            {
                "x":tags[tags.dimension + "X"] + ((Math.floor(Math.random() * 5) + 2) / 10000),
                "y":tags[tags.dimension + "Y"] + ((Math.floor(Math.random() * 5) + 2) / 10000)
            }
    }
} else {
    gridInfo = {
        "dimension":tags.dimension,
        "position":
            {
                "x":tags[tags.dimension + "X"] + Math.floor(Math.random() * 5) + 2,
                "y":tags[tags.dimension + "Y"] + Math.floor(Math.random() * 5) + 2
            }
    }
}

ab.links.search.onLookupAskID({
    askID: "instCreatorWizard",
    sourceEvent: 'tool',
    eggParameters: {
        gridInformation: gridInfo,
        initializationInfo: {
            pattern: null,
            studio: null,
            linkTo: thisBot.id,
            bios: 'local',
            instName: 'channel-redirect',
            label: tags.chosenChannelName,
            urlVariables: {
                channel: tags.chosenChannelName
            },
            completeOnLoad: true
        }
    },
});