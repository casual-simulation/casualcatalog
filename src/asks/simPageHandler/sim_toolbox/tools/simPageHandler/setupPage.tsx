//spawn back place
if (configBot.tags.placeAsk != (tags.simID + '_' + tags.pageID)) {
    return;
}


if (tags.prevPage) {
    const prevPlace = getBot(byTag("placePortal", true), byTag("label", tags.prevPage));
    if (!prevPlace) {
        const abArtifactShard = {
            data: {
                label: tags.prevPage,
                placeAsk: tags.simID + '_' + tags.prevPage,
                instSetting: tags.prevPage,
                generateURLOnLoad: true,
                eggParameters: {
                    gridInformation: {
                        dimension: 'home',
                        position: {
                            x: -10,
                            y: 10
                        }
                    }
                }
            },
            dependencies: [
                {
                    askID: 'placePortal'
                }
            ]
        };
        ab.links.artifact.abCreateArtifactPromiseBot({
            abArtifactName: "placePortal",
            abArtifactInstanceID: uuid(),
            abArtifactShard,
        });
    }
}

if (tags.nextPage) {
    const nextPlace = getBot(byTag("placePortal", true), byTag("label", tags.nextPage));
    if (!nextPlace) {
        //spawn next place
        const abArtifactShard2 = {
            data: {
                label: tags.nextPage,
                placeAsk: tags.simID + '_' + tags.nextPage,
                instSetting: tags.nextPage,
                generateURLOnLoad: true,
                eggParameters: {
                    gridInformation: {
                        dimension: 'home',
                        position: {
                            x: 10,
                            y: 10
                        }
                    }
                }
            },
            dependencies: [
                {
                    askID: "placePortal"
                }
            ]
        };
        ab.links.artifact.abCreateArtifactPromiseBot({
            abArtifactName: "placePortal",
            abArtifactInstanceID: uuid(),
            abArtifactShard: abArtifactShard2,
        });
    }
}

//showActions
thisBot.onABInitialized();