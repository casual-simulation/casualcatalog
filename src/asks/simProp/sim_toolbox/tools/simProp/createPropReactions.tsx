//make onClick
const abArtifactShard = {
    data: {
        label: 'onClick',
        propReactionType: 'onClick',
        actionTriggers: [tags.simID],
        dimensionData: {
            dimension: 'blueprint',
            blueprint: true,
            blueprintX: tags.blueprintX + 3,
            blueprintY: tags.blueprintY
        }
    },
    dependencies: [
        {
            askID: 'simPropReaction'
        }
    ]
};
const clickBot = await ab.links.artifact.abCreateArtifactPromiseBot({
    abArtifactName: 'simPropReaction',
    abArtifactInstanceID: uuid(),
    abArtifactShard,
});

//make onDrag
const abArtifactShard2 = {
    data: {
        label: 'onDrag',
        propReactionType: 'onDrag',
        actionTriggers: [tags.simID],
        dimensionData: {
            dimension: 'blueprint',
            blueprint: true,
            blueprintX: tags.blueprintX,
            blueprintY: tags.blueprintY + 3
        }
    },
    dependencies: [
        {
            askID: 'simPropReaction'
        }
    ]
};
const dragBot = await ab.links.artifact.abCreateArtifactPromiseBot({
    abArtifactName: 'simPropReaction',
    abArtifactInstanceID: uuid(),
    abArtifactShard: abArtifactShard2,
});