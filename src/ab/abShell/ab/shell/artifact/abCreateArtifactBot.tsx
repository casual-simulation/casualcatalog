const {
    abArtifactName,
    abArtifactInstanceID,
    abArtifactInstanceOwner = authBot?.id ?? ab.links.remember.tags.abRecordName,
    dimension = links.learn.tags.abInst ?? 'home',
    position = new Vector3(0, 0, 0),
    otherTags = {},
} = that ?? {};

assert(abArtifactName, `[${tags.system}.${tagName}] abArtifactName is a required parameter.`);
assert(typeof abArtifactInstanceID === 'string', `[${tags.system}.${tagName}] abArtifactInstanceID is a required string parameter.`);

const abArtifactBaseColor = links.remember.tags.abArtifactBaseColor ?? tags.abArtifactBaseColorDefault;
const abArtifactLabelColor = links.remember.tags.abArtifactLabelColor ?? tags.abArtifactLabelColorDefault;

const abArtifactBot = create({
    space: 'shared',
    abArtifactName,
    abArtifactInstanceID,
    abArtifactInstanceOwner,
    abArtifactBot: true,
    [dimension]: true,
    [`${dimension}X`]: position.x,
    [`${dimension}Y`]: position.y,
    [`${dimension}Z`]: position.z,
    color: abArtifactBaseColor,
    cursor: 'pointer',
    labelColor: abArtifactLabelColor,
    strokeColor: abArtifactLabelColor,
    onBotAdded: `@
        thisBot.updateComputedTags();
    `,
    onBotChanged: `@
        const changedTags = that.tags;

        if (changedTags.some(t => t === 'abArtifactInstanceID' || t === 'abArtifactName')) {
            thisBot.updateComputedTags();
        }
    `,
    updateComputedTags: `@
        let system = 'abArtifactBot';

        if (tags.abArtifactName) {
            system += '.' + tags.abArtifactName;
        }

        if (tags.abArtifactInstanceID) {
            system += '.' + tags.abArtifactInstanceID.substring(0, 7);
        }

        tags.system = !!system ? system : null;
        tags.label = tags.system;
    `,
    onABArtifactReconstitute: `@
        // Hide artifact bot once it has been reconstituted.
        setTagMask(thisBot, 'form', 'nothing', 'shared');
        setTagMask(thisBot, 'label', ' ', 'shared');
    `,
    ...otherTags,
});

try {
    // Update all the shards for this artifact instance -- which now includes this bot!
    const updateResult = await thisBot.abUpdateArtifactShards({ abArtifactName, abArtifactInstanceID, abArtifactInstanceOwner });

    if (!updateResult.success) {
        throw new Error(`Failed to update '${abArtifactName}' artifact shards.`);
    }
} catch (e) {
    console.error(`[${tags.system}.${tagName}] Caught error while update artifact shards:`, e);
    destroy(abArtifactBot);
    return null;
}

return abArtifactBot;