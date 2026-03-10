const abID = that?.abID;
const currentABVersion = that?.currentABVersion; // 1-based version number.
const recordKeyOrName = that?.recordKeyOrName;

assert(typeof abID === 'string', `[${tags.system}.${tagName}] abID is a required string parameter`);
assert(Number.isInteger(currentABVersion) && currentABVersion > 0, `[${tags.system}.${tagName}] currentABVersion must be an integer greater than 0.`);
assert(typeof recordKeyOrName === 'string', `[${tags.system}.${tagName}] recordKeyOrName is a required string parameter.`);

const egg = await ab.links.search.onLookupABEggs({ abID, recordKey: recordKeyOrName, returnType: 'egg'});

if (!egg || egg.success === false) {
    return {
        success: false
    }
} else {
    return {
        success: true,
        updateAvailable: egg.eggVersionHistory.length > currentABVersion,
        currentABVersion,
        latestABVersion: egg.eggVersionHistory.length,
    }
}
