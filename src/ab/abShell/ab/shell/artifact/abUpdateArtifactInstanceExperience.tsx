import { SharedMap } from 'casualos';

const {
    abArtifactInstanceID,
} = that ?? {}

assert(typeof abArtifactInstanceID === 'string', `[${tags.system}.${tagName}] abArtifactInstanceID is a required string parameter.`);

if (!thisBot.isExperienceEnabled()) {
    if (tags.debugExp) {
        console.warn(`[${tags.system}.${tagName}] experience is disabled.`);
    }
    return;
}

if (!thisBot.vars.activeExperienceUpdates) {
    thisBot.vars.activeExperienceUpdates = new Set();
}

if (thisBot.vars.activeExperienceUpdates.has(abArtifactInstanceID)) {
    if (tags.debugExp) {
        console.log(`[${tags.system}.${tagName}] experience update is already in progress for abArtifactInstanceID ${abArtifactInstanceID}`);
    }
    return;
}

thisBot.vars.activeExperienceUpdates.add(abArtifactInstanceID);

if (thisBot.vars.instanceDocs) {
    const instanceDoc = thisBot.vars.instanceDocs[abArtifactInstanceID];

    if (instanceDoc) {
        const shardBots = thisBot.abGetArtifactInstanceShardBots({ abArtifactInstanceID });

        // Need to ask if this user is allowed to update the experience of this artifact instance.
        const canUserUpdate = await thisBot.canUserUpdateExperience({ remoteId: configBot.id, shardBot: shardBots[0] });

        if (tags.debugExp) {
            console.log(`[${tags.system}.${tagName}] can user update experience for abArtifactInstanceID ${shardBots[0].tags.abArtifactInstanceID.substring(0, 7)}?`, canUserUpdate);
        }

        if (canUserUpdate) {
            let collectShardResult: ABArtifactCollectShardsResult;

            try {
                collectShardResult = await thisBot.abCollectArtifactShards({ shardBots });

                if (!collectShardResult.success) {
                    console.error(collectShardResult.reason);
                }
            } catch (e) {
                console.error(e);
            }

            if (tags.debugExp) {
                console.log(`[${tags.system}.${tagName}] abArtifactInstanceID:`, abArtifactInstanceID, `collectShardResult:`, JSON.stringify(collectShardResult));
            }

            if (collectShardResult && collectShardResult.success) {
                // Only update entry in experienceMap if the data is actually different.
                const experienceMap: SharedMap = instanceDoc.experienceMap;

                // Safety: shard data might be undefined/null
                const shardData = (collectShardResult.shard && collectShardResult.shard.data) ? collectShardResult.shard.data : {};
                const shardDataKeys = Object.keys(shardData);
                const keysToDelete = [];

                // Simple deep-equality check for JSON-serializable values
                const isEqual = (a, b) => {
                    if (a === b) return true;
                    try {
                        return JSON.stringify(a) === JSON.stringify(b);
                    } catch {
                        return false;
                    }
                };

                // 1) Upsert only when different
                for (const key of shardDataKeys) {
                    const newVal = shardData[key];
                    const oldVal = experienceMap.get(key);
                    if (!isEqual(oldVal, newVal)) {
                        if (tags.debugExp) {
                            console.log(`[${tags.system}.${tagName}] updating experienceMap key "${key}"`, JSON.stringify({ oldVal, newVal }));
                        }
                        experienceMap.set(key, newVal);
                    }
                }

                // 2) Collect keys that exist in the map but not in the shard data
                //    (we avoid mutating the map while iterating it)
                for (const key of experienceMap.keys()) {
                    if (key === 'abArtifactExperienceInitialized') {
                        // Don't delete abArtifactExperienceInitialized. Its a special property.
                        continue;
                    }
                    
                    if (!shardDataKeys.includes(key)) {
                        keysToDelete.push(key);
                    }
                }

                // 3) Remove stale keys
                for (const key of keysToDelete) {
                    if (tags.debugExp) {
                        console.log(`[${tags.system}.${tagName}] deleting stale experienceMap key "${key}"`);
                    }
                    experienceMap.delete(key);
                }

                if (experienceMap.get('abArtifactExperienceInitialized') != true) {
                    experienceMap.set('abArtifactExperienceInitialized', true);
                }
            }
        }
    } else {
        if (tags.debugExp) {
            console.warn(`[${tags.system}.${tagName}] cannot update abArtifactInstanceID ${abArtifactInstanceID} because instance document not loaded.`);
        }
    }
} else {
    if (tags.debugExp) {
        console.warn(`[${tags.system}.${tagName}] cannot update abArtifactInstanceID ${abArtifactInstanceID} because instance documents have not been initialized.`);
    }
}

thisBot.vars.activeExperienceUpdates.delete(abArtifactInstanceID);