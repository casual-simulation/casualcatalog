const jsonData = that;

let cleanedJSON = jsonData?.replaceAll('`', '');
if (cleanedJSON.indexOf('json') == 0) {
    cleanedJSON = cleanedJSON.replace('json', '');
}
const parsedJsonData = JSON.parse(cleanedJSON);

tags.parsedOriginalResponse = parsedJsonData;

for (const item of parsedJsonData) {
    if (item["type"]) {
        let dimensionName = ab.links.remember.tags.currentDimension ?? 'home';

        //SCALE MODEL
        if (item["type"] == 'MODEL') {
            await thisBot.makeModel(item);
        } 
        //TIMELINE MARKER
        else if (item["type"] == 'TIMELINE_MARKER') {
            let posX = item.startLocation.x;
            let posY = item.startLocation.y;

            let abArtifactShard = {
            data: {
                config: {
                    timeUnit: item.steps[0].timeUnit,
                    dimensionData: {
                        dimension: dimensionName,
                        [dimensionName]: true,
                        [dimensionName + 'X']: posX - 5,
                        [dimensionName + 'Y']: posY
                    }
                }
            },
            dependencies: [
                {
                    askID: 'timelineManager'
                }
            ]
            };
            ab.links.artifact.abCreateArtifactPromiseBot({
                abArtifactName: 'timelineManager',
                abArtifactInstanceID: uuid(),
                abArtifactShard,
            });

            for (let j = 0; j < item.steps.length; ++j) {
                abArtifactShard = {
                data: {
                    config: {
                        label: item.steps[j].timeUnit + ' ' + item.steps[j].step,
                        timeUnit: item.steps[j].timeUnit,
                        timeValue: item.steps[j].step,
                        markerLocked: true,
                        dimensionData: {
                            dimension: dimensionName,
                            [dimensionName]: true,
                            [dimensionName + 'X']: posX,
                            [dimensionName + 'Y']: posY
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

                posX += 3;
            }   
        } 
    }
}

thisBot.provideReceipt();

if (tags.destroyAfterUse) {
    destroy(thisBot);
}