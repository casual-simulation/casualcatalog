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

const linkID = uuid();

ab.links.search.onLookupAskID({
    askID: "instCreatorWizard",
    sourceEvent: 'tool',
    eggParameters: {
        gridInformation: gridInfo,
        initializationInfo: {
            studio: tags.chosenStudio,
            linkTo: thisBot.id,
            bios: 'free',
            label: tags.bbLabel + " id:" + linkID,
            urlVariables: {
                uuid: linkID,
                ask: tags.chosenPattern
            },
            completeOnLoad: true
        }
    },
});