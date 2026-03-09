masks.instJoined = true;

const artifactInstances = thisBot.abGetArtifactInstances();

for (let abArtifactInstanceID in artifactInstances) {
    if (tags.debugExp) {
        console.log(`[${tags.system}.${tagName}] loading artifact instance document for abArtifactInstanceID ${abArtifactInstanceID}`);
    }
    
    thisBot.abLoadArtifactInstanceDocument({ abArtifactInstanceID });
}

// Collect all reconstitution signal bots into a local set so we know when they are removed.
const reconstitutingSignalBots = getBots(b => b.tags.abReconstitutingArtifactSignalBot);
for (const signalBot of reconstitutingSignalBots) {
    thisBot.vars.reconstitutingSignalBotIds.add(signalBot.id);
}

if (reconstitutingSignalBots.length === 0) {
    thisBot.abCheckArtifactReconstitutionAtRest();
}