const {
    abArtifactName,
    abArtifactInstanceID,
    abArtifactShard,
    abArtifactInstanceOwner = authBot?.id ?? ab.links.remember.tags.abRecordName,
    space = 'shared',
} = that ?? {};


assert(abArtifactName, `[${tags.system}.${tagName}] abArtifactName is a required parameter.`);
assert(typeof abArtifactInstanceID === 'string', `[${tags.system}.${tagName}] abArtifactInstanceID is a required string parameter.`);
assert(typeof abArtifactInstanceOwner === 'string', `[${tags.system}.${tagName}] abArtifactInstanceOwner is a required string parameter.`);
assert(abArtifactShard && abArtifactShard.data && abArtifactShard.dependencies, `[${tags.system}.${tagName}] abArtifactShard is a required to be a ABArtifactShard.`);

const botData = [];
const promiseId = uuid();

const abArtifactBundle = thisBot.abCreateArtifactBundle({ abArtifactName, abArtifactShard });

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] generated abArtifactBundle:`, abArtifactBundle);
}

botData[promiseId] = {
    id: promiseId,
    space,
    tags: {
        abArtifactName,
        abArtifactInstanceID,
        abArtifactInstanceOwner,
        abArtifactBundle: '🧬' + JSON.stringify(abArtifactBundle),
        abArtifactPromise: true,
    }
}

// Create artifact promise through abCreateBots. 
// This will trigger artifact's onABPreprocessBeforeCreate and it will find
// this artifact promise and use the data to reconstitute it.
links.create.abCreateBots({ botData, sourceEvent: 'create_artifact_promise' });

const waitForReconstitution = new Promise((resolve, reject) => {
    function cleanup() {
        os.removeBotListener(thisBot, 'onAnyABArtifactReconstituted', handleAnyABArtifactReconstituted);
        os.removeBotListener(thisBot, 'onAnyABArtifactReconstitutionFailed', handleAnyABArtifactReconstitutionFailed);
    }

    function handleAnyABArtifactReconstituted(listenerThat) {
        if (listenerThat.abArtifactInstanceID === abArtifactInstanceID ||
            listenerThat.abArtifactInstanceIDPrevious === abArtifactInstanceID
        ) {
            cleanup();
            resolve(listenerThat);
        }
    }

    function handleAnyABArtifactReconstitutionFailed(listenerThat) {
        if (listenerThat.abArtifactInstanceID === abArtifactInstanceID ||
            listenerThat.abArtifactInstanceIDPrevious === abArtifactInstanceID
        ) {
            cleanup();
            reject(new Error(listenerThat.errorMessage));
        }
    }

    os.addBotListener(thisBot, 'onAnyABArtifactReconstituted', handleAnyABArtifactReconstituted);
    os.addBotListener(thisBot, 'onAnyABArtifactReconstitutionFailed', handleAnyABArtifactReconstitutionFailed);
})

const reconstituteResult = await waitForReconstitution;

return reconstituteResult.shardBots;