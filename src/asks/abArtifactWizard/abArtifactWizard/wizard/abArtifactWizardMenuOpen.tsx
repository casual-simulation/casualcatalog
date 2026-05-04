const {
    wizardDimension = ab.tags.abInst,
} = that ?? {};

shout('abArtifactWizardMenuReset');

configBot.masks.menuPortal = 'abArtifactWizardMainMenu';

const artifactInstances: Record<string, Bot[]> = links.artifact.abGetArtifactInstances();
const artifactPatterns: Record<string, Bot[]> = links.artifact.abGetArtifactPatterns();

const instanceIDs = Object.keys(artifactInstances);
const patternNames = Object.keys(artifactPatterns);

if (instanceIDs.length === 0 && patternNames.length === 0) {
    links.utils.abLogAndToast({ message: `No artifacts found in the inst.` })
    return;
}

const abArtifactBaseColor = links.remember.tags.abArtifactBaseColor ?? links.artifact.tags.abArtifactBaseColorDefault;
const abArtifactLabelColor = links.remember.tags.abArtifactLabelColor ?? links.artifact.tags.abArtifactLabelColorDefault;

/**
 * Menu portal: abArtifactWizardMainMenu
 */

const createButton = links.menu.abCreateMenuButton({
    abArtifactWizardMainMenu: true,
    formAddress: 'add_box',
    label: `artifact bot`,
    color: abArtifactBaseColor,
    labelColor: abArtifactLabelColor,
    wizardBot: getLink(thisBot),
    wizardDimension,
    abArtifactWizardMenuReset: `@destroy(thisBot)`,
    onArtifactWizardSelection: `@
        const abArtifactName = that.abArtifactName;
        let abArtifactInstanceID = that.abArtifactInstanceID;
        const abArtifactInstanceOwner = that.abArtifactInstanceOwner ?? authBot?.id ?? ab.links.remember.tags.abRecordName;

        const position = getBotPosition(links.wizardBot, tags.wizardDimension);

        let abArtifactBot = getBot((b) => {
            return b.tags.abArtifactName === abArtifactName &&
                   b.tags.abArtifactInstanceID === abArtifactInstanceID &&
                   b.tags.abArtifactBot === true
        })

        if (abArtifactBot) {
            // Add existing artifact bot to current dimension and position.
            console.log('existing artifact bot used');
            abArtifactBot.tags[tags.wizardDimension] = true;
            abArtifactBot.tags[tags.wizardDimension + 'X'] = position.x;
            abArtifactBot.tags[tags.wizardDimension + 'Y'] = position.y;
            abArtifactBot.tags[tags.wizardDimension + 'Z'] = position.z;

            links.wizardBot.links.artifact.abUpdateArtifactShards({ abArtifactName, abArtifactInstanceID, abArtifactInstanceOwner })
        } else {
            if (!abArtifactInstanceID) {
                // Generate a new instance id and assign pattern bots to it, these pattern bots are now shards of the artifact instance.
                abArtifactInstanceID = uuid();
                console.log('assigning new artifact instance id:', abArtifactInstanceID);

                const patterns = links.wizardBot.links.artifact.abGetArtifactPatterns({ abArtifactName });
                const patternBots = patterns[abArtifactName];

                for (const patternBot of patternBots) {
                    patternBot.tags.abArtifactInstanceID = abArtifactInstanceID;
                    patternBot.tags.abArtifactShardInstanceID = uuid();
                    patternBot.tags.abArtifactInstanceOwner = abArtifactInstanceOwner;
                }
            }

            console.log('new artifact bot created');
            abArtifactBot = await links.wizardBot.links.artifact.abCreateArtifactBot({
                abArtifactName,
                abArtifactInstanceID,
                abArtifactInstanceOwner,
                dimension: tags.wizardDimension,
                position,
            });
        }

        if (abArtifactBot) {
            if (links.wizardBot && links.wizardBot.tags.destroyAfterUse && configBot.tags.gridPortal !== 'abArtifactWizard') {
                destroy(links.wizardBot);
            }
        }
        
        shout("abArtifactWizardMenuReset");
    `,
    onClick: `@
        configBot.tags.abArtifactWizardSelectionMenuTarget = getLink(thisBot);
        configBot.masks.menuPortal = 'abArtifactWizardSelectionMenu';
    `,
})

const downloadButton = links.menu.abCreateMenuButton({
    abArtifactWizardMainMenu: true,
    formAddress: 'download',
    label: `download artifact pattern`,
    wizardBot: getLink(thisBot),
    color: abArtifactBaseColor,
    labelColor: abArtifactLabelColor,
    abArtifactWizardMenuReset: `@destroy(thisBot)`,
    onArtifactWizardSelection: `@
        const { abArtifactName, abArtifactInstanceID, abArtifactInstanceOwner } = that;

        const shardBots = getBots(b => b.tags.abArtifactName === abArtifactName && b.tags.abArtifactInstanceID === abArtifactInstanceID && b.space === 'shared');

        if (shardBots.length > 0) {
            links.wizardBot.links.artifact.abDownloadArtifactPattern({ abArtifactName, shardBots });
        } else {
            links.wizardBot.links.utils.abLogAndToast({ message: 'Could not find any shard bots.' , logType: 'error' })
        }

        if (links.wizardBot.tags.destroyAfterUse && configBot.tags.gridPortal !== 'abArtifactWizard') {
            destroy(links.wizardBot);
        }
        
        shout("abArtifactWizardMenuReset");
    `,
    onClick: `@
        configBot.tags.abArtifactWizardSelectionMenuTarget = getLink(thisBot);
        configBot.masks.menuPortal = 'abArtifactWizardSelectionMenu';
    `,
})

const publishButton = links.menu.abCreateMenuButton({
    abArtifactWizardMainMenu: true,
    formAddress: 'ios_share',
    label: `publish artifact pattern`,
    color: abArtifactBaseColor,
    wizardBot: getLink(thisBot),
    labelColor: abArtifactLabelColor,
    abArtifactWizardMenuReset: `@destroy(thisBot)`,
    onArtifactWizardSelection: `@
        const { abArtifactName, abArtifactInstanceID, abArtifactInstanceOwner } = that;

        configBot.tags.abArtifactWizardSelectedArtifactName = abArtifactName;
        configBot.tags.abArtifactWizardSelectedArtifactInstanceID = abArtifactInstanceID;
        configBot.masks.menuPortal = 'abArtifactWizardPublishMenu';
    `,
    onClick: `@        
        if (!authBot) {
            links.wizardBot.links.utils.abLogAndToast({ message: 'You must be logged in to publish an artifact pattern', logType: 'error'});
            return;
        }
        
        configBot.tags.abArtifactWizardSelectionMenuTarget = getLink(thisBot);
        configBot.masks.menuPortal = 'abArtifactWizardSelectionMenu';
    `,
})

/**
 * Menu portal: abArtifactWizardSelectionMenu
 */

const selectionOptions: { name: string, instanceID?: string, instanceOwner?: string}[] = [];

for (const instanceID of instanceIDs) {
    const shardBot = artifactInstances[instanceID][0];

    selectionOptions.push({ name: shardBot.tags.abArtifactName, instanceID, instanceOwner: shardBot.tags.abArtifactInstanceOwner })
}

for (const patternName of patternNames) {
    selectionOptions.push({ name: patternName });
}

// Sort alphabetically by name first, then by instanceID
selectionOptions.sort((a, b) => {
    const nameComparison = a.name.localeCompare(b.name);
    
    // If names are the same, compare by instanceID
    if (nameComparison === 0) {
        if (a.instanceID && b.instanceID) {
            return a.instanceID.localeCompare(b.instanceID);
        } else if (a.instanceID && !b.instanceID) {
            return -1; // Items with instanceID come before those without
        } else if (!a.instanceID && b.instanceID) {
            return 1; // Items without instanceID come after those with
        }
        return 0; // Both don't have instanceID
    }
    
    return nameComparison;
});


for (const option of selectionOptions) {
    let label = option.name;
    if (option.instanceID) {
        label += ` (inst id: ${option.instanceID.substring(0, 7)})`;
    }

    const optionButton = links.menu.abCreateMenuButton({
        abArtifactWizardSelectionMenu: true,
        label,
        name: option.name,
        instanceID: option.instanceID,
        instanceOwner: option.instanceOwner,
        color: abArtifactBaseColor,
        labelColor: abArtifactLabelColor,
        abArtifactWizardMenuReset: `@destroy(thisBot)`,
        onPortalChanged: `@
            if (that.portal !== 'menuPortal' && that.dimension !== 'abArtifactWizardSelectionMenu') {
                return;
            }

            if (configBot.tags.abArtifactWizardSelectedArtifactName === tags.name && 
                configBot.tags.abArtifactWizardSelectedArtifactInstanceID === tags.instanceID
            ) {
                tags.formAddress = 'radio_button_checked';
            } else {
                tags.formAddress = 'radio_button_unchecked';
            }
        `,
        onClick: `@
            whisper(configBot.links.abArtifactWizardSelectionMenuTarget, 'onArtifactWizardSelection', { abArtifactName: tags.name, abArtifactInstanceID: tags.instanceID, abArtifactInstanceOwner: tags.instanceOwner });
        `,
    })
}

/**
 * Menu portal: abArtifactWizardPublishMenu
 */

const nameButton = links.menu.abCreateMenuButton({
    abArtifactWizardPublishMenu: true,
    formAddress: 'radio_button_checked',
    publishButton: getLink(publishButton),
    color: abArtifactBaseColor,
    labelColor: abArtifactLabelColor,
    abArtifactWizardMenuReset: `@destroy(thisBot)`,
    onPortalChanged: `@
        if (that.portal !== 'menuPortal' && that.dimension !== 'abArtifactWizardPublishMenu') {
            return;
        }
        
        if (configBot.tags.abArtifactWizardSelectedArtifactName &&
            configBot.tags.abArtifactWizardSelectedArtifactInstanceID
        ) {
            tags.label = configBot.tags.abArtifactWizardSelectedArtifactName + ' (inst id: ' + configBot.tags.abArtifactWizardSelectedArtifactInstanceID.substring(0, 7) + ')';
        } else if (configBot.tags.abArtifactWizardSelectedArtifactName) {
            tags.label = configBot.tags.abArtifactWizardSelectedArtifactName;
        } else {
            tags.label = 'Select an artifact';
        }
    `,
    onClick: `@
        configBot.tags.abArtifactWizardSelectionMenuTarget = getLink(links.publishButton);
        configBot.masks.menuPortal = 'abArtifactWizardSelectionMenu';
    `,
})

const studioButton = links.menu.abCreateMenuButton({
    abArtifactWizardPublishMenu: true,
    formAddress: 'inventory_2',
    color: abArtifactBaseColor,
    labelColor: abArtifactLabelColor,
    wizardBot: getLink(thisBot),
    abArtifactWizardMenuReset: `@destroy(thisBot)`,
    onPortalChanged: `@
        if (that.portal !== 'menuPortal' && that.dimension !== 'abArtifactWizardPublishMenu') {
            return;
        }

        let foundRecordKey;

        if (configBot.tags.abArtifactWizardSelectedArtifactName) {
            const artifactBundles = links.wizardBot.links.artifact.abFindArtifactBundles({ 
                abArtifactName: configBot.tags.abArtifactWizardSelectedArtifactName,
                abArtifactInstanceID: configBot.tags.abArtifactWizardSelectedArtifactInstanceID
            });

            for (let key in artifactBundles) {
                const artifactBundle = artifactBundles[key];

                if (artifactBundle.dependencies && artifactBundle.dependencies.length > 0) {
                    const matchingDep = artifactBundle.dependencies.find(d => d.abID === configBot.tags.abArtifactWizardSelectedArtifactName && d.recordKey);

                    if (matchingDep) {
                        foundRecordKey = matchingDep.recordKey;
                        break;
                    }
                }
            }
        }

        if (foundRecordKey) {
            tags.recordKey = foundRecordKey;
        } else {
            tags.recordKey = authBot.id;
        }
    `,
    onClick: `@
        const input = await os.showInput(tags.recordKey, { autoSelect: true, title: 'studio record key' });

        if (input) {
            tags.recordKey = input;
        } else {
            tags.recordKey = authBot.id;
        }
    `,
    onBotChanged: `@
        const changedTags = that.tags;

        if (changedTags.includes('recordKey')) {
            tags.label = 'studio=' + tags.recordKey;
        }
    `,
})

const submitButton = links.menu.abCreateMenuButton({
    abArtifactWizardPublishMenu: true,
    formAddress: 'publish',
    color: abArtifactBaseColor,
    labelColor: abArtifactLabelColor,
    studioButton: getLink(studioButton),
    wizardBot: getLink(thisBot),
    abArtifactWizardMenuReset: `@destroy(thisBot)`,
    onPortalChanged: `@
        if (that.portal !== 'menuPortal' && that.dimension !== 'abArtifactWizardPublishMenu') {
            return;
        }

        await os.sleep(0);

        const name = configBot.tags.abArtifactWizardSelectedArtifactName;
        const instanceID = configBot.tags.abArtifactWizardSelectedArtifactInstanceID;
        const recordKey = links.studioButton.tags.recordKey;

        const shardBots = getBots(b => b.tags.abArtifactName === name && b.tags.abArtifactInstanceID === instanceID && b.space === 'shared' );
        thisBot.vars.shardBots = shardBots;

        if (shardBots.length > 1) {
            tags.label = 'Publish (' + shardBots.length + ' bots)';
        } else if (shardBots.length === 1) {
            tags.label = 'Publish (1 bot)';
        } else {
            tags.label = 'No bots to publish';
        }
    `,
    onClick: `@
        const name = configBot.tags.abArtifactWizardSelectedArtifactName;
        const recordKey = links.studioButton.tags.recordKey;
        const shardBots = thisBot.vars.shardBots;

        try { 
            const result = await links.wizardBot.links.artifact.abPublishArtifactPattern({ abArtifactName: name, studio: recordKey, shardBots, manualPublish: true })

            if (result.success) {
                if (links.wizardBot && links.wizardBot.tags.destroyAfterUse && configBot.tags.gridPortal !== 'abArtifactWizard') {
                    destroy(links.wizardBot);
                }
            }
        } catch (e) {
            links.wizardBot.links.utils.abLogAndToast({ message: e.message, logType: 'error' });
        }

    `
})