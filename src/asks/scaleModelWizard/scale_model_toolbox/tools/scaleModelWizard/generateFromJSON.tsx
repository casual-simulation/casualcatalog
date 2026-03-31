const jsonData = that;

let cleanedJSON = jsonData?.replaceAll('`', '');
if (cleanedJSON.indexOf('json') == 0) {
    cleanedJSON = cleanedJSON.replace('json', '');
}
const parsedJsonData = JSON.parse(cleanedJSON);

thisBot.provideReceipt({raw: jsonData, parsed: parsedJsonData});

for (const item of jsonData) {
    if (item["type"]) {
        const xVal = Math.floor(Math.random() * (15 - (-15) + 1)) + (-15);
        const yVal = Math.floor(Math.random() * (15 - (-15) + 1)) + (-15);
        let dimensionName = ab.links.remember.tags.currentDimension ?? 'home';

        //SCALE MODEL
        if (item["type"] == 'MODEL') {
            const conData = item["configuration"];
            const abArtifactShard = {
                data: {
                    config: {
                        label: conData.name,
                        modelAttributes: conData.attributes,
                        modelLocked: true,
                        dimensionData: {
                            dimension: dimensionName,
                            [dimensionName]: true,
                            [dimensionName + 'X']: conData.location?.x ?? xVal,
                            [dimensionName + 'Y']: conData.location?.y ?? yVal
                        }
                    }
                },
                dependencies: [
                    {
                        askID: 'scaleModel'
                    }
                ]
            };
            ab.links.artifact.abCreateArtifactPromiseBot({
                abArtifactName: 'scaleModel',
                abArtifactInstanceID: uuid(),
                abArtifactShard,
            });

        } 
        //TIMELINE MARKER
        else if (item["type"] == 'TIMELINE_MARKER') {
            const conData = item["configuration"];
            const abArtifactShard = {
                data: {
                    config: {
                        label: conData.label,

                        dimensionData: {
                            dimension: dimensionName,
                            [dimensionName]: true,
                            [dimensionName + 'X']: conData.location?.x ?? xVal,
                            [dimensionName + 'Y']: conData.location?.y ?? yVal
                        }
                    }
                },
                dependencies: [
                    {
                        askID: 'timelineMarker'
                    }
                ]
            };
            ab.links.artifact.abCreateArtifactPromiseBot({
                abArtifactName: 'timelineMarker',
                abArtifactInstanceID: uuid(),
                abArtifactShard,
            });
        } 
    }
}

if (tags.destroyAfterUse) {
    destroy(thisBot);
}