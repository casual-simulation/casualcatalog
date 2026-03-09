//shout("abPatternUpdate", {abID: abID, studio:studio?, bots: bots?});
await os.requestAuthBot();

if (!authBot)
{
    return;
}

const abID = that.abID;
const studio = that.studio ? that.studio : configBot.tags.studio ? configBot.tags.studio : authBot.id;
const abManifest = getBot(byMod({abEgg: true, origin_ab: abID}));

if (!abManifest)
{
    shout("onLookupABEggs", {abID: abID, recordKey: studio, autoHatch: true, sourceEvent: 'pattern_update'});

    return;
}

configBot.tags.selected_studioID = studio;

const abBots = that.bots ?? getBots("abIDOrigin", abID);

await thisBot.abPublishAB({ab: abID, target: abBots, publicFacing: true, sourceEvent: 'pattern_update'});