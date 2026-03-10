const csvData = that;

let cleanedCSV = csvData?.replaceAll('`', '');
if (cleanedCSV.indexOf('csv') == 0) {
    cleanedCSV = cleanedCSV.replace('csv', '');
}

const lines = cleanedCSV.split('\n');
const result = [];

for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentline = lines[i].split(',');

    let simType = currentline[0];
    let config = currentline?.slice(1)?.join(',')?.trim() ?? "{}";
    if (config[0] == '"') {
        config = config.slice(1);
    }
    if (config[config.length - 1] == '"') {
        config = config.slice(0, -1);
    }

    if (simType == 'type' || !config) {
        continue;
    }

    obj['type'] = simType;
    obj['configuration'] = JSON.parse(config.replaceAll('""', '"'));

    result.push(obj);
}

const jsonString = JSON.stringify(result, null, 2);
const jsonData = JSON.parse(jsonString);

thisBot.provideReceipt({raw: csvData, parsed: jsonData});

let numPlayers = 1;

configBot.tags.gridPortal = 'blueprint';

for (const item of jsonData) {
    if (item["type"]) {
        const xVal = Math.floor(Math.random() * (15 - (-15) + 1)) + (-15);
        const yVal = Math.floor(Math.random() * (15 - (-15) + 1)) + (-15);
        let dimensionName = ab.links.remember.tags.currentDimension ?? 'blueprint';

        //SIM ROLE
        if (item["type"] == 'SIM_ROLE') {
            const conData = item["configuration"];
            let chosenPlaceName = conData.place.replace(/[^a-zA-Z0-9]/g, '') ?? 'home';
            chosenPlaceName = chosenPlaceName.toLowerCase();
            const abArtifactShard = {
                data: {
                    config: {
                        label: conData.name,
                        simAttributes: conData.attributes,
                        roleLocked: true,
                        roleName: conData.name,
                        numUsers: conData.numUsers,
                        defaultPlace: chosenPlaceName,
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
                        askID: 'simRole'
                    }
                ]
            };
            ab.links.artifact.abCreateArtifactPromiseBot({
                abArtifactName: 'simRole',
                abArtifactInstanceID: uuid(),
                abArtifactShard,
            });

        } 
        //SIM ACTION
        else if (item["type"] == 'SIM_ACTION') {
            const conData = item["configuration"];
            const abArtifactShard = {
                data: {
                    config: {
                        label: conData.label,
                        simID: conData.simID,
                        actionTriggers: conData.triggers,
                        actionTriggerFilter: conData.triggerFilter,
                        roleTags: conData.roles,
                        startingAction: conData.startingAction,
                        groupTags: conData.groups,
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
                        askID: 'simAction'
                    }
                ]
            };
            ab.links.artifact.abCreateArtifactPromiseBot({
                abArtifactName: 'simAction',
                abArtifactInstanceID: uuid(),
                abArtifactShard,
            });
        } 
        //SIM DIRECTIVE
        else if (item["type"] == 'SIM_PROP_ACTION') {
            const conData = item["configuration"];
            const abArtifactShard = {
                data: {
                    config: {
                        label: conData.label,
                        simID: conData.simID,
                        actionTriggers: conData.triggers,
                        actionTriggerFilter: conData.triggerFilter,
                        roleTags: conData.roles,
                        startingAction: conData.startingAction,
                        groupTags: conData.groups,
                        completionTriggers: conData.completionTriggers,
                        hideTriggers: conData.hideTriggers,
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
                        askID: 'simPropAction'
                    }
                ]
            };
            ab.links.artifact.abCreateArtifactPromiseBot({
                abArtifactName: 'simPropAction',
                abArtifactInstanceID: uuid(),
                abArtifactShard,
            });
        } 
        //SIM REACTION
        else if (item["type"] == 'SIM_REACTION') {
            const conData = item["configuration"];
            const abArtifactShard = {
                data: {
                    config: {
                        label: conData.label,
                        simID: conData.simID,
                        actionTriggers: conData.triggers,
                        actionTriggerFilter: conData.triggerFilter,
                        reactionAttribute: conData.affectedAttribute,
                        reactionEffect: conData.effect,
                        reactionValue: conData.value,
                        roleTags: conData.roles,
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
                        askID: 'simReaction'
                    }
                ]
            };
            ab.links.artifact.abCreateArtifactPromiseBot({
                abArtifactName: 'simReaction',
                abArtifactInstanceID: uuid(),
                abArtifactShard,
            });
        } 
        //SIM PLACE
        else if (item["type"] == 'SIM_PLACE') {
            const conData = item["configuration"];
            let chosenDimensionName = conData.simID.replace(/[^a-zA-Z0-9]/g, '') ?? 'home';
            chosenDimensionName = chosenDimensionName.toLowerCase();
            const abArtifactShard = {
                data: {
                    config: {
                        label: conData.name,
                        placePrompt: conData.prompt,
                        simID: conData.simID,
                        chosenDimension: chosenDimensionName,
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
                        askID: 'simPlace'
                    }
                ]
            };
            ab.links.artifact.abCreateArtifactPromiseBot({
                abArtifactName: 'simPlace',
                abArtifactInstanceID: uuid(),
                abArtifactShard,
            });
        } 
        //SIM DOOR
        else if (item["type"] == 'SIM_DOOR') {
            const conData = item["configuration"];
            dimensionName = conData.place.replace(/[^a-zA-Z0-9]/g, '') ?? 'home';
            dimensionName = dimensionName.toLowerCase();
            const abArtifactShard = {
                data: {
                    config: {
                        label: conData.label,
                        destination: conData.destination,
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
                        askID: 'simDoor'
                    }
                ]
            };
            ab.links.artifact.abCreateArtifactPromiseBot({
                abArtifactName: 'simDoor',
                abArtifactInstanceID: uuid(),
                abArtifactShard,
            });
        } 
        //SIM PROP
        else if (item["type"] == 'SIM_PROP') {
            const conData = item["configuration"];
            dimensionName = conData.place?.replace(/[^a-zA-Z0-9]/g, '') ?? 'home';
            dimensionName = dimensionName.toLowerCase();
            const abArtifactShard = {
                data: {
                    config: {
                        label: conData.name,
                        simID: conData.simID,
                        roleName: conData.name,
                        simAttributes: conData.attributes,
                        trackedStat: conData.trackedAttribute,
                        trackedStatStartingValue: conData.lowestValue,
                        trackedStatEndingValue: conData.highestValue,
                        destination: conData.destination,
                        imagePrompt: conData.visualDescription,
                        autoGenerateReactions: false,
                        propLocked: true,
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
                        askID: 'simProp'
                    }
                ]
            };
            ab.links.artifact.abCreateArtifactPromiseBot({
                abArtifactName: 'simProp',
                abArtifactInstanceID: uuid(),
                abArtifactShard,
            });
        }
    
        //SIM PLAYER
        else if (item["type"] == 'SIM_PLAYER') {
            const conData = item["configuration"];
            dimensionName = conData.place?.replace(/[^a-zA-Z0-9]/g, '') ?? 'home';
            dimensionName = dimensionName.toLowerCase();
            const playerLabel = 'P' + numPlayers;
            numPlayers += 1;
            const abArtifactShard = {
                data: {
                    config: {
                        label: playerLabel,
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
                        askID: 'simPlayer'
                    }
                ]
            };
            ab.links.artifact.abCreateArtifactPromiseBot({
                abArtifactName: 'simPlayer',
                abArtifactInstanceID: uuid(),
                abArtifactShard,
            });
        }
        //SIM SCENE REACTION
        else if (item["type"] == 'SIM_PROP_REACTION') {
            const conData = item["configuration"];
            const abArtifactShard = {
                data: {
                    config: {
                        simID: conData.simID,
                        label: conData.reactionType,
                        propReactionType: conData.reactionType,
                        roleTags: conData.roles,
                        actionTriggers: conData.props,
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
                        askID: 'simPropReaction'
                    }
                ]
            };
            ab.links.artifact.abCreateArtifactPromiseBot({
                abArtifactName: 'simPropReaction',
                abArtifactInstanceID: uuid(),
                abArtifactShard,
            });
        }
        //SIM SMART REACTION
        else if (item["type"] == 'SIM_SMART_REACTION') {
            const conData = item["configuration"];
            const abArtifactShard = {
                data: {
                    config: {
                        label: conData.label,
                        simID: conData.simID,
                        actionTriggers: conData.triggers,
                        actionTriggerFilter: conData.triggerFilter,
                        checkQueue: conData.useQueue,
                        orderMatters: conData.orderMatters,
                        sequentialMatters: conData.sequentialMatters,
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
                        askID: 'simSmartReaction'
                    }
                ]
            };
            ab.links.artifact.abCreateArtifactPromiseBot({
                abArtifactName: 'simSmartReaction',
                abArtifactInstanceID: uuid(),
                abArtifactShard,
            });
        } 
    }
}

const homePlace = getBot(byTag("simPlace", true), byTag("chosenDimension", "home"));

if (!homePlace) {
    //create home place
    let chosenDimensionName = 'home';
    const abArtifactShard = {
        data: {
            config: {
                label: 'home',
                formAddress: 'https://images.blockadelabs.com/images/imagine/M3_Low-Poly_Render_equirectangular-jpg_a_lobby_of_a_1535619319_14882626.jpg?ver=1',
                simID: uuid(),
                chosenDimension: chosenDimensionName,
                dimensionData: {
                    dimension: 'blueprint',
                    ['blueprint']: true,
                    ['blueprint' + 'X']: -7,
                    ['blueprint' + 'Y']: -26
                }
            }
        },
        dependencies: [
            {
                askID: 'simPlace'
            }
        ]
    };
    ab.links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: 'simPlace',
        abArtifactInstanceID: uuid(),
        abArtifactShard,
    });
}

if (tags.destroyAfterUse) {
    destroy(thisBot);
}