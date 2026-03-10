if (!thisBot.isReconstitutionEnabled()) {
    console.warn(`[${tags.system}.${tagName}] reconstitution is disabled`);
    return;
}

assert(typeof that === 'object', `[${tags.system}.${tagName}] arg object must be provided.`);

const {
    abArtifactBundle,
    abArtifactInstanceID,
    abArtifactInstanceIDPrevious,
    abArtifactInstanceOwner = authBot?.id ?? ab.links.remember.tags.abRecordName,
    eggParameters, // Egg paramters that you would like to have passed to the reconsituted bots (optional).
    toast = true,
} = that as ABArtifactReconstituteArg;

assert(abArtifactBundle && abArtifactBundle.data && abArtifactBundle.dependencies, `[${tags.system}.${tagName}] abArtifactBundle is required to be of type ABArtifactBundle.`);
assert(typeof abArtifactInstanceID === 'string', `[${tags.system}.${tagName}] abArtifactInstanceID is a required to be of type string.`);

// Create a tempShared bot that acts as a signal to everyone that this artifact instance is in the process of being reconstituted.
const reconstitutingSignalBot = create({
    space: 'tempShared',
    abBot: true,
    abReconstitutingArtifactSignalBot: true,
    manager: getLink(thisBot),
    createdTime: os.isCollaborative() ? os.agreedUponTime : os.localTime, // The time this signal bot was created.
    abReconstitutingArtifactInstanceID: abArtifactInstanceID, // The instance id of the artifact being reconstituted.
    abReconstitutionByRemoteId: configBot.id, // The remote id of the user performing the reconsitution.
    abArtifactReconstituteArg: '🧬' + JSON.stringify(that), // A copy of the reconstitute arg object for this function in case it's needed.
    onAnyABArtifactReconstituted: ListenerString(() => {
        const { abArtifactInstanceID } = that;

        if (abArtifactInstanceID === tags.abReconstitutingArtifactInstanceID && thisBot.space !== 'remoteTempShared') {
            if (links.manager.tags.debug) {
                console.log(`[abReconstitutingArtifactSignalBot] destroying self because artifact instance id ${tags.abReconstitutingArtifactInstanceID} has reconstituted.`);
            }

            destroy(thisBot);
        }
    }),
    onAnyABArtifactReconstitutionFailed: ListenerString(() => {
        const { abArtifactInstanceID } = that;

        if (abArtifactInstanceID === tags.abReconstitutingArtifactInstanceID && thisBot.space !== 'remoteTempShared') {
            if (links.manager.tags.debug) {
                console.log(`[abReconstitutingArtifactSignalBot] destroying self because artifact instance id ${tags.abReconstitutingArtifactInstanceID} failed to reconstitute.`);
            }

            destroy(thisBot);
        }
    })
});

try {

    const abArtifactBundleString = '🧬' + JSON.stringify(abArtifactBundle);
    const shardBots = [];

    function handlePreprocessBeforeCreate({ botData }) {
        for (const key in botData) {
            const data = botData[key];

            delete data.tags.abArtifactShardReconstituted; // If the shard bot has itself marked as reconstituted already (possibly due to an oversight), then remove it!

            data.tags.abArtifactBundle = abArtifactBundleString; // Assign the artifact bundle back to the hatched shard bot.
            data.tags.abArtifactInstanceID = abArtifactInstanceID; // UUID of the artifact instance that this bot belongs to.
            data.tags.abArtifactInstanceOwner = abArtifactInstanceOwner; // The user id the owner of this artifact instance.
            data.tags.abArtifactShardInstanceID = uuid(); // UUID assigned to the bot by the artifact when loaded.
        }
    }

    for (const dependency of abArtifactBundle.dependencies) {
        const dependencyBots = [];

        if (thisBot.isEggDependency(dependency)) {
            const eggDependency = dependency as ABArtifactEggDependency;

            // First try to load from egg.
            const lookupEggResult = await links.search.onLookupABEggs({
                abID: eggDependency.abID,
                recordKey: eggDependency.recordKey,
                abVersion: eggDependency.abVersion,
                autoHatch: true,
                sourceEvent: 'reconstitute',
                eggParameters,
                onPreprocessBeforeCreate: handlePreprocessBeforeCreate
            })

            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] ${abArtifactBundle.name} ${eggDependency.abID} lookupEggResult:`, lookupEggResult);
            }

            if (lookupEggResult.success) {
                if (tags.debug) {
                    links.utils.abLog(`${abArtifactBundle.name} (instance id: ${abArtifactInstanceID}) loaded dependency abID: ${eggDependency.abID}, abVersion: ${eggDependency.abVersion ?? 'latest'}`);
                }

                for (const hatchedBot of lookupEggResult.hatchedBots) {
                    dependencyBots.push(hatchedBot);
                }
            }
        }

        if (dependencyBots.length === 0 && thisBot.isAskDependency(dependency)) {
            const askDependency = dependency as ABArtifactAskDependency;

            // Try to load from ask.
            const lookupAskResult: ABLookupAskIDResult = await links.search.onLookupAskID({
                askID: askDependency.askID,
                showIndicator: false,
                autoHatch: true,
                ignoreReserved: true,
                sourceEvent: 'reconstitute',
                eggParameters,
                onPreprocessBeforeCreate: handlePreprocessBeforeCreate
            })

            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] lookupAskResult:`, lookupAskResult);
            }

            if (lookupAskResult.success) {
                for (const hatchedBot of lookupAskResult.hatchedBots) {
                    dependencyBots.push(hatchedBot);
                }
            }
        }

        if (dependencyBots.length > 0) {
            for (const shardBot of dependencyBots) {
                shardBots.push(shardBot);
            }
        } else {
            links.utils.abLog({ message: `${abArtifactBundle.name} failed to load dependency: ${JSON.stringify(dependency)}`, logType: 'error' });
        }
    }


    if (shardBots.length > 0) {
        // Tell all hatched shard bots to reconstitute. They all have copies of the abArtifactBundle and can reconstitute themselves from that.
        await Promise.allSettled(whisper(shardBots, 'onABArtifactReconstitute', { data: abArtifactBundle.data }));

        for (let shardBot of shardBots) {
            setTagMask(shardBot, 'abArtifactShardReconstituted', true, 'shared'); // This bot has been reconstituted in this inst.
        }

        await thisBot.abLoadArtifactInstanceDocument({ abArtifactInstanceID, abArtifactInstanceOwner });

        const reconstitutionResult = {
            abArtifactName: abArtifactBundle.name,
            abArtifactInstanceID,
            abArtifactInstanceIDPrevious,
            abArtifactInstanceOwner,
            abArtifactBundle,
            shardBots,
        };

        whisper(shardBots, 'onReconstituted', reconstitutionResult);
        shout('onAnyABArtifactReconstituted', reconstitutionResult);

        links.utils.abLogAndToast({ message: `Artifact '${abArtifactBundle.name}' (instance id: ${abArtifactInstanceID}) finished reconstitution.`, toast: toast });

        return reconstitutionResult;
    } else {
        const failureResult = {
            errorCode: 'no_shard_bots',
            errorMessage: 'Reconstitution results in no shard bots.',
            abArtifactName: abArtifactBundle.name,
            abArtifactInstanceID,
            abArtifactInstanceIDPrevious,
            abArtifactInstanceOwner,
            abArtifactBundle,
        };

        shout('onAnyABArtifactReconstitutionFailed', failureResult);

        links.utils.abLogAndToast({ message: `Artifact '${abArtifactBundle.name}' (instance id: ${abArtifactInstanceID}) failed reconstitution.`, toast: toast });

        return failureResult;
    }

} finally {
    destroy(reconstitutingSignalBot);
}
