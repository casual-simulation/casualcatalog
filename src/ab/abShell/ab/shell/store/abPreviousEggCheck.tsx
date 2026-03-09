//this function checks for previous eggs at a specified ab, returning any data that it finds
const abID = that?.abID;
const recordKeyOrName = that?.recordKeyOrName ?? configBot.tags.selected_studioID ?? configBot.tags.studio ?? authBot.id;

assert(typeof abID === 'string', `[${tags.system}.${tagName}] abID is a required string parameter`);
assert(typeof recordKeyOrName === 'string', `[${tags.system}.${tagName}] recordKeyOrName is a required string parameter.`);

await os.requestAuthBot();

let eggHistory;
let eggID;
let targetVersionNum;
let lastHash;
let maxVersionNum;
let stableVersion;
let feedbackVersion;
let previousXP;
let recordLookup = await os.getData(recordKeyOrName, abID).catch(e => {});

if (recordLookup.success) 
{
    eggHistory = recordLookup.data.eggVersionHistory;
    eggID = recordLookup.data.eggID;
    previousXP = recordLookup.data.xp ?? 0;
    targetVersionNum = eggHistory.length + 1;
    lastHash = eggHistory[targetVersionNum - 1];
    stableVersion = recordLookup.data.stableVersion;
    feedbackVersion = recordLookup.data.feedbackVersion;
    maxVersionNum = eggHistory.length + 1;
} 
else 
{
    eggHistory = [];
    eggID = uuid();
    targetVersionNum = 1;
    lastHash = "none";
    maxVersionNum = 1;
    previousXP = 0;
}

if (configBot.tags.versionDefined == "feedback") 
{
    feedbackVersion = eggHistory.length + 1;
}
else if (configBot.tags.versionDefined == "stable")
{
    stableVersion = eggHistory.length + 1;
}

configBot.tags.versionDefined = null;

let egg = {};

egg.eggVersionHistory = eggHistory;
egg.eggFormatVersion = eggID;
egg.targetVersion = targetVersionNum;
egg.maxVersion = maxVersionNum;
egg.label = "v"+targetVersionNum;
egg.stableVersion = stableVersion;
egg.feedbackVersion = feedbackVersion;
egg.abID = abID;
egg.xp = links.learn.tags.abXP;

let signature = {};
let date = new Date();
let time = date.getTime();

signature.previousHash = lastHash;
signature.abVersion = links.remember.tags.abCoreVersion;
signature.eggVersion = tags.eggUUID;
signature.eggVersionNum = tags.ovoVersion;
signature.timeStamp = time;
signature.casualOSVersion = [os.version()];

return {signature: signature, eggData: egg};