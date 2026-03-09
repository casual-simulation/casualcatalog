const abArtifactName = that.abArtifactName;
let abArtifactInstanceID = that.abArtifactInstanceID;
let abArtifactInstanceOwner = that.abArtifactInstanceOwner ?? authBot?.id ?? ab.links.remember.tags.abRecordName;

assert(abArtifactName, `[${tags.system}.${tagName}] abArtifactName is a required parameter.`);
assert(typeof abArtifactInstanceID === 'string', `[${tags.system}.${tagName}] abArtifactInstanceID is a required string parameter.`);

const shardBots = thisBot.abGetArtifactInstanceShardBots({ abArtifactInstanceID });

if (shardBots.length === 0) {
    links.utils.abLogAndToast({ message: `There are no shards for artifact name '${abArtifactName}'.`, logType: 'warn' });
    return { success: false };
}

const prevArtifactBundle: ABArtifactBundle = shardBots[0].tags.abArtifactBundle;
const prevArtifactID = prevArtifactBundle ? prevArtifactBundle.id : null;
const prevArtifactInstanceOwner = shardBots[0].tags.abArtifactInstanceOwner;

let collectShardResult: ABArtifactCollectShardsResult;

try {
    collectShardResult = await thisBot.abCollectArtifactShards({ shardBots });

    if (!collectShardResult.success) {
        links.utils.abLogAndToast({ message: collectShardResult.reason, logType: 'error' });
        return { success: false }
    }
} catch(e) {
    console.error(e);
    links.utils.abLogAndToast({ message: `Something went wrong collecting shards. See console for more details.`, logType: 'error' });
    return { success: false }
}

const abArtifactBundle: ABArtifactBundle = thisBot.abCreateArtifactBundle({ abArtifactName, abArtifactShard: collectShardResult.shard });

if (prevArtifactID && prevArtifactID !== abArtifactBundle.id) {
    // The artifact has a new id. All of the shard bots need a new instance id as well.
    abArtifactInstanceID = uuid();

    for (const shardBot of shardBots) {
        shardBot.tags.abArtifactInstanceID = abArtifactInstanceID;
        shardBot.tags.abArtifactShardInstanceID = uuid();
        shardBot.tags.abArtifactInstanceOwner = abArtifactInstanceOwner;
    }
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] final merged artifact ${abArtifactName}:`, abArtifactBundle);
}

// Every shard bot gets a copy of the artifact bundle.
// This makes the artifact holographic by nature. This means that any shard can be used to reconstitute the whole.
for (const shardBot of shardBots) {
    // Mark each shard bot as being 'reconstituted' when we update the artifact.
    // Because this is a shared tag mask, it will only be true in the current inst.
    setTagMask(shardBot, 'abArtifactShardReconstituted', true, 'shared');
    shardBot.tags.abArtifactBundle =  '🧬' + JSON.stringify(abArtifactBundle);

    // If the shardBot hasnt been marked as having an instance owner OR its owner doesnt match the one being provided to
    // this update function then we change it.
    if (!shardBot.tags.abArtifactInstanceOwner || shardBot.tags.abArtifactInstanceOwner !== abArtifactInstanceOwner) {
        shardBot.tags.abArtifactInstanceOwner = abArtifactInstanceOwner;
    }
}

// Ryan Cook: Need to give CasualOS a chance to catchup.
// Found that if we didnt do this, mod tags would not be returned as JSON objects but instead the raw string.
await os.sleep(0);

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] updated artifact '${abArtifactName}'. Copied artifact bundle to ${shardBots.length} bots. abArtifactBundle:`, abArtifactBundle);
}

shout('onAnyABArtifactShardsUpdated', { abArtifactName, abArtifactInstanceID, abArtifactInstanceOwner, abArtifactBundle, shardBots })

// Shard update successful.
return { success: true };