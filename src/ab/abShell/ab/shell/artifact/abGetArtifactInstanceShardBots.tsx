const {
    abArtifactInstanceID,
} = that ?? {};

assert(typeof abArtifactInstanceID === 'string', `[${tags.system}.${tagName}] abArtifactInstanceID is a required string parameter.`);

const shardBots = getBots((b) => {
    return b.tags.abArtifactInstanceID === abArtifactInstanceID
});

return shardBots;