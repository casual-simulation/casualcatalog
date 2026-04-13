const jsonData = that;

let cleanedJSON = jsonData?.replaceAll('`', '');
if (cleanedJSON.indexOf('json') == 0) {
    cleanedJSON = cleanedJSON.replace('json', '');
}
const parsedJsonData = JSON.parse(cleanedJSON);

thisBot.provideReceipt({raw: jsonData, parsed: parsedJsonData});

for (const item of parsedJsonData) {
    if (item["type"]) {
        const xVal = Math.floor(Math.random() * (15 - (-15) + 1)) + (-15);
        const yVal = Math.floor(Math.random() * (15 - (-15) + 1)) + (-15);
        const zVal = 0;
        let dimensionName = ab.links.remember.tags.currentDimension ?? 'home';

        //SCALE MODEL
        if (item["type"] == 'MODEL') {
            const abArtifactShard = {
                data: {
                    config: {
                        label: item.name,
                        modelName: item.name,
                        modelAttributes: item.stats,
                        modelStates: item.states,
                        modelListeners: item.listeners,
                        modelLocked: true,
                        dimensionData: {
                            dimension: dimensionName,
                            [dimensionName]: true,
                            [dimensionName + 'X']: item.location?.x ?? xVal,
                            [dimensionName + 'Y']: item.location?.y ?? yVal,
                            [dimensionName + 'Z']: item.location?.z ?? zVal
                        },
                        scaleX: item.scale.x,
                        scaleY: item.scale.y,
                        scaleZ: item.scale.z,
                        color: item.color
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
            const abArtifactShard = {
                data: {
                    config: {
                        label: item.timeUnit + ' ' + item.step,
                        timeUnit: item.timeUnit,
                        timeValue: item.step,
                        markerLocked: true,
                        dimensionData: {
                            dimension: dimensionName,
                            [dimensionName]: true,
                            [dimensionName + 'X']: item.location?.x ?? xVal,
                            [dimensionName + 'Y']: item.location?.y ?? yVal
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