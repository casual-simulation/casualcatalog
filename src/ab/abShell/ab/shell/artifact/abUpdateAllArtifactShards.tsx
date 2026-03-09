const artifactInstances: Record<string, Bot[]> = thisBot.abGetArtifactInstances();

for (const abArtifactInstanceID in artifactInstances) {
    const shardBot = artifactInstances[abArtifactInstanceID].find(b => b != null);

    if (!shardBot) {
        console.warn(`[${tags.system}.${tagName}] unable to update abArtifactInstanceID ${abArtifactInstanceID} because there were no shard bots found.`);
        continue;
    }

    const abArtifactName = shardBot.tags.abArtifactName;
    const abArtifactInstanceOwner = shardBot.tags.abArtifactInstanceOwner;
    
    await thisBot.abUpdateArtifactShards({ abArtifactName, abArtifactInstanceID, abArtifactInstanceOwner });
}