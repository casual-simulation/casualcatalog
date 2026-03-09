const {
    abArtifactInstanceID,
    abArtifactInstanceOwner, // [Ryan Cook]: I will need this when I get back to artifact experience state.
} = that ?? {};

assert(typeof abArtifactInstanceID === 'string', `[${tags.system}.${tagName}] abArtifactInstanceID is a required string parameter.`);

if (!thisBot.isExperienceEnabled()) {
    console.warn(`[${tags.system}.${tagName}] experience is disabled.`);
    return;
}

if (!thisBot.vars.instanceDocs) {
    thisBot.vars.instanceDocs = {};
}

if (thisBot.vars.instanceDocs[abArtifactInstanceID]) {
    if (tags.debugExp) {
        console.log(`[${tags.system}.${tagName}] abArtifactInstanceID ${abArtifactInstanceID} already has a document loaded.`);
    }
    return;
}

let experienceAuth: ABArtifactExperienceAuth = await thisBot.abArtifactExperienceAuth({ abArtifactInstanceID });

if (!experienceAuth.authorized) {
    console.error(`[${tags.system}.${tagName}] Artifact experience was not authorized. Reason: ${experienceAuth.failureReason}`);
    return;
}

// Get the artifact instance's shared document as well as the experience map.
const document = await os.getSharedDocument(links.remember.tags.abRecordName, `artifactInstance_${abArtifactInstanceID}`, 'main');
const experienceMap = document.getMap('experience');

const skipKeys = new Set([
    'abArtifactExperienceInitialized',
    // Add more keys here if needed
    // 'someOtherKey',
    // 'yetAnotherKey'
]);

const experienceSub = experienceMap.deepChanges.subscribe((events) => {
    if (tags.debugExp) {
        console.log(`[${tags.system}.${tagName}] on deep changes:`, events);
    }

    // Collect all changed keys
    const allKeys = new Set();
    for (const evt of events ?? []) {
        const m = evt?.changes;
        if (m && typeof m.keys === 'function') {
            for (const k of m.keys()) {
                allKeys.add(k);
            }
        }
    }

    // Skip if *all* changes are inside the skip list
    const shouldSkip = allKeys.size > 0 && [...allKeys].every((k) => skipKeys.has(k));
    if (shouldSkip) {
        if (tags.debugExp) {
            console.log(`[${tags.system}.${tagName}] skipping call to abUpdateArtifactInstanceFromExperience, the only change to the experience were special reserved properties.`);
        }
        return;
    }

    thisBot.abUpdateArtifactInstanceFromExperience({ abArtifactInstanceID });
});

thisBot.vars.instanceDocs[abArtifactInstanceID] = { document, experienceMap, experienceSub};

if (tags.debugExp) {
    console.log(`[${tags.system}.${tagName}] abArtifactInstanceID ${abArtifactInstanceID} instance document loaded:`, thisBot.vars.instanceDocs[abArtifactInstanceID]);

    const experienceJSON = JSON.parse(JSON.stringify(experienceMap.toJSON()));
    console.log(`[${tags.system}.${tagName}] abArtifactInstanceID ${abArtifactInstanceID} loaded experience map state:`, experienceJSON);
}

const abArtifactExperienceInitialized = experienceMap.get('abArtifactExperienceInitialized');

if (abArtifactExperienceInitialized === true) {
    if (tags.debugExp) {
        console.log(`[${tags.system}.${tagName}] updating abArtifactInstanceID ${abArtifactInstanceID} from experience.`);
    }
    // Immediately give the shard bots the current experience state.
    await thisBot.abUpdateArtifactInstanceFromExperience({ abArtifactInstanceID });
} else {
    if (tags.debugExp) {
        console.log(`[${tags.system}.${tagName}] initializing abArtifactInstanceID ${abArtifactInstanceID} experience.`);
    }
    // Initialize the experience state with the current shard data.
    await thisBot.abUpdateArtifactInstanceExperience({ abArtifactInstanceID });    
}
