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

const abArtifactShard = {
    data: {
        biosSetting: 'local',
        patternSetting: null,
        studioSetting: null,
        instSetting: 'channel-redirect',
        originType: 'channelConfigurator',
        studioId: tags.studioId,
        labelSetting: tags.chosenChannelName,
        label: tags.chosenChannelName,
        urlVariables: {
            channel: tags.chosenChannelName
        },
        eggParameters: {
            gridInformation: gridInfo
        }
    },
    dependencies: [
        {
            askID: 'instBot'
        }
    ]
};
ab.links.artifact.abCreateArtifactPromiseBot({
    abArtifactName: 'instBot',
    abArtifactInstanceID: uuid(),
    abArtifactShard,
});