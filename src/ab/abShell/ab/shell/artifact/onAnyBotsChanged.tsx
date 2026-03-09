// console.log(`[${tags.system}.${tagName}] that:`, that);

for (const changed of that) {
    if (changed == null) {
        continue;
    }

    // 1) only care about bots with artifact tags
    if (!changed.bot.tags.abArtifactName || !changed.bot.tags.abArtifactInstanceID) continue;

    // 2) artifact must be reconstituted.
    if (!changed.bot.tags.abArtifactShardReconstituted) continue;

    if (thisBot.isExperienceEnabled()) {
        if (tags.debugExp) {
            console.log(`[${tags.system}.${tagName}] changes on abArtifactInstanceID ${changed.bot.tags.abArtifactInstanceID} detected, calling to update experience.`, JSON.stringify({
                changedBotId: changed.bot.id,
                changedTags: changed.tags,
            }));
        }
        thisBot.abUpdateArtifactInstanceExperience({ abArtifactInstanceID: changed.bot.tags.abArtifactInstanceID });
    } else {
        if (tags.debugExp) {
            console.warn(`[${tags.system}.${tagName}] artifact instance ${changed.bot.tags.abArtifactInstanceID} changed but experience is disabled.`);
        }
    }
}
