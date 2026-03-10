if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] checking...`);
}

// Clear any currently running "at rest" check.
if (masks.atRestTimeoutId) {
    clearTimeout(masks.atRestTimeoutId);
    masks.atRestTimeoutId = null;

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] cleared previous "at rest" check.`);
    }
}

async function check() {
    const reconstitutingSignalBots = getBots(b => b.tags.abReconstitutingArtifactSignalBot);

    if (reconstitutingSignalBots.length === 0) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] artifact reconsititution is at rest`);
        }
        
        shout('onABArtifactReconstitutionAtRest');
    }

    masks.atRestTimeoutId = null;
}

masks.atRestTimeoutId = setTimeout(check, tags.checkAtRestWaitMS);
