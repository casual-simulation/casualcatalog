const { shardBots } = that ?? {};

assert(Array.isArray(shardBots), `[${tags.system}.${tagName}] shardBots is required to be an bot array.`);

/** Keep track of dependency hashes. This prevents duplicates in the artifact dependencies. */
const dependencyHashes = new Set();

let mergedShard: ABArtifactShard = {
    data: {},
    dependencies: [],
};

for (const shardBot of shardBots) {
    const abArtifactName = shardBot.tags.abArtifactName;
    const botShortId = shardBot.id.substring(0, 5);

    let shard: ABArtifactShard;
    if (shardBot.tags[tags.collectShardsListenTag]) {
        if (shardBot[tags.collectShardsListenTag]) {
            shard = await Promise.resolve(shardBot[tags.collectShardsListenTag]());
        } else {
            return { success: false, reason: `Artifact '${abArtifactName}' bot '${botShortId}' ${tags.collectShardsListenTag} tag is defined but is not a valid function.` };
        }
    }

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] artifact: ${abArtifactName}, bot: ${botShortId}, shard:`, shard);
    }

    if (shard) {
        if (!links.utils.isObject(shard)) {
            return { success: false, reason: `Artifact '${abArtifactName}' bot '${botShortId}' @${tags.collectShardsListenTag} shard must be an object.` };
        }

        if (shard.data) {
            if (!links.utils.isObject(shard.data)) {
                return { success: false, reason: `Artifact '${abArtifactName}' bot '${botShortId}' @${tags.collectShardsListenTag} shard 'data' property must be an object.` };
            }

            // Shallow merge shard's data properties into combined artifact data.
            mergedShard.data = { ...mergedShard.data, ...shard.data };
        }

        if (shard.dependencies) {
            if (!links.utils.isArray(shard.dependencies)) {
                return { success: false, reason: `Artifact '${abArtifactName}' bot '${botShortId}' @${tags.collectShardsListenTag} shard 'dependencies' property must be an array.` };
            }

            for (const dependency of shard.dependencies) {
                // Validate that dependency is one of the supported types.
                if (!thisBot.isEggDependency(dependency) && !thisBot.isAskDependency(dependency)) {
                    return { success: false, reason: `Artifact '${abArtifactName}' bot '${botShortId}' has a dependency entry that is neither an egg or ask dependency type.` };
                }

                // Make sure this dependency isnt already collected.
                const hash = crypto.hash('sha1', 'hex', dependency);

                if (!dependencyHashes.has(hash)) {
                    dependencyHashes.add(hash);
                    mergedShard.dependencies.push(dependency);
                }
            }
        }
    }
}

// Make sure we have at least one dependency.
if (mergedShard.dependencies.length === 0) {
    return { success: false, reason: `Artifact '${abArtifactName}' must list at least one dependency in order to reconstitute properly.` };
}

const result: ABArtifactCollectShardsResult = {
    success: true,
    shard: mergedShard,
}

return result;