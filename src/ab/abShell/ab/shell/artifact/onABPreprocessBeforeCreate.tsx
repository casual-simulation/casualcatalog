if (!thisBot.isReconstitutionEnabled()) {
    console.warn(`[${tags.system}.${tagName}] reconstitution is disabled`);
    return;
}

const { botData, origin, studio, record, version, eggParameters, initialBoot, sourceEvent } = that;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, JSON.parse(JSON.stringify(that)));
}

if (sourceEvent === 'ask' || 
    sourceEvent === 'paste' || 
    sourceEvent === 'boot' || 
    sourceEvent === 'file_upload' ||
    sourceEvent === 'tool' ||
    sourceEvent === 'create_artifact_promise'
) {
    // Check to see if the bots being added are artifact shards that needs to be reconstituted.
    const artifactsToReconstitute: Record<string, ABArtifactReconstituteArg> = {}; // Key is artifact instance id.
    const existingArtifactInstances: Record<string, Bot[]> = thisBot.abGetArtifactInstances();
    const artifactIDsWithNewInstance: Set<string> = new Set(); // This set tracks artifact ids that are already queued to be reconstituted with a new instance id.
    const originalInstanceIDsBeingReplaced: Set<string> = new Set(); // Track original instance IDs that we've already decided to give new instances

    for (const key in botData) {
        const data = botData[key];

        if (data &&
            data.tags.abArtifactName &&
            !data.tags.abArtifactShardReconstituted &&
            data.tags.abArtifactBundle?.startsWith('🧬')
        ) {
            const abArtifactInstanceID: string = data.tags.abArtifactInstanceID;
            const abArtifactInstanceOwner: string = data.tags.abArtifactInstanceOwner;
            const abArtifactBundle: ABArtifactBundle = JSON.parse(data.tags.abArtifactBundle.substring(2));

            if (abArtifactInstanceID) {
                // Shard has an artifact instance ID
                if (existingArtifactInstances[abArtifactInstanceID] && !originalInstanceIDsBeingReplaced.has(abArtifactInstanceID)) {
                    // Case 1: Instance already exists - create new instance (first time we see this collision)
                    const newArtifactInstanceID = uuid();
                    artifactsToReconstitute[newArtifactInstanceID] = {
                        abArtifactBundle,
                        abArtifactInstanceID: newArtifactInstanceID,
                        abArtifactInstanceIDPrevious: abArtifactInstanceID,
                        abArtifactInstanceOwner,
                        eggParameters,
                        toast: false,
                    };

                    artifactIDsWithNewInstance.add(abArtifactBundle.id); // Track that we're creating a new instance for this artifact ID
                    originalInstanceIDsBeingReplaced.add(abArtifactInstanceID); // Track that we've decided to replace this original instance ID

                    if (tags.debug) {
                        console.log(`[${tags.system}.${tagName}] Case 1: Shard from existing instance. Creating new instance. (old: ${abArtifactInstanceID}, new: ${newArtifactInstanceID})`);
                    }

                    delete botData[key];
                } else if (originalInstanceIDsBeingReplaced.has(abArtifactInstanceID)) {
                    // Case 1b: We've already decided to create a new instance for this original ID - dispose.
                    if (tags.debug) {
                        console.log(`[${tags.system}.${tagName}] Case 1b: Additional shard for replaced instance. Disposing. (original: ${abArtifactInstanceID})`);
                    }
                    
                    delete botData[key];
                } else if (artifactsToReconstitute[abArtifactInstanceID]) {
                    // Case 2: Instance already queued for reconstitution - dispose duplicate
                    if (tags.debug) {
                        console.log(`[${tags.system}.${tagName}] Case 2: Duplicate shard for queued instance. Disposing. (abArtifactInstanceID: ${abArtifactInstanceID})`);
                    }

                    delete botData[key];
                } else {
                    // Case 3: Instance to reconstitute with existing ID
                    artifactsToReconstitute[abArtifactInstanceID] = {
                        abArtifactBundle,
                        abArtifactInstanceID,
                        abArtifactInstanceOwner,
                        eggParameters,
                        toast: false,
                    };

                    if (tags.debug) {
                        console.log(`[${tags.system}.${tagName}] Case 3: Instance to reconstitute. (abArtifactInstanceID: ${abArtifactInstanceID})`);
                    }

                    delete botData[key];
                }
            } else {
                // Shard has no artifact instance ID
                if (artifactIDsWithNewInstance.has(abArtifactBundle.id)) {
                    // Case 4: Artifact already has new instance queued - dispose duplicate
                    if (tags.debug) {
                        console.log(`[${tags.system}.${tagName}] Case 4: Duplicate shard for artifact with new instance queued. Disposing. (artifactId: ${abArtifactBundle.id})`);
                    }

                    delete botData[key];
                } else {
                    // Case 5: Create new instance for artifact without instance ID
                    const newArtifactInstanceID = uuid();
                    artifactsToReconstitute[newArtifactInstanceID] = {
                        abArtifactBundle,
                        abArtifactInstanceID: newArtifactInstanceID,
                        abArtifactInstanceOwner,
                        eggParameters,
                        toast: false,
                    };

                    artifactIDsWithNewInstance.add(abArtifactBundle.id);

                    if (tags.debug) {
                        console.log(`[${tags.system}.${tagName}] Case 5: Creating new instance for artifact without instance ID. (new: ${newArtifactInstanceID})`);
                    }

                    delete botData[key];
                }
            }
        } else {
            // This is not a shard bot. Ignore it.
        }
    }

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] artifactsToReconstitute:`, artifactsToReconstitute);
        console.log(`[${tags.system}.${tagName}] existingArtifactInstances:`, existingArtifactInstances);
        console.log(`[${tags.system}.${tagName}] artifactIDsWithNewInstance:`, artifactIDsWithNewInstance);
        console.log(`[${tags.system}.${tagName}] originalInstanceIDsBeingReplaced:`, originalInstanceIDsBeingReplaced);
    }

    for (const abArtifactInstanceID in artifactsToReconstitute) {
        const reconstituteArg: ABArtifactReconstituteArg = artifactsToReconstitute[abArtifactInstanceID];
        
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] Reconstituting artifact instance: ${abArtifactInstanceID}`);
        }
        
        try {
            await thisBot.abArtifactReconstitute(reconstituteArg);
        } catch (e) {
            if (sourceEvent === 'create_artifact_promise') {
                console.log(e);
                // Do a special shout so that the create artifact promise function can catch this error.
                const failureResult = {
                    errorCode: 'artifact_promise_reconstitution_failed',
                    errorMessage: `Reconstitution from artifact promise has failed. Caught error: ${links.utils.getErrorMessage(e)}`,
                    abArtifactName: reconstituteArg.abArtifactBundle.name,
                    abArtifactInstanceID: reconstituteArg.abArtifactInstanceID,
                    abArtifactInstanceIDPrevious: reconstituteArg.abArtifactInstanceIDPrevious,
                    abArtifactInstanceOwner: reconstituteArg.abArtifactInstanceOwner,
                    eggParameters: reconstituteArg.eggParameters,
                    abArtifactBundle: reconstituteArg.abArtifactBundle,
                };

                shout('onAnyABArtifactReconstitutionFailed', failureResult);
            }
            
            throw e;
        }
    }
}