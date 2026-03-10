const {
    abArtifactInstanceID
} = that ?? {};

assert(typeof abArtifactInstanceID === 'string', `[${tags.system}.${tagName}] abArtifactInstanceID is a required string parameter.`);

if (thisBot.vars.instanceDocs) {
    const { document, experienceMap, experienceSub } = thisBot.vars.instanceDocs[abArtifactInstanceID]; 

    if (experienceSub) {
        experienceSub.unsubscribe();

        if (tags.debugExp) {
            console.log(`[${tags.system}.${tagName}] unsubscribed from abArtifactInstanceID ${abArtifactInstanceID} experience map.`);
        }
    }

    delete thisBot.vars.instanceDocs[abArtifactInstanceID];

    if (tags.debugExp) {
        console.log(`[${tags.system}.${tagName}] removed abArtifactInstanceID ${abArtifactInstanceID} document.`);
    }
}