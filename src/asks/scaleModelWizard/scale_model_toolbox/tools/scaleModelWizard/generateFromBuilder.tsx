const jsonData = that;

let cleanedJSON = jsonData?.replaceAll('`', '');
if (cleanedJSON.indexOf('json') == 0) {
    cleanedJSON = cleanedJSON.replace('json', '');
}
const parsedJsonData = JSON.parse(cleanedJSON);

if (!tags.generatedModelData) {
    tags.generatedModelData = [];
}

tags.generatedModelData.push(parsedJsonData);

//thisBot.provideReceipt({raw: jsonData, parsed: parsedJsonData});

if (parsedJsonData["type"]) {
    const xVal = Math.floor(Math.random() * (15 - (-15) + 1)) + (-15);
    const yVal = Math.floor(Math.random() * (15 - (-15) + 1)) + (-15);
    const zVal = 0;
    let dimensionName = ab.links.remember.tags.currentDimension ?? 'home';

    //SCALE MODEL
    if (parsedJsonData["type"] == 'MODEL') {
        const abArtifactShard = {
            data: {
                config: {
                    label: parsedJsonData.name,
                    modelName: parsedJsonData.name,
                    modelAttributes: parsedJsonData.stats,
                    modelStates: parsedJsonData.states,
                    modelListeners: parsedJsonData.listeners,
                    modelLocked: true,
                    form: parsedJsonData.form,
                    dimensionData: {
                        dimension: dimensionName,
                        [dimensionName]: true,
                        [dimensionName + 'X']: parsedJsonData.location?.x ?? xVal,
                        [dimensionName + 'Y']: parsedJsonData.location?.y ?? yVal,
                        [dimensionName + 'Z']: parsedJsonData.location?.z ?? zVal,
                        [dimensionName + 'RotationX']: parsedJsonData.rotation?.x,
                        [dimensionName + 'RotationY']: parsedJsonData.rotation?.y,
                        [dimensionName + 'RotationZ']: parsedJsonData.rotation?.z
                    },
                    scaleX: parsedJsonData.scale.x,
                    scaleY: parsedJsonData.scale.y,
                    scaleZ: parsedJsonData.scale.z,
                    color: parsedJsonData.color
                }
            },
            dependencies: [
                {
                    askID: 'scaleModel'
                }
            ]
        };
        const modelBot = await ab.links.artifact.abCreateArtifactPromiseBot({
            abArtifactName: 'scaleModel',
            abArtifactInstanceID: uuid(),
            abArtifactShard,
        });

        //thisBot.createVisuals({base: getID(modelBot[0]), visualData: parsedJsonData.visuals});
    } 
}