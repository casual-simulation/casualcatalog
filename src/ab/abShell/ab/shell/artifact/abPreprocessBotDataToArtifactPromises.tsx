/**
 * This function takes botData (from onABPreprocessBefore* calls) and replaces any shard bots with artifact promise bots.
 */

const botData = that?.botData;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] starting botData:`, {...botData});
}

assert(typeof botData === 'object', `[${tags.system}.${tagName}] botData is a required object.`);

// Detect artifact instances that need to be converted into artifact promises.

/** key: artifact instance id, value: artifact promise data. */
const artifactInstancesWithPromise = new Set(); // Keep track of what artifact instance IDs have had an artifact promise made.

for (const key in botData) {
    const data = botData[key];

    if (data.tags.abArtifactName && data.tags.abArtifactInstanceID) {
        // This is an artifact instance shard bot.
        if (!artifactInstancesWithPromise.has(data.tags.abArtifactInstanceID)) {
            // This artifact instance needs an artifact promise made for it.
            const promiseId = uuid();

            botData[promiseId] = {
                id: promiseId,
                space: 'shared',
                tags: {
                    abArtifactName: data.tags.abArtifactName,
                    abArtifactInstanceID: data.tags.abArtifactInstanceID,
                    abArtifactInstanceOwner: data.tags.abArtifactInstanceOwner,
                    abArtifactBundle: data.tags.abArtifactBundle,
                    abArtifactPromise: true,
                }
            }

            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] Converted abArtifactInstanceID ${data.tags.abArtifactInstanceID} into an artifact promise:`, botData[promiseId]);
            }
            
            artifactInstancesWithPromise.add(data.tags.abArtifactInstanceID);
        }

        // Remove artifact instance shard bot from botData that is about to be published.
        delete botData[key];
    }
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] finished botData:`, {...botData});
}