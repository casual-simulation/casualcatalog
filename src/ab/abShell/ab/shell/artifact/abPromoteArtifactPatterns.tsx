// "Promote" means: turn artifact pattern bots into a live artifact instance.
//
// An artifact PATTERN is just a set of bots that carry abArtifactName but have no instance
// metadata (no abArtifactInstanceID, no abArtifactBundle). Loading a pattern ask gives you
// these bots in their default state. Promotion assigns them a fresh instance ID, collects
// their shard data via abUpdateArtifactShards, and writes the resulting bundle back so they
// become a fully-formed artifact instance that can be saved, reconstituted, and synced.

const { hatchedBots, abArtifactInstanceOwner } = that ?? {};

assert(Array.isArray(hatchedBots), `[${tags.system}.${tagName}] hatchedBots is required to be a Bot array.`);

const owner = abArtifactInstanceOwner ?? authBot?.id ?? ab.links.remember.tags.abRecordName;

// Group unpromoted pattern bots by artifact name — a single ask can contain multiple artifacts.
const patternGroups = {};

for (const bot of hatchedBots) {
    // Skip bots that already have an instance ID — they were promoted upstream (e.g., by a
    // bot's own onEggHatch) and the guard makes this step idempotent.
    if (bot.tags.abArtifactName && !bot.tags.abArtifactInstanceID) {
        const name = bot.tags.abArtifactName;
        if (!patternGroups[name]) {
            patternGroups[name] = [];
        }
        patternGroups[name].push(bot);
    }
}

const promoted = [];

for (const abArtifactName in patternGroups) {
    const group = patternGroups[abArtifactName];
    const abArtifactInstanceID = uuid();

    for (const bot of group) {
        bot.tags.abArtifactInstanceID = abArtifactInstanceID;
        bot.tags.abArtifactInstanceOwner = owner;
        bot.tags.abArtifactShardInstanceID = uuid();
    }

    await thisBot.abUpdateArtifactShards({
        abArtifactName,
        abArtifactInstanceID,
        abArtifactInstanceOwner: owner,
    });

    promoted.push({ abArtifactName, abArtifactInstanceID });
}

if (tags.debug && promoted.length > 0) {
    console.log(`[${tags.system}.${tagName}] promoted ${promoted.length} artifact pattern(s):`, promoted);
}

return { promoted };
